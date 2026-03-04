import os
import json
import base64
import concurrent.futures
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from google.genai import types
from openai import OpenAI
from supabase import create_client, Client

# Load Environment Variables
# Crucial: User must add their own keys to the .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for the React frontend (allow Vercel frontend)
CORS(app, resources={r"/*": {"origins": ["https://fraud-detection-system-jade.vercel.app", "http://localhost:3000", "http://localhost:5173"]}})

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "Guardian AI Fraud Detection Backend is Running",
        "status": "online",
        "endpoints": ["/analyze", "/health"]
    })

# Configuration for Gemini (New SDK: google-genai)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_client = None
if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)

# Configuration for Grok (xAI) or Groq
GROK_API_KEY = os.getenv("GROK_API_KEY")
grok_client = None
grok_model = "grok-2" # default for xAI

if GROK_API_KEY and GROK_API_KEY != "your_grok_api_key_here":
    base_url = "https://api.x.ai/v1"
    # If it's a Groq key (gsk prefix), use Groq's endpoint
    if GROK_API_KEY.startswith("gsk_"):
        base_url = "https://api.groq.com/openai/v1"
        grok_model = "llama-3.3-70b-versatile"
        grok_vision_model = "llama-3.2-90b-vision-preview" # 11b decommissioned
        print(f"Detected Groq key. Using Groq API at {base_url} with model {grok_model}")
    else:
        print(f"Using xAI Grok API at {base_url}")
        grok_vision_model = "grok-2" # Fallback if vision needed
        
    grok_client = OpenAI(
        api_key=GROK_API_KEY,
        base_url=base_url,
        timeout=20.0 # Prevent long hangs
    )

# Configuration for Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase_client: Client = None

if SUPABASE_URL and SUPABASE_KEY and SUPABASE_URL != "https://your-project.supabase.co":
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Supabase client initialized successfully.")
    except Exception as e:
        print(f"Supabase Init Error: {e}")

SYSTEM_PROMPT = """
You are a MULTI-LINGUAL FRAUD INVESTIGATOR AI. Your mission is to protect diverse people from scams across all major Indian languages. 

KINDLY FOLLOW THESE STRICT DIRECTIVES:
1. LANGUAGE CONSISTENCY: You will be provided with a target language. You MUST provide the 'analysis_logic' and 'safety_tips' in that EXACT language.
2. BE SIMPLE & PROTECTIVE: Use clear, non-technical language to explain why something is a scam.
3. JSON RESPONSE FORMAT:
{
  "risk_score": (0-100),
  "risk_level": "Safe" | "Suspicious" | "High Risk",
  "fraud_category": "UPI Fraud" | "Job Scam" | "Lottery Scam" | "Phishing" | "WhatsApp Scam",
  "suspicious_keywords": ["Word1", "Word2"],
  "analysis_logic": "Explain the scam in the PROVIDED LANGUAGE (2-3 sentences)",
  "safety_tips": ["Action 1 in provided language", "Action 2 in provided language"]
}
"""

def ocr_with_gemini(image_bytes):
    """Specific step to extract text from an image for better reliability."""
    try:
        if not gemini_client:
            return None
        
        response = gemini_client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[
                "OCR this image. Extract EVERY piece of text you see. Be extremely accurate. Return ONLY the extracted text.",
                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
            ]
        )
        return response.text.strip()
    except Exception as e:
        print(f"OCR Step Error: {e}")
        return None

def analyze_with_gemini(message, language="English"):
    try:
        if not gemini_client:
            print("Gemini client not initialized. Check your API key.")
            return None
        
        response = gemini_client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[SYSTEM_PROMPT, f"TARGET LANGUAGE: {language}\nMessage to analyze: {message}"]
        )
        
        text = response.text
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
             text = text.split("```")[1].strip()
             
        res = json.loads(text)
        res['mode'] = 'Gemini-Text'
        return res
    except Exception as e:
        print(f"Gemini (Text) Error: {e}")
        return None

def analyze_with_grok(message, language="English"):
    try:
        if not grok_client:
            return None
            
        completion = grok_client.chat.completions.create(
            model=grok_model, 
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"TARGET LANGUAGE: {language}\nMessage to analyze: {message}"},
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Grok/Groq error: {e}")
        return None

def analyze_image_with_gemini(image_bytes, message="", language="English"):
    try:
        if not gemini_client:
            print("Gemini client not initialized for Vision.")
            return None
        
        user_context = f"\nUser Question/Context: {message}" if message else ""
        vision_instruction = f"TARGET LANGUAGE: {language}\nPERFORM DEEP FRAUD ANALYSIS. OCR this image. Detect scam signals.{user_context}"
        
        # Simpler 'contents' format to avoid pydantic validation errors
        response = gemini_client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[
                SYSTEM_PROMPT,
                vision_instruction,
                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
            ],
            config=types.GenerateContentConfig(
                response_mime_type='application/json'
            )
        )
        
        # Result from newer SDK is potentially cleaner with response_mime_type
        res = json.loads(response.text)
        res['mode'] = 'Gemini-Vision'
        return res
    except Exception as e:
        print(f"Gemini (Vision) Error: {e}")
        return None

def analyze_image_with_groq(image_bytes, message="", language="English"):
    try:
        if not grok_client:
            return None
            
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        user_context = f"\nFocus on: {message}" if message else ""
        prompt = f"TARGET LANGUAGE: {language}\nPERFORM DEEP FRAUD ANALYSIS. OCR the text. Look for scam signals in this image.{user_context}"
        
        completion = grok_client.chat.completions.create(
            model=grok_vision_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                        },
                    ],
                }
            ],
            response_format={"type": "json_object"}
        )
        res = json.loads(completion.choices[0].message.content)
        res['mode'] = 'Groq-Vision'
        return res
    except Exception as e:
        print(f"Groq Vision error: {e}")
        return None

def get_fallback_analysis(message):
    """Provides a basic analysis if AI services are down/misconfigured"""
    message_lc = message.lower()
    
    # Simple heuristic fallback
    is_high_risk = any(word in message_lc for word in ["otp", "winner", "blocked", "lottery", "verify", "click here", "urgent", "account suspend"])
    
    return {
        "risk_score": 85 if is_high_risk else 15,
        "risk_level": "High Risk" if is_high_risk else "Safe",
        "fraud_category": "Phishing" if is_high_risk else "None",
        "suspicious_keywords": [w for w in ["otp", "winner", "blocked", "lottery", "verify", "http"] if w in message_lc],
        "analysis_logic": "Demo/Fallback analysis triggered. The message contains patterns typically associated with scams.",
        "safety_tips": ["Do not click unknown links", "Never share OTP values", "Verify by calling the official bank number"],
        "official_helpline": "1930",
        "mode": "DEMO"
    }

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "active", 
        "gemini_active": bool(gemini_client), 
        "grok_active": bool(grok_client)
    })

@app.route('/analyze', methods=['POST'])
def analyze_message():
    # Handle multipart/form-data for image uploads
    message = request.form.get('message', '')
    image_file = request.files.get('file')
    lang_code = request.form.get('language', 'en-IN')

    # Map language codes to Names for AI context
    lang_map = {
        'en-IN': 'English',
        'hi-IN': 'Hindi',
        'ta-IN': 'Tamil',
        'te-IN': 'Telugu',
        'kn-IN': 'Kannada',
        'ml-IN': 'Malayalam',
        'bn-IN': 'Bangla',
        'mr-IN': 'Marathi',
        'gu-IN': 'Gujarati',
        'pa-IN': 'Punjabi'
    }
    target_lang = lang_map.get(lang_code, 'English')

    # If JSON provided instead
    if not message and request.is_json:
        data = request.json
        message = data.get('message', '')
        target_lang = lang_map.get(data.get('language', 'en-IN'), 'English')

    if not message and not image_file:
        return jsonify({"error": "No message or image provided"}), 400

    final_result = None

    # Priority 1: Image Analysis (Parallelize Gemini and Groq - First Success Wins)
    if image_file:
        print(f"Analyzing image for {target_lang} with parallel AI models (Race Mode)...")
        image_bytes = image_file.read()
        
        # New Strategy: Extract Text First if vision analysis fails or for better precision
        extracted_text = ocr_with_gemini(image_bytes)
        if extracted_text:
            print(f"OCR Success: Found {len(extracted_text)} characters.")
            combined_message = f"{message}\n[Extracted from Image]: {extracted_text}"
            message = combined_message.strip()

        with concurrent.futures.ThreadPoolExecutor() as executor:
            # Launch both in parallel
            futures = [
                executor.submit(analyze_image_with_gemini, image_bytes, message, target_lang),
                executor.submit(analyze_image_with_groq, image_bytes, message, target_lang)
            ]
            
            # Return the first successful result as soon as it arrives
            try:
                for future in concurrent.futures.as_completed(futures, timeout=12):
                    try:
                        res = future.result()
                        if res:
                            final_result = res
                            print(f"Image analysis completed by {res.get('mode', 'AI')}")
                            break
                    except Exception as e:
                        print(f"Model failure in race: {e}")
                        continue
            except concurrent.futures.TimeoutError:
                print("Image vision models timed out. Moving to text analysis.")

    # Priority 2: Text Analysis if image failed or not provided
    if not final_result and message:
        print(f"Analyzing text message ({target_lang}): {message[:50]}... (Race Mode)")
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = [
                executor.submit(analyze_with_gemini, message, target_lang),
                executor.submit(analyze_with_grok, message, target_lang)
            ]
            
            try:
                for future in concurrent.futures.as_completed(futures, timeout=10):
                    try:
                        res = future.result()
                        if res:
                            final_result = res
                            break
                    except Exception as e:
                        continue
            except concurrent.futures.TimeoutError:
                print("Text analysis timed out.")

    # Static fallback if all AI models fail (Demo Mode)
    if not final_result:
        print("Both AI models failed. Using fallback (Demo Mode) response.")
        final_result = get_fallback_analysis(message or "Image content")
    
    # Ensure helpline is always present
    if 'official_helpline' not in final_result:
        final_result['official_helpline'] = "1930"
    
    # Store result in Supabase if a user_id is provided
    user_id = request.form.get('user_id') or (request.json.get('user_id') if request.is_json else None)
    if supabase_client and user_id:
        try:
            print(f"Storing scan for user {user_id}")
            scan_data = {
                "user_id": user_id,
                "message": message[:1000] if message else "Image scan",
                "risk_score": final_result.get("risk_score", 0),
                "risk_level": final_result.get("risk_level", "Unknown"),
                "fraud_category": final_result.get("fraud_category", "Unknown"),
                "analysis_logic": final_result.get("analysis_logic", "")
            }
            
            # Try inserting with new columns first
            try:
                full_data = scan_data.copy()
                full_data["safety_tips"] = final_result.get("safety_tips", [])
                full_data["suspicious_keywords"] = final_result.get("suspicious_keywords", [])
                supabase_client.table("scans").insert(full_data).execute()
                print("Scan stored successfully with full details.")
            except Exception as e:
                print(f"Full storage failed (likely missing columns): {e}. Retrying basic storage...")
                # Fallback to older schema columns
                supabase_client.table("scans").insert(scan_data).execute()
                print("Scan stored successfully with basic details.")
                
        except Exception as e:
            print(f"Failed to store scan in Supabase: {e}")

    return jsonify(final_result)

@app.route('/scans', methods=['GET'])
def get_user_scans():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400
    
    if not supabase_client:
        return jsonify({"error": "Database not configured"}), 503
        
    try:
        response = supabase_client.table("scans").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return jsonify(response.data)
    except Exception as e:
        print(f"Fetch scans error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/scans/<scan_id>', methods=['DELETE'])
def delete_scan(scan_id):
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400
    
    if not supabase_client:
        return jsonify({"error": "Database not configured"}), 503
        
    try:
        # We check user_id to ensure a user can only delete their own scans
        response = supabase_client.table("scans").delete().eq("id", scan_id).eq("user_id", user_id).execute()
        return jsonify({"message": "Scan deleted successfully", "data": response.data})
    except Exception as e:
        print(f"Delete scan error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run on 5000 for React to connect
    app.run(debug=True, port=5000)
