import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ShieldCheck, ArrowRight, Loader2, LogIn, UserPlus, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AuthPage = ({ user }) => {
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                })
                if (signUpError) throw signUpError
                alert('Success! Please verify your email or sign in.')
                setIsSignUp(false)
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (signInError) throw signInError
                navigate('/')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    if (user) {
        return (
            <div className="container" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card"
                    style={{ maxWidth: '400px', textAlign: 'center', padding: '4rem' }}
                >
                    <div style={{ background: 'var(--safe-color)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <ShieldCheck color="#fff" size={40} />
                    </div>
                    <h2 style={{ marginBottom: '1rem' }}>Already Signed In</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                        Logged in as <br /><strong>{user.email}</strong>
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button onClick={() => navigate('/')} className="cta-button" style={{ width: '100%' }}>
                            Go to Dashboard
                        </button>
                        <button onClick={handleLogout} className="logout-btn" style={{ padding: '1rem', border: '1px solid var(--card-border)', background: 'transparent' }}>
                            <LogOut size={18} /> Logout from this account
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card auth-card"
                style={{ maxWidth: '480px', width: '100%', padding: '4rem 3rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <motion.div
                        whileHover={{ rotate: 15 }}
                        style={{
                            background: 'var(--accent-color)',
                            width: '64px',
                            height: '64px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem auto',
                            boxShadow: '0 12px 24px rgba(var(--accent-color-rgb), 0.25)'
                        }}
                    >
                        <ShieldCheck color="#fff" size={36} />
                    </motion.div>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-1px' }}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.8rem', fontSize: '1.1rem' }}>
                        {isSignUp ? 'Join our village safety network.' : 'Sign in to stay protected.'}
                    </p>
                </div>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {isSignUp && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="input-field-custom">
                            <User size={22} />
                            <input
                                type="text"
                                placeholder="What's your name?"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </motion.div>
                    )}
                    <div className="input-field-custom">
                        <Mail size={22} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-field-custom">
                        <Lock size={22} />
                        <input
                            type="password"
                            placeholder="Secret Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ color: 'var(--risk-color)', textAlign: 'center', fontSize: '0.95rem', fontWeight: 600, padding: '1rem' }}
                        >
                            ⚠️ {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        className="cta-button"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '2rem', height: '60px', fontSize: '1.2rem' }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={28} /> : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                {isSignUp ? 'Start Protection' : 'Sign In Now'} <ArrowRight size={22} />
                            </div>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        {isSignUp ? 'Already a member?' : "New to Guardian AI?"}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--accent-color)',
                                fontWeight: 800,
                                cursor: 'pointer',
                                marginLeft: '0.8rem',
                                padding: '0.5rem',
                                fontSize: '1rem'
                            }}
                        >
                            {isSignUp ? 'Log In' : 'Join for Free'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default AuthPage
