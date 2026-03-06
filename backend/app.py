import os
import json
import base64
import tempfile
import traceback
import concurrent.futures
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from google.genai import types
from openai import OpenAI
from supabase import create_client, Client

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
    "https://fraud-detection-system-jade.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]}})

# ── Client Initialisation ─────────────────────────────────────────────────────

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_client = None
if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    print("Gemini client initialized.")

GROK_API_KEY = os.getenv("GROK_API_KEY")
grok_client = None
grok_vision_model = "grok-2"

if GROK_API_KEY and GROK_API_KEY != "your_grok_api_key_here":
    base_url = "https://api.x.ai/v1"
    grok_text_model = "grok-2"
    if GROK_API_KEY.startswith("gsk_"):
        base_url = "https://api.groq.com/openai/v1"
        grok_text_model = "llama-3.3-70b-versatile"
        grok_vision_model = "llama-3.2-90b-vision-preview"
        print(f"Detected Groq key. Using Groq API at {base_url}")
    else:
        print(f"Using xAI Grok API at {base_url}")
    grok_client = OpenAI(api_key=GROK_API_KEY, base_url=base_url, timeout=25.0)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase_client: Client = None
if SUPABASE_URL and SUPABASE_KEY and SUPABASE_URL != "https://your-project.supabase.co":
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Supabase client initialized successfully.")
    except Exception as e:
        print(f"Supabase Init Error: {e}")

# ── Model Lists — waterfall fallback (fastest first) ─────────────────────────

VISION_MODELS = [
    "gemini/gemini-2.5-flash",
    "gemini/gemini-2.0-flash",
    "gemini/gemini-2.0-flash-lite",
    "groq/llama-3.2-90b-vision-preview",
]

TEXT_MODELS = [
    "gemini/gemini-2.5-flash",
    "gemini/gemini-2.0-flash",
    "groq/llama-3.3-70b-versatile",
    "gemini/gemini-2.0-flash-lite",
    "groq/mixtral-8x7b-32768",
]

AUDIO_MODELS = [
    "gemini/gemini-2.5-flash",
    "gemini/gemini-2.0-flash",
    "gemini/gemini-2.0-flash-lite"
]

# ── System Prompt ─────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """
You are a MULTI-LINGUAL FRAUD INVESTIGATOR AI. Your mission is to protect diverse people from scams across all major Indian languages.

KINDLY FOLLOW THESE STRICT DIRECTIVES:
1. LANGUAGE CONSISTENCY: You will be provided with a target language. You MUST provide the 'analysis_logic' and 'safety_tips' in that EXACT language.
2. BE SIMPLE & PROTECTIVE: Use clear, non-technical language to explain why something is a scam.
3. RESPOND ONLY WITH RAW JSON — no markdown, no code fences.
4. JSON RESPONSE FORMAT:
{
  "risk_score": (0-100),
  "risk_level": "Safe" | "Suspicious" | "High Risk",
  "fraud_category": "UPI Fraud" | "Job Scam" | "Lottery Scam" | "Phishing" | "WhatsApp Scam",
  "suspicious_keywords": ["Word1", "Word2"],
  "analysis_logic": "Explain the scam in the PROVIDED LANGUAGE (2-3 sentences)",
  "safety_tips": ["Action 1 in provided language", "Action 2 in provided language"]
}
"""

AUDIO_SYSTEM_PROMPT = """
You are a MULTI-LINGUAL FRAUD INVESTIGATOR AI specialized in analyzing call recordings and voice messages.

DIRECTIVES:
1. LANGUAGE CONSISTENCY: Provide 'analysis_logic' and 'safety_tips' in the TARGET LANGUAGE specified.
2. TRANSCRIPTION FIRST: Accurately transcribe every word spoken in the audio, even if quality is poor.
3. FRAUD DETECTION: Look for: fake bank/government/police calls, OTP/PIN requests, digital arrest threats, prize/job fraud, remote access app requests.
4. RESPOND ONLY WITH RAW JSON — no markdown, no code fences.
5. JSON RESPONSE FORMAT:
{
  "risk_score": (0-100),
  "risk_level": "Safe" | "Suspicious" | "High Risk",
  "fraud_category": "UPI Fraud" | "Job Scam" | "Lottery Scam" | "Phishing" | "Impersonation" | "Digital Arrest" | "Safe Call",
  "suspicious_keywords": ["Word1", "Word2"],
  "transcription": "<Complete verbatim transcription>",
  "analysis_logic": "Explain findings in TARGET LANGUAGE (2-3 sentences)",
  "safety_tips": ["Tip 1 in target language", "Tip 2 in target language", "Tip 3 in target language"]
}
"""

# ── Unified LLM Fallback Caller ───────────────────────────────────────────────

def call_llm_with_fallback(model_list, text_query, img_bytes=None, audio_bytes=None, audio_mime=None):
    """
    Waterfall through model_list. First success wins.
    Supports: Gemini (text / vision / audio) and Groq (text / vision).
    """
    last_error = "No models available"

    for model_id in model_list:
        try:
            print(f">>> Trying {model_id}...")

            # ── GEMINI ────────────────────────────────────────────────────────
            if model_id.startswith("gemini/"):
                if not gemini_client:
                    print(f"--- SKIP {model_id}: Gemini client not init")
                    continue
                real_model = model_id.replace("gemini/", "")
                parts = [types.Part(text=text_query)]

                if img_bytes:
                    parts.append(types.Part.from_bytes(data=img_bytes, mime_type="image/jpeg"))

                if audio_bytes and audio_mime:
                    parts.append(types.Part.from_bytes(data=audio_bytes, mime_type=audio_mime))

                response = gemini_client.models.generate_content(
                    model=real_model,
                    contents=[types.Content(role="user", parts=parts)],
                    config=types.GenerateContentConfig(
                        system_instruction=AUDIO_SYSTEM_PROMPT if audio_bytes else SYSTEM_PROMPT,
                        response_mime_type="application/json"
                    )
                )
                print(f"--- SUCCESS: {model_id}")
                return response.text

            # ── GROQ ──────────────────────────────────────────────────────────
            elif model_id.startswith("groq/"):
                if not grok_client:
                    print(f"--- SKIP {model_id}: Groq client not init")
                    continue
                if audio_bytes:
                    print(f"--- SKIP {model_id}: Groq does not support audio")
                    continue

                real_model = model_id.replace("groq/", "")

                if img_bytes:
                    b64 = base64.b64encode(img_bytes).decode("utf-8")
                    messages = [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": [
                            {"type": "text", "text": text_query},
                            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}}
                        ]}
                    ]
                else:
                    messages = [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": text_query}
                    ]

                completion = grok_client.chat.completions.create(
                    model=real_model,
                    messages=messages,
                    response_format={"type": "json_object"}
                )
                print(f"--- SUCCESS: {model_id}")
                return completion.choices[0].message.content

        except Exception as e:
            last_error = str(e)
            print(f"--- FAILED: {model_id} | {last_error}")
            traceback.print_exc()
            # Fast-switch on quota / not-found errors
            if any(code in last_error for code in ["429", "RESOURCE_EXHAUSTED", "404", "NOT_FOUND", "400", "INVALID"]):
                continue

    # If we exhaust all models, raise the last error so the endpoint knows it failed
    print(f"!!! ALL MODELS FAILED in list. Last error: {last_error}")
    raise Exception(f"All models failed. Last error: {last_error}")


def parse_json_result(raw_text, mode_tag):
    """Strip markdown fences and parse JSON. Adds mode tag."""
    text = raw_text.strip()
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].strip()
    result = json.loads(text)
    result["mode"] = mode_tag
    return result


def get_fallback_analysis(message):
    """Heuristic fallback when all AI models are down."""
    lc = message.lower()
    high_risk = any(w in lc for w in ["otp", "winner", "blocked", "lottery", "verify", "click here", "urgent", "account suspend"])
    return {
        "risk_score": 85 if high_risk else 15,
        "risk_level": "High Risk" if high_risk else "Safe",
        "fraud_category": "Phishing" if high_risk else "None",
        "suspicious_keywords": [w for w in ["otp", "winner", "blocked", "lottery", "verify"] if w in lc],
        "analysis_logic": "Fallback analysis: message contains patterns typically associated with scams.",
        "safety_tips": ["Do not click unknown links", "Never share OTP", "Call the official bank helpline"],
        "official_helpline": "1930",
        "mode": "DEMO"
    }

# ── Routes ────────────────────────────────────────────────────────────────────

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "Guardian AI Fraud Detection Backend is Running",
        "status": "online",
        "endpoints": ["/analyze", "/analyze-audio", "/health", "/scans"]
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "active",
        "gemini_active": bool(gemini_client),
        "grok_active": bool(grok_client)
    })


@app.route('/analyze', methods=['POST'])
def analyze_message():
    """Text + Image analysis endpoint."""
    message = request.form.get('message', '')
    image_file = request.files.get('file')
    lang_code = request.form.get('language', 'en-IN')

    lang_map = {
        'en-IN': 'English', 'hi-IN': 'Hindi', 'ta-IN': 'Tamil',
        'te-IN': 'Telugu', 'kn-IN': 'Kannada', 'ml-IN': 'Malayalam',
        'bn-IN': 'Bangla', 'mr-IN': 'Marathi', 'gu-IN': 'Gujarati', 'pa-IN': 'Punjabi'
    }

    if not message and request.is_json:
        data = request.json
        message = data.get('message', '')
        lang_code = data.get('language', 'en-IN')

    target_lang = lang_map.get(lang_code, 'English')

    if not message and not image_file:
        return jsonify({"error": "No message or image provided"}), 400

    final_result = None
    img_bytes = None

    # Compress image if provided
    if image_file:
        raw = image_file.read()
        try:
            from PIL import Image
            import io
            img = Image.open(io.BytesIO(raw)).convert("RGB")
            buf = io.BytesIO()
            max_w = 1000
            if img.width > max_w:
                ratio = max_w / img.width
                img = img.resize((max_w, int(img.height * ratio)), Image.LANCZOS)
            img.save(buf, format="JPEG", quality=70)
            img_bytes = buf.getvalue()
        except Exception:
            img_bytes = raw  # fall back to raw bytes

    query = f"TARGET LANGUAGE: {target_lang}\nPerform deep fraud analysis.\nMessage: {message}"
    model_list = VISION_MODELS if img_bytes else TEXT_MODELS

    try:
        raw = call_llm_with_fallback(model_list, query, img_bytes=img_bytes)
        final_result = parse_json_result(raw, "Gemini-Vision" if img_bytes else "Gemini-Text")
    except Exception as e:
        print(f"All models failed for analyze: {e}")
        final_result = get_fallback_analysis(message or "Image content")

    if 'official_helpline' not in final_result:
        final_result['official_helpline'] = "1930"

    # Store in Supabase
    user_id = request.form.get('user_id') or (request.json.get('user_id') if request.is_json else None)
    _store_scan(user_id, message or "Image scan", final_result)

    return jsonify(final_result)


@app.route('/analyze-audio', methods=['POST'])
def analyze_audio():
    """
    Call recording / voice message analysis endpoint.
    Uses Gemini's native audio understanding via types.Part.from_bytes().
    Supported formats: MP3, WAV, OGG, M4A, AAC, FLAC, WebM, 3GP, AMR
    """
    audio_file = request.files.get('audio')
    lang_code = request.form.get('language', 'en-IN')
    user_id = request.form.get('user_id')

    lang_map = {
        'en-IN': 'English', 'hi-IN': 'Hindi', 'ta-IN': 'Tamil',
        'te-IN': 'Telugu', 'kn-IN': 'Kannada', 'ml-IN': 'Malayalam',
        'bn-IN': 'Bangla', 'mr-IN': 'Marathi', 'gu-IN': 'Gujarati', 'pa-IN': 'Punjabi'
    }
    target_lang = lang_map.get(lang_code, 'English')

    if not audio_file:
        return jsonify({"error": "No audio file provided"}), 400

    filename = audio_file.filename.lower()
    mime_map = {
        '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg',
        '.m4a': 'audio/mp4', '.aac': 'audio/aac', '.flac': 'audio/flac',
        '.webm': 'audio/webm', '.3gp': 'audio/3gpp', '.amr': 'audio/amr'
    }
    detected_mime = 'audio/mpeg'
    for ext, mime in mime_map.items():
        if filename.endswith(ext):
            detected_mime = mime
            break

    audio_bytes = audio_file.read()
    print(f"Audio upload: {filename} | {detected_mime} | {len(audio_bytes)} bytes | lang: {target_lang}")

    if len(audio_bytes) > 20 * 1024 * 1024:
        return jsonify({"error": "Audio file too large. Please upload under 20MB."}), 413

    query = (
        f"TARGET LANGUAGE: {target_lang}\n"
        f"You are analyzing a CALL RECORDING or VOICE MESSAGE.\n"
        f"STEP 1 — Transcribe every word spoken accurately.\n"
        f"STEP 2 — Detect fraud patterns: fake bank/govt/police calls, OTP requests, digital arrest, job/prize fraud.\n"
        f"Respond ONLY with the JSON as specified in your system instructions."
    )

    final_result = None
    try:
        raw = call_llm_with_fallback(AUDIO_MODELS, query, audio_bytes=audio_bytes, audio_mime=detected_mime)
        final_result = parse_json_result(raw, "Gemini-Audio")
    except Exception as e:
        print(f"All audio models failed: {e}")
        final_result = {
            "risk_score": 50,
            "risk_level": "Suspicious",
            "fraud_category": "Unknown",
            "suspicious_keywords": [],
            "transcription": "Audio could not be processed. Please check that the file contains clear speech.",
            "analysis_logic": "Analysis failed. Try a WAV or MP3 file with clear audio.",
            "safety_tips": ["Call 1930 to report suspicious calls", "Never share OTP or PIN over phone"],
            "mode": "FALLBACK"
        }

    if 'official_helpline' not in final_result:
        final_result['official_helpline'] = "1930"

    # Store in Supabase
    transcription = final_result.get('transcription', '')
    msg_label = f"[Audio] {transcription[:500]}" if transcription else "[Audio Recording]"
    _store_scan(user_id, msg_label, final_result)

    return jsonify(final_result)


def _store_scan(user_id, message, result):
    """Helper to save a scan result to Supabase."""
    if not supabase_client or not user_id:
        return
    try:
        scan_data = {
            "user_id": user_id,
            "message": message[:1000],
            "risk_score": result.get("risk_score", 0),
            "risk_level": result.get("risk_level", "Unknown"),
            "fraud_category": result.get("fraud_category", "Unknown"),
            "analysis_logic": result.get("analysis_logic", ""),
            "safety_tips": result.get("safety_tips", []),
            "suspicious_keywords": result.get("suspicious_keywords", [])
        }
        supabase_client.table("scans").insert(scan_data).execute()
        print("Scan stored in Supabase.")
    except Exception as e:
        print(f"Supabase store error: {e}")


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
        return jsonify({"error": str(e)}), 500


@app.route('/scans/<scan_id>', methods=['DELETE'])
def delete_scan(scan_id):
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400
    if not supabase_client:
        return jsonify({"error": "Database not configured"}), 503
    try:
        response = supabase_client.table("scans").delete().eq("id", scan_id).eq("user_id", user_id).execute()
        return jsonify({"message": "Scan deleted successfully", "data": response.data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
