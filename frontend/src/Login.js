import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) { navigate('/dashboard'); }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username, password
            });

            // ✅ Storage Updates
            localStorage.setItem('username', username);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // ✅ Signal l-Navbar bach t-update l-smiya f l-blast
            window.dispatchEvent(new Event("storage"));

            navigate('/dashboard');
        } catch (error) {
            setError("Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.blob1}></div>
            <div style={styles.blob2}></div>

            <div style={styles.glassCard}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Welcome Back</h1>
                    <p style={styles.subtitle}>Sign in to continue your projects</p>
                </div>

                <form onSubmit={handleLogin} style={styles.form}>
                    {error && <div style={styles.errorBox}>{error}</div>}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input 
                            type="text" 
                            placeholder="Enter your username" 
                            style={styles.input}
                            onChange={(e) => setUsername(e.target.value)} 
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            style={styles.input}
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{ 
                            ...styles.button, 
                            opacity: isLoading ? 0.7 : 1,
                            transform: isLoading ? 'scale(0.98)' : 'scale(1)'
                        }}
                    >
                        {isLoading ? "Authenticating..." : "Login to System"}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Don't have an account? <span style={styles.link} onClick={() => navigate('/register')}>Register</span>
                </p>
            </div>
        </div>
    );
}

const styles = {
    page: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', overflow: 'hidden', position: 'relative', fontFamily: "'Inter', sans-serif" },
    blob1: { position: 'absolute', width: '300px', height: '300px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', filter: 'blur(80px)', borderRadius: '50%', top: '-50px', left: '-50px', opacity: 0.4 },
    blob2: { position: 'absolute', width: '300px', height: '300px', background: 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)', filter: 'blur(80px)', borderRadius: '50%', bottom: '-50px', right: '-50px', opacity: 0.4 },
    glassCard: { width: '100%', maxWidth: '400px', padding: '40px', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(12px)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', zIndex: 10 },
    header: { textAlign: 'center', marginBottom: '32px' },
    title: { color: '#fff', fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' },
    subtitle: { color: '#94a3b8', fontSize: '14px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { color: '#e2e8f0', fontSize: '13px', fontWeight: '500', marginLeft: '4px' },
    input: { padding: '12px 16px', backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' },
    button: { marginTop: '10px', padding: '14px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' },
    errorBox: { padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '10px', color: '#f87171', fontSize: '13px', textAlign: 'center' },
    footerText: { textAlign: 'center', marginTop: '24px', color: '#94a3b8', fontSize: '14px' },
    link: { color: '#6366f1', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }
};

export default Login;