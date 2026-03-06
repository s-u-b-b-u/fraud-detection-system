import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft, AlertTriangle, CheckCircle2, Phone, BookOpen,
    ShieldAlert, FileWarning, History, Shield
} from 'lucide-react'
import scamData from './scamData'

const ScamDetailPage = () => {
    const { slug } = useParams()
    const navigate = useNavigate()
    const scam = scamData[slug]

    if (!scam) {
        return (
            <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                <h2>Document Not Found</h2>
                <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
                    This scam guide doesn't exist yet. Please go back.
                </p>
                <button className="cta-button" onClick={() => navigate('/guide', { state: { scrollToExplorer: true } })}>
                    <ArrowLeft size={18} /> Back to Guide
                </button>
            </div>
        )
    }

    const sectionFade = (delay = 0) => ({
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay }
    })

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ paddingTop: '3rem', paddingBottom: '8rem', maxWidth: '900px' }}>

            {/* Back button */}
            <button
                onClick={() => navigate('/guide', { state: { scrollToExplorer: true } })}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--card-border)', borderRadius: '99px', padding: '0.5rem 1.2rem', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '3rem', fontSize: '0.9rem', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--card-border)'}
            >
                <ArrowLeft size={16} /> Back to Guide
            </button>

            {/* Hero */}
            <motion.div {...sectionFade(0)} style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ background: `${scam.color}20`, width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', flexShrink: 0, border: `2px solid ${scam.color}40` }}>
                        {scam.emoji}
                    </div>
                    <div>
                        <div style={{ background: `${scam.color}15`, color: scam.color, display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            ⚠ Scam Alert Guide
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.5px', margin: 0 }}>{scam.title}</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem', fontStyle: 'italic' }}>{scam.tagline}</p>
                    </div>
                </div>
            </motion.div>

            {/* Overview */}
            <motion.div {...sectionFade(0.05)} className="card" style={{ padding: '2.5rem', marginBottom: '2rem', borderLeft: `5px solid ${scam.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <BookOpen size={22} color={scam.color} />
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>What Is This Fraud?</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                    {scam.overview}
                </p>
            </motion.div>

            {/* How it works */}
            <motion.div {...sectionFade(0.1)} className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <FileWarning size={22} color="#f59e0b" />
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>How the Scam Works</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {scam.howItWorks.map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ background: '#f59e0b20', color: '#f59e0b', fontWeight: 900, fontSize: '0.85rem', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                                {i + 1}
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>{step}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Warning signs */}
            <motion.div {...sectionFade(0.15)} className="card" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <AlertTriangle size={22} color="#ef4444" />
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Warning Signs to Watch For</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {(scam.warningSign || scam.warningSigns || []).map((sign, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '3px' }} />
                            <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>{sign}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Real Cases */}
            <motion.div {...sectionFade(0.2)} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <History size={22} color="var(--accent-color)" />
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Real Cases from India</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {scam.realCases.map((c, i) => (
                        <div key={i} className="card" style={{ padding: '2rem', borderLeft: `4px solid ${scam.color}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <ShieldAlert size={16} color={scam.color} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: scam.color }}>{c.title}</h3>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.75, margin: 0 }}>{c.description}</p>
                            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.7, fontStyle: 'italic' }}>
                                📌 Source: {c.source}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* What to do */}
            <motion.div {...sectionFade(0.25)} className="card" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'rgba(34,197,94,0.04)', borderColor: 'rgba(34,197,94,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <CheckCircle2 size={22} color="#22c55e" />
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>What You Should Do</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {scam.whatToDo.map((action, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div style={{ background: '#22c55e20', color: '#22c55e', fontWeight: 900, fontSize: '0.8rem', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>✓</div>
                            <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>{action}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Helplines */}
            <motion.div {...sectionFade(0.3)} className="card" style={{ padding: '2.5rem', background: `${scam.color}08`, borderColor: `${scam.color}25` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Phone size={22} color={scam.color} />
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Important Helplines</h2>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {scam.helplines.map((h, i) => (
                        <div key={i} style={{ background: 'var(--card-bg)', border: `1px solid ${scam.color}30`, borderRadius: '16px', padding: '0.75rem 1.5rem', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={16} color={scam.color} />
                            {h}
                        </div>
                    ))}
                </div>
            </motion.div>

        </motion.div>
    )
}

export default ScamDetailPage
