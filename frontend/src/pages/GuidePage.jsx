import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { BookOpen, ShieldAlert, AlertTriangle, CheckCircle2, XCircle, ArrowRight, Search } from 'lucide-react'

// ── Auto-play video on scroll into view ─────────────────────────────────────
const GuideVideoPlayer = ({ theme }) => {
    const videoRef = useRef(null)
    const videoSrc = theme === 'dark' ? '/guide-dark.mp4' : '/guide-light.mp4'

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        video.load()
    }, [videoSrc])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { })
                } else {
                    video.pause()
                }
            },
            { threshold: 0.5 }
        )
        observer.observe(video)
        return () => observer.disconnect()
    }, [])

    return (
        <div className="video-player-wrapper">
            <div className="video-browser-chrome" style={{ background: theme === 'dark' ? '#1a1a1a' : '#ececec' }}>
                <div className="chrome-dots">
                    <span style={{ background: '#ef4444' }} />
                    <span style={{ background: '#f59e0b' }} />
                    <span style={{ background: '#22c55e' }} />
                </div>
                <div className="chrome-address" style={{ background: theme === 'dark' ? '#2a2a2a' : '#fff', color: theme === 'dark' ? '#a8a29e' : '#57534e' }}>
                    🔒 Guardian AI
                </div>
                <div className="chrome-theme-badge" style={{ color: theme === 'dark' ? '#a8a29e' : '#78716c' }}>
                    {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </div>
            </div>
            <div className="video-screen">
                <video ref={videoRef} key={videoSrc} muted playsInline style={{ width: '100%', display: 'block' }}>
                    <source src={videoSrc} type="video/mp4" />
                </video>
            </div>
        </div>
    )
}

// ── Scam Card ────────────────────────────────────────────────────────────────
const ScamCard = ({ scam, index }) => {
    const [flipped, setFlipped] = useState(false)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false, margin: '-80px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="scam-card-outer"
            style={{ '--scam-color': scam.color }}
            onClick={() => setFlipped(f => !f)}
        >
            {/* Glow ring */}
            <div className="scam-glow-ring" />

            {/* Card body */}
            <div className={`scam-card-inner ${flipped ? 'flipped' : ''}`}>

                {/* ── FRONT ── */}
                <div className="scam-card-face scam-card-front">
                    {/* Image */}
                    <div className="scam-img-wrap">
                        <img src={scam.image} alt={scam.type} className="scam-img" />
                        {/* Danger overlay chip */}
                        <div className="scam-danger-chip">
                            <AlertTriangle size={12} />
                            <span>SCAM ALERT</span>
                        </div>
                        {/* Color tint bar */}
                        <div className="scam-img-overlay" style={{ background: `linear-gradient(to top, ${scam.color}ee, transparent)` }} />
                    </div>

                    {/* Content */}
                    <div className="scam-card-body">
                        <div className="scam-type-row">
                            <span className="scam-emoji">{scam.emoji}</span>
                            <div>
                                <h3 className="scam-title">{scam.type}</h3>
                                <div className="scam-title-line" style={{ background: scam.color }} />
                            </div>
                        </div>

                        {/* Fake message */}
                        <div className="scam-msg-bubble">
                            <div className="scam-msg-label">
                                <XCircle size={11} /> SCAM MESSAGE
                            </div>
                            <p className="scam-msg-text">"{scam.message}"</p>
                        </div>

                        <div className="scam-flip-hint">
                            👆 Tap to see why it's a scam
                        </div>
                    </div>
                </div>

                {/* ── BACK ── */}
                <div className="scam-card-face scam-card-back" style={{ borderTop: `4px solid ${scam.color}` }}>
                    <div className="scam-back-body">
                        <div className="scam-back-icon" style={{ background: `${scam.color}20`, color: scam.color }}>
                            {scam.emoji}
                        </div>
                        <h3 className="scam-back-title">{scam.type}</h3>

                        <div className="scam-warning-box">
                            <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <p className="scam-warning-text">{scam.warning}</p>
                        </div>

                        {scam.tips.map((tip, i) => (
                            <div key={i} className="scam-tip-row">
                                <span className="scam-tip-bullet" style={{ background: scam.color }}>✓</span>
                                <span className="scam-tip-text">{tip}</span>
                            </div>
                        ))}

                        <div className="scam-flip-hint">👆 Tap to go back</div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// ── GuidePage ─────────────────────────────────────────────────────────────
const GuidePage = ({ theme }) => {
    const location = useLocation()

    // When returning from a scam detail page, scroll to the explorer section
    useEffect(() => {
        if (location.state?.scrollToExplorer) {
            setTimeout(() => {
                const el = document.getElementById('explorer-section')
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' })
        }
    }, [])

    const scamTemplates = [
        {
            type: 'UPI / Bank Scam',
            color: '#3b82f6',
            emoji: '🏦',
            image: '/upi-safety.png',
            message: "Dear Customer, your Bank account KYC has expired. Update immediately or account will be blocked. Click: bit.ly/bank-kyc-update",
            warning: "Real banks NEVER send short links for KYC. This leads to a fake site that steals your credentials and empties your account.",
            tips: ['Banks never ask for OTP, PIN or password', 'Always open your bank app directly', 'Call your bank\'s official helpline to verify']
        },
        {
            type: 'Job / Loan Scam',
            color: '#22c55e',
            emoji: '💼',
            image: '/loan-safety.png',
            message: "Congratulations! Selected for PM-Home-Job. Salary ₹45,000/-. Registration fee ₹500/- only. Pay now to confirm your seat.",
            warning: "Real jobs and government schemes NEVER ask for money upfront to confirm your seat. This fee disappears with your money.",
            tips: ['No real employer charges a registration fee', 'Verify job offers on official government portals', 'Never pay to get paid']
        },
        {
            type: 'Fake Link Scam',
            color: '#f59e0b',
            emoji: '🔗',
            image: '/link-safety.png',
            message: "Exclusive Diwali Offer! Get a free Jio recharge worth ₹1,000. Click the link now: jiooffer-diwali.net/claim",
            warning: "Scammers clone trusted brand websites with look-alike URLs. Always check the domain — jio.com vs jiooffer-diwali.net are completely different sites.",
            tips: ['Check the full URL in the browser bar before clicking', 'Official brand URLs have no extra words before .com/.in', 'When in doubt, search Google for the official site']
        },
        {
            type: 'Urgent Family Scam',
            color: '#ef4444',
            emoji: '😱',
            image: '/otp-safety.png',
            message: "Mom, I lost my phone, I'm at the hospital. Need ₹5,000 urgently for bills. Send to UPI: temp@upi. Don't call this number.",
            warning: "Scammers pose as your family in distress so you panic and don't think clearly. Always verify by calling the person's real number first.",
            tips: ['Never send money without a voice/video call', 'Call the person directly on their saved number', 'Ask a question only your family member would know']
        },
        {
            type: 'Phishing Email / SMS',
            color: '#8b5cf6',
            emoji: '📧',
            image: '/website-safety.png',
            message: "Your Amazon account has been suspended. Verify your identity now to restore access: security-amazon-login.net",
            warning: "Real Amazon emails always come from @amazon.in. The domain 'security-amazon-login.net' is completely fake — scammers designed it to look trustworthy.",
            tips: ['Check sender email domain, not just the display name', 'Hover over links to preview the real destination URL', 'Log in to your account directly, not through email links']
        },
        {
            type: 'QR Code Scam',
            color: '#0d9488',
            emoji: '📱',
            image: '/qr-danger.png',
            message: "I'll send you ₹10,000. Please scan this QR code on PhonePe/GPay to RECEIVE the payment. It will be credited instantly.",
            warning: "You NEVER scan a QR code to receive money. QR codes always debit money FROM your account. This is one of the fastest-growing scams in India.",
            tips: ['QR codes are for paying, not receiving', 'If someone sends you a QR to "receive" money, it is a scam', 'Call your bank immediately if you accidentally scan one']
        },
    ]

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingTop: '4rem', paddingBottom: '8rem' }}>

            {/* Page Header */}
            <div className="section-title">
                <div className="status-badge Safe" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <BookOpen size={16} /> Guardian AI — User Guide
                </div>
                <h1 className="hero-title">
                    Your Complete Safety<br />
                    <span style={{ color: 'var(--accent-color)' }}>Handbook</span>
                </h1>
                <p className="hero-subtitle">
                    Watch how Guardian AI works, then learn to recognize the most common scam messages used by digital thieves in India.
                </p>
            </div>

            {/* ── Section 1: Video ── */}
            <section className="guide-section">
                <div className="section-title">
                    <h2 className="section-heading">How to Use This Website</h2>
                    <p className="section-subtext">
                        This guided walkthrough shows every feature of Guardian AI in action. The video matches your current theme automatically.
                    </p>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="card"
                    style={{ padding: '0', overflow: 'hidden', borderRadius: '28px', boxShadow: '0 30px 80px rgba(0,0,0,0.15)' }}
                >
                    <GuideVideoPlayer theme={theme} />
                    <div style={{ padding: '2rem', borderTop: '1px solid var(--card-border)', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                        {['🏠 Home Page', '💬 Scan Messages', '📸 Upload Images', '🎤 Voice Input', '🌐 Multi-Language', '🔐 Login / Sign Up', '📜 Scan History', '🌙 Dark & Light Mode'].map((chip, i) => (
                            <span key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '99px', padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{chip}</span>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ── Section 2: Scam Education ── */}
            <section className="guide-section">
                <div className="section-title">
                    <div className="status-badge HighRisk" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <ShieldAlert size={16} /> Know the Enemy
                    </div>
                    <h2 className="section-heading">Recognize Scam Patterns</h2>
                    <p className="section-subtext">
                        Tap any card to reveal why it's a scam and how to protect yourself. Study these before thieves fool your family.
                    </p>
                </div>

                <div className="scam-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
                    {scamTemplates.map((scam, i) => (
                        <ScamCard key={i} scam={scam} index={i} />
                    ))}
                </div>
            </section>

            {/* ── Section 3: Scam Deep-Dive Explorer ── */}
            <section id="explorer-section" style={{ marginTop: '8rem' }}>
                <div className="section-title" style={{ marginBottom: '4rem' }}>
                    <div className="status-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                        <Search size={16} /> Deep Dive Library
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Learn More About Each Scam</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '650px', margin: '1rem auto' }}>
                        Tap any card below to read the complete guide — how it works, real Indian cases, and exact steps to protect yourself and your family.
                    </p>
                </div>

                <ExplorerGrid />
            </section>
        </motion.div>
    )
}

// ── Explorer Grid Component ────────────────────────────────────────────────
const explorerCards = [
    { slug: 'upi-bank-fraud', emoji: '🏦', title: 'UPI & Bank Fraud', color: '#3b82f6', cases: 3, desc: 'Fake KYC calls, OTP theft, UPI collect tricks' },
    { slug: 'fake-government-scheme', emoji: '🏛', title: 'Fake Government Schemes', color: '#f59e0b', cases: 3, desc: 'PM-Kisan fraud, fake Aadhaar camps, Ayushman scams' },
    { slug: 'lottery-prize-scam', emoji: '🎰', title: 'Lottery & Prize Scam', color: '#8b5cf6', cases: 3, desc: 'KBC WhatsApp scam, Amazon spin-wheel fraud' },
    { slug: 'job-employment-fraud', emoji: '💼', title: 'Job & Employment Fraud', color: '#22c55e', cases: 3, desc: 'Fake SSC recruitment, Gulf job scam, data entry fraud' },
    { slug: 'loan-app-fraud', emoji: '📱', title: 'Illegal Loan App Fraud', color: '#ef4444', cases: 3, desc: 'Data theft, harassment, suicides linked to illegal apps' },
    { slug: 'sim-swap-fraud', emoji: '📲', title: 'SIM Swap Fraud', color: '#0d9488', cases: 2, desc: 'Your number stolen without touching your phone' },
    { slug: 'qr-code-scam', emoji: '🔲', title: 'QR Code Scam', color: '#f97316', cases: 2, desc: 'OLX Army scam, merchant QR fraud' },
    { slug: 'fake-insurance-fraud', emoji: '📋', title: 'Fake Insurance Fraud', color: '#ec4899', cases: 2, desc: 'Fake crop insurance agents, Ayushman fake cards' },
    { slug: 'investment-ponzi-fraud', emoji: '📈', title: 'Investment & Ponzi Fraud', color: '#6366f1', cases: 3, desc: 'Rose Valley scam, crypto Ponzi, chit fund collapse' },
    { slug: 'impersonation-scam', emoji: '🎭', title: 'Impersonation Scam', color: '#84cc16', cases: 3, desc: 'Digital arrest, electricity scam, AI voice cloning' },
]

const ExplorerGrid = () => {
    const navigate = useNavigate()
    return (
        <div className="explorer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {explorerCards.map((card, i) => (
                <motion.div
                    key={card.slug}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-60px' }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    whileHover={{ y: -6 }}
                    onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate(`/scam/${card.slug}`) }}
                    className="explorer-card"
                    style={{ '--ecard-color': card.color, cursor: 'pointer' }}
                >
                    {/* Top accent bar */}
                    <div style={{ height: '5px', background: `linear-gradient(90deg, ${card.color}, ${card.color}66)`, borderRadius: '8px 8px 0 0', margin: '-2rem -2rem 1.5rem' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{card.emoji}</div>
                        <div style={{ background: `${card.color}15`, color: card.color, fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.7rem', borderRadius: '99px' }}>
                            {card.cases} Cases
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '1rem', marginBottom: '0.5rem' }}>{card.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, flex: 1 }}>{card.desc}</p>

                    <div className="explorer-card-cta" style={{ color: card.color }}>
                        Read Full Guide <ArrowRight size={16} />
                    </div>

                    {/* Hover glow */}
                    <div className="explorer-glow" style={{ background: card.color }} />
                </motion.div>
            ))}
        </div>
    )
}

export default GuidePage
