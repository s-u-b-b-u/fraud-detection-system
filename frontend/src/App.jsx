import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation,
    useNavigate
} from 'react-router-dom'
import { supabase } from './supabaseClient'
import AuthPage from './pages/AuthPage'
import GuidePage from './pages/GuidePage'
import ScamDetailPage from './pages/ScamDetailPage'

import {
    ShieldAlert,
    ShieldCheck,
    AlertTriangle,
    Search,
    PhoneCall,
    Lightbulb,
    ArrowRight,
    Shield,
    Loader2,
    Lock,
    MessageSquare,
    Info,
    Moon,
    Sun,
    HandCoins,
    ChevronRight,
    Sparkles,
    Plus,
    Mic,
    LogOut,
    LogIn,
    Trash2,
    Headphones
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://fraud-detection-system-eaxw.onrender.com';

// --- Theme Toggle Component ---
const ThemeToggle = ({ theme, toggleTheme }) => (
    <button className="theme-toggle" onClick={toggleTheme} title="Change Day/Night Mode">
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
)

// --- Layout Components ---
const Header = ({ theme, toggleTheme, user }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <header className="main-header">
            <nav className="container">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', textDecoration: 'none' }}>
                    <div style={{ background: 'var(--accent-color)', padding: '0.6rem', borderRadius: '15px' }}>
                        <Shield color={theme === 'dark' ? '#000' : '#fff'} size={32} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Guardian AI</span>
                </Link>
                <div className="nav-links">
                    <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
                    <Link to="/scan" className={pathname === '/scan' ? 'active' : ''}>Check Message</Link>
                    <Link to="/guide" className={pathname === '/guide' ? 'active' : ''}>Guide</Link>
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="user-profile-btn" style={{ position: 'relative' }}>
                                <div className="avatar">
                                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ marginRight: '0.5rem' }}>
                                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </span>
                                <div style={{ width: '1px', height: '20px', background: 'var(--card-border)', margin: '0 0.5rem' }}></div>
                                <button
                                    onClick={handleSignOut}
                                    className="logout-btn"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        color: 'var(--risk-color)',
                                        fontWeight: 700,
                                        padding: '0.2rem 0.5rem',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/auth" className="cta-button" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                            Login <LogIn size={16} />
                        </Link>
                    )}

                </div>
            </nav>
        </header>
    )
}

const Footer = () => (
    <footer style={{ background: 'rgba(13, 148, 136, 0.05)', textAlign: 'center', padding: '2.5rem 0 2rem', borderTop: '1px solid var(--card-border)' }}>
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <Shield size={32} className="text-accent opacity-40" />
            </div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Guardian AI: Protector of our People</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', fontSize: '0.9rem' }}>
                Helping villagers and citizens stay safe from online thieves. Simple software for a safer digital world.
            </p>
            <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                © 2026 Guardian AI Digital Safety Project
            </div>
        </div>
    </footer>
)

const HomePage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container"
        >
            <section className="hero">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="status-badge Safe" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(37, 99, 235, 0.1)' }}>
                        <ShieldCheck size={16} /> Your Safety, Our Duty
                    </div>
                    <h1>Protect Yourself <br /><span style={{ color: 'var(--accent-color)' }}>Against Online Thieves.</span></h1>
                    <p>Easy-to-use software designed for our villages. Scan messages for free and learn how to keep your life earnings safe.</p>
                    <Link to="/scan" className="cta-button">
                        Check Your Message Now <ChevronRight size={22} />
                    </Link>
                </motion.div>
            </section>

            <motion.section
                id="guidelines"
                style={{ marginBottom: '8rem' }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
                <div className="section-title">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Safety Rules for Everyone</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>Look at these pictures to learn how thieves try to rob you online.</p>
                </div>

                <div className="guidelines-grid">
                    {[
                        { img: '/otp-safety.png', title: 'Rule 1: Never Give Your OTP', text: 'People who call asking for numbers sent to your phone (OTP) are thieves. NO REAL BANK will ever ask for this code over phone or WhatsApp.' },
                        { img: '/loan-safety.png', title: 'Rule 2: No Money for Jobs/Loans', text: 'If someone offers you a loan or a government job but asks for "Processing Fees" first, they are LYING. Real jobs don\'t ask for your money first.' },
                        { img: '/upi-safety.png', title: 'Rule 3: PIN is Only to GIVE Money', text: 'You NEVER need to enter your Secret PIN or scan a QR code to RECEIVE money in your bank. If someone says "Scan this to get your lottery", they are stealing from you.' },
                        { img: '/link-safety.png', title: 'Rule 4: Stop & Think Before Clicking', text: 'Thieves send blue links in SMS saying you won a lottery or your account will be blocked. Don\'t click! It\'s a trap to take your bank balance.' },
                        { img: '/qr-danger.png', title: 'Rule 5: Avoid Random QR Codes', text: 'Never scan a QR code to RECEIVE money. QR codes are only for GIVING money. If someone says "Scan this to get your payment", they are trying to empty your bank.' },
                        { img: '/website-safety.png', title: 'Rule 6: Check Official Sources', text: 'Thieves create fake bank websites and Google numbers. Always use official apps or visit your real bank branch for help. Never trust a "Customer Care" number from a random search.' }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="guide-card"
                            whileHover={{ y: -10 }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                        >
                            <div className="guide-image">
                                <img src={item.img} alt={item.title} />
                            </div>
                            <div className="guide-content">
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section
                className="card"
                style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(0,0,0,0))' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
                <div className="section-title" style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Emergency Helper Numbers</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>If you lose money or shared your bank details, call these immediately!</p>
                </div>
                <div className="helpline-grid">
                    <motion.div
                        className="hl-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.2 }}
                    >
                        <PhoneCall className="text-red-500 mb-2" size={40} />
                        <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>Cyber Crime Helper</p>
                        <div className="hl-number pulse">1930</div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Call Day or Night (Free)</p>
                    </motion.div>
                    <motion.div
                        className="hl-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.4 }}
                    >
                        <Shield className="text-blue-500 mb-2" size={40} />
                        <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>Police Support</p>
                        <div className="hl-number">112</div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Talk to Local Police</p>
                    </motion.div>
                    <motion.div
                        className="hl-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.6 }}
                    >
                        <Lock className="text-green-500 mb-2" size={40} />
                        <p style={{ fontWeight: 800, fontSize: '1.2rem' }}>Web Help Center</p>
                        <a href="https://cybercrime.gov.in" target="_blank" style={{ color: '#BE123C', fontSize: '1.1rem', display: 'block', marginTop: '1.5rem', fontWeight: 700 }}>cybercrime.gov.in</a>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Report Online</p>
                    </motion.div>
                </div>
            </motion.section>
        </motion.div>
    )
}

// --- Result Components ---

const BatteryIndicator = ({ percentage, level }) => {
    const statusClass = level === 'High Risk' ? 'HighRisk' : level === 'Suspicious' ? 'Suspicious' : 'Safe';
    return (
        <div className="battery-container" style={{ '--status-color': `var(--${statusClass.toLowerCase()}-color)` }}>
            <div className="battery-level" style={{ height: `${percentage}%` }}>
                <div className={`battery-level ${statusClass}-level`} style={{ height: '100%' }}></div>
            </div>
            <div className="battery-percentage">{percentage}%</div>
        </div>
    );
};

const LiquidShieldLoader = () => (
    <div className="liquid-loader-container">
        <div className="shield-shape">
            <div className="liquid-fill"></div>
        </div>
        <div className="loader-text">Analyzing Security Threats...</div>
    </div>
);

const ScanPage = ({ user }) => {
    const [message, setMessage] = useState('')
    const [file, setFile] = useState(null)
    const [audioFile, setAudioFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [history, setHistory] = useState([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const resultRef = useRef(null)
    const fileInputRef = useRef(null)
    const audioInputRef = useRef(null)
    const textareaRef = useRef(null)
    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef(null)
    const [selectedLang, setSelectedLang] = useState('en-IN')

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user])

    const fetchHistory = async () => {
        if (!user) return;
        setHistoryLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/scans?user_id=${user.id}`);
            setHistory(response.data);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const deleteScan = async (e, scanId) => {
        e.stopPropagation(); // Prevent loading the scan when clicking delete
        if (!window.confirm("Are you sure you want to delete this scan?")) return;

        try {
            await axios.delete(`${API_BASE_URL}/scans/${scanId}?user_id=${user.id}`);
            setHistory(prev => prev.filter(s => s.id !== scanId));
            if (result && result.id === scanId) setResult(null);
        } catch (err) {
            console.error("Failed to delete scan:", err);
            alert("Failed to delete scan. Please try again.");
        }
    };

    const loadFromHistory = (scan) => {
        // Ensure official_helpline is present as it might not be in the stored record
        const scanWithMeta = {
            ...scan,
            official_helpline: scan.official_helpline || "1930"
        };
        setResult(scanWithMeta);
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const languages = [
        { code: 'en-IN', name: 'English' },
        { code: 'hi-IN', name: 'हिन्दी (Hindi)' },
        { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
        { code: 'te-IN', name: 'తెలుగు (Telugu)' },
        { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
        { code: 'ml-IN', name: 'മലയാളം (Malayalam)' },
        { code: 'bn-IN', name: 'বাংলা (Bangla)' },
        { code: 'mr-IN', name: 'मराठी (Marathi)' },
        { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)' },
        { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)' }
    ]

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    useEffect(() => {
        if (result && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [result])

    useEffect(() => {
        if (loading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [loading]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            analyzeMessage();
        }
    }

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            // On manual stop, trigger analysis
            setTimeout(() => {
                const currentText = textareaRef.current?.value || '';
                if (currentText.trim().length > 3) {
                    analyzeMessage();
                }
            }, 500);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError("Voice search isn't supported in this browser. Try Chrome!");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true; // DO NOT STOP until user clicks again
        recognition.interimResults = true;
        recognition.lang = selectedLang;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setMessage(prev => (prev + ' ' + finalTranscript).trim());
            }
        };
        recognition.onend = () => {
            // Keep listening logic if user didn't stop it
            if (isListening) {
                try { recognition.start(); } catch (e) { }
            }
        };
        recognition.onerror = (err) => {
            console.error("Speech Recognition Error:", err.error);
            if (err.error === 'no-speech') return;
            setIsListening(false);
            if (err.error === 'not-allowed') {
                setError("Microphone access denied. Please allow it in browser settings.");
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1000;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                    }, 'image/jpeg', 0.7);
                };
            };
        });
    }

    const analyzeMessage = async () => {
        if (!message.trim() && !file) return
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const formData = new FormData()
            if (message) formData.append('message', message)
            formData.append('language', selectedLang)
            if (user) formData.append('user_id', user.id)

            if (file) {
                const compressedFile = await compressImage(file);
                formData.append('file', compressedFile);
            }

            const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setResult(response.data)
            setMessage('') // Clear the text area after sending
            if (user) fetchHistory();
        } catch (err) {
            setError("Trouble connecting to the helper bot. Please check your internet and try again.")
        } finally {
            setLoading(false)
        }
    }

    const analyzeAudio = async () => {
        if (!audioFile) return
        setLoading(true)
        setError(null)
        setResult(null)
        try {
            const formData = new FormData()
            formData.append('audio', audioFile)
            formData.append('language', selectedLang)
            if (user) formData.append('user_id', user.id)

            const response = await axios.post(`${API_BASE_URL}/analyze-audio`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 60000  // audio analysis can take up to 60s
            })
            setResult(response.data)
            setAudioFile(null)
            if (user) fetchHistory()
        } catch (err) {
            if (err.response?.data?.error) {
                setError(err.response.data.error)
            } else {
                setError("Could not analyze the audio. Please try a shorter or clearer recording.")
            }
        } finally {
            setLoading(false)
        }
    }

    const getCategoryImg = (cat) => {
        const category = (cat || '').toLowerCase();
        if (category.includes('upi')) return '/upi-safety.png';
        if (category.includes('job') || category.includes('loan')) return '/loan-safety.png';
        if (category.includes('lottery')) return '/link-safety.png';
        return '/otp-safety.png';
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
        >
            <div className="scan-grid">
                {/* Gemini Style Input Section */}
                <div className="card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
                    <motion.div
                        className="ai-greeting"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <h2><Shield className="sparkle-icon" size={24} /> Guard Your Safety,</h2>
                        <h1>Ready to scan for threats?</h1>
                    </motion.div>

                    <div className="gemini-pill-bar">
                        <div className="pill-input-zone">
                            <textarea
                                ref={textareaRef}
                                placeholder="Paste a message or upload an image to verify..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                                rows={1}
                            />
                        </div>

                        {file && (
                            <div style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', margin: '0 1rem', fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 700 }}>
                                <ShieldCheck size={16} /> Image Loaded: {file.name}
                                <button onClick={() => setFile(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--risk-color)', padding: '0 0.5rem' }}>✕</button>
                            </div>
                        )}

                        {audioFile && (
                            <div style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(124,58,237,0.08)', borderRadius: '12px', margin: '0 1rem', fontSize: '0.9rem', color: '#7c3aed', fontWeight: 700, border: '1px solid rgba(124,58,237,0.2)' }}>
                                <Headphones size={16} /> Recording: {audioFile.name}
                                <span style={{ color: 'rgba(124,58,237,0.6)', fontWeight: 400, fontSize: '0.8rem' }}>
                                    ({(audioFile.size / (1024 * 1024)).toFixed(1)} MB)
                                </span>
                                <button onClick={() => setAudioFile(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--risk-color)', padding: '0 0.5rem', marginLeft: 'auto' }}>✕</button>
                            </div>
                        )}

                        <div className="pill-controls">
                            <div className="pill-group">
                                {/* Image Upload */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <button
                                    className="pill-icon-btn highlight-hover"
                                    onClick={() => fileInputRef.current.click()}
                                    data-tooltip="Upload image"
                                    title="Upload image"
                                >
                                    <Plus size={20} />
                                </button>

                                {/* Audio Upload */}
                                <input
                                    type="file"
                                    ref={audioInputRef}
                                    style={{ display: 'none' }}
                                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.webm,.3gp,.amr"
                                    onChange={(e) => e.target.files?.[0] && setAudioFile(e.target.files[0])}
                                />
                                <button
                                    className="pill-icon-btn highlight-hover"
                                    onClick={() => audioInputRef.current.click()}
                                    data-tooltip="Upload call recording"
                                    title="Upload call/voice recording"
                                    style={{ color: audioFile ? 'var(--accent-color)' : 'inherit' }}
                                >
                                    <Headphones size={20} />
                                </button>

                                <select
                                    value={selectedLang}
                                    onChange={(e) => setSelectedLang(e.target.value)}
                                    className="lang-selector-pill"
                                >
                                    {languages.map(l => (
                                        <option key={l.code} value={l.code}>{l.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pill-group">
                                <button
                                    className={`pill-icon-btn ${isListening ? 'listening-pulse' : ''}`}
                                    data-tooltip={isListening ? "Listening..." : "Use microphone"}
                                    onClick={toggleListening}
                                >
                                    <Mic size={20} style={{ color: isListening ? 'var(--risk-color)' : 'inherit' }} />
                                </button>

                                {/* Analyze button — audio mode if audioFile loaded, otherwise text/image */}
                                {audioFile ? (
                                    <button
                                        className="analyze-pill-btn"
                                        onClick={analyzeAudio}
                                        disabled={loading}
                                        style={{ background: 'linear-gradient(135deg, #7c3aed, #0d9488)' }}
                                        title="Analyze call recording"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Headphones size={20} />}
                                    </button>
                                ) : (
                                    <button
                                        className="analyze-pill-btn"
                                        onClick={analyzeMessage}
                                        disabled={loading || (!message.trim() && !file)}
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <ArrowRight size={20} />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p style={{ color: 'var(--risk-color)', textAlign: 'center', marginTop: '1.5rem', fontWeight: 600 }}>{error}</p>
                    )}
                </div>

                {/* Section 2: Loading State */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <LiquidShieldLoader />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Section 3: Results Area (Conditional) */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            ref={resultRef}
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                        >
                            <div className={`card ${result.risk_level === 'High Risk' ? 'HighRisk' : result.risk_level === 'Suspicious' ? 'Suspicious' : 'Safe'}`}>

                                <div className="result-card-content">
                                    {/* Column 1: Indicators */}
                                    <div style={{ textAlign: 'center' }}>
                                        <BatteryIndicator percentage={result.risk_score} level={result.risk_level} />
                                        <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{result.risk_level}</h3>
                                        <div className="status-badge" style={{ background: 'rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
                                            {result.fraud_category} Warning
                                        </div>
                                        <div className="risk-image-box">
                                            <img src={getCategoryImg(result.fraud_category)} alt="Fraud Visual" />
                                        </div>
                                    </div>

                                    {/* Column 2: Details */}
                                    <div style={{ padding: '0 1rem' }}>
                                        <div className="result-details-grid">
                                            {/* Transcription Block — only shown for audio results */}
                                            {result.transcription && (
                                                <div className="analysis-text" style={{ marginBottom: '1rem', background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '16px', padding: '1.5rem' }}>
                                                    <h3 style={{ color: '#7c3aed', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1.5px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Headphones size={16} /> Call Transcription
                                                    </h3>
                                                    <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid #7c3aed', paddingLeft: '1rem' }}>
                                                        {result.transcription}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Analysis Block */}
                                            <div className="analysis-text">
                                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1.2rem', letterSpacing: '1.5px' }}>
                                                    🚨 Analysis Findings
                                                </h3>
                                                <p style={{ fontSize: '1.4rem', lineHeight: 1.6, fontWeight: 600 }}>{result.analysis_logic}</p>
                                            </div>

                                            {/* Tips Block */}
                                            <div className="awareness-tips">
                                                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1.2rem', letterSpacing: '1.5px' }}>
                                                    ✅ Safety Steps for You
                                                </h3>
                                                {result.safety_tips?.map((tip, idx) => (
                                                    <div key={idx} className="tip-card" style={{ borderLeft: '6px solid var(--status-color)', padding: '1.2rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '0 12px 12px 0' }}>
                                                        <p style={{ fontWeight: 700, fontSize: '1.2rem' }}>{tip}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Full Width Helpline */}
                                        <div className="card helpline pulse" style={{ background: 'var(--risk-color)', color: '#fff', marginTop: '2.5rem', cursor: 'pointer', padding: '2rem', borderRadius: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                                <div>
                                                    <p style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>HELP IS AVAILABLE 24/7</p>
                                                    <p style={{ fontSize: '1rem', opacity: 0.9 }}>Report cyber crime immediately</p>
                                                </div>
                                                <div style={{ fontSize: '3.5rem', fontWeight: 900 }}>{result.official_helpline}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {user && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ marginTop: '4rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Recent Activity</h2>
                            <button
                                onClick={fetchHistory}
                                disabled={historyLoading}
                                style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Sparkles size={18} className={historyLoading ? 'animate-spin' : ''} /> Refresh List
                            </button>
                        </div>

                        {historyLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} size={32} />
                                <p>Loading your past scans...</p>
                            </div>
                        ) : history.length > 0 ? (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {history.slice(0, 5).map((scan, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="card"
                                        whileHover={{ scale: 1.01, x: 5, borderColor: 'var(--accent-color)' }}
                                        onClick={() => loadFromHistory(scan)}
                                        style={{
                                            padding: '1.5rem 2rem',
                                            marginBottom: '0',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: 'var(--card-bg)',
                                            cursor: 'pointer',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '20px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <div className={`status-badge ${(scan.risk_level || 'Safe').replace(' ', '')}`} style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                                                {scan.risk_level}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{scan.fraud_category || 'General Analysis'}</p>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {scan.message}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                {new Date(scan.created_at).toLocaleDateString()}
                                            </div>
                                            <ChevronRight size={20} style={{ color: 'var(--accent-color)', opacity: 0.5 }} />
                                            <button
                                                onClick={(e) => deleteScan(e, scan.id)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    padding: '0.5rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    borderRadius: '50%',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                                title="Delete Scan"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="card" style={{ textAlign: 'center', padding: '4rem', background: 'rgba(0,0,0,0.02)', border: '2px dashed var(--card-border)' }}>
                                <MessageSquare size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
                                <h3 style={{ marginBottom: '0.5rem' }}>No Scans Yet</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Your recent safety checks will appear here once you scan a message.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('guardian-theme') || 'light')
    const [user, setUser] = useState(null)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('guardian-theme', theme)
    }, [theme])

    useEffect(() => {
        // Check active sessions and subscribe to auth changes
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <Router>
            <div className="app-shell" style={{ overflowX: 'hidden' }}>
                <Header theme={theme} toggleTheme={toggleTheme} user={user} />
                <main>
                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/scan" element={<ScanPage user={user} />} />
                            <Route path="/guide" element={<GuidePage theme={theme} />} />
                            <Route path="/scam/:slug" element={<ScamDetailPage />} />

                            <Route path="/auth" element={<AuthPage user={user} />} />
                        </Routes>
                    </AnimatePresence>
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App
