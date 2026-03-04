# AI-Based Fraud Risk Detection & Digital Awareness System

This project is a prototype designed to help citizens detect fraud risks in messages (SMS/WhatsApp/Email) and provides educational guidance to prevent scams.

## Technologies
- **Frontend**: React (Vite)
- **Backend**: Flask (Python)
- **AI Models**: Google Gemini & xAI Grok

## Setup Instructions

### 1. API Keys
1. Create a `.env` file in the `backend/` directory.
2. Add your API keys:
   ```env
   GEMINI_API_KEY=your_key
   GROK_API_KEY=your_key
   ```

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask server:
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will typically run on `http://localhost:5173`.

## Features
- **Dual-LLM Analysis**: Combines power of Gemini and Grok for high-accuracy fraud detection.
- **Risk Visualization**: Clear scoring and classification (Safe, Suspicious, High Risk).
- **Red Flag Highlighting**: Automatically identifies suspicious keywords or patterns.
- **Educational Guidance**: Personalized safety tips based on the message type.
- **Emergency Access**: Quick link to the official cybercrime helpline (1930).
