import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const [currentUser, setCurrentUser] = useState('User');

    useEffect(() => {
        const updateUser = () => {
            const storedUser = localStorage.getItem('username');
            if (storedUser) {
                setCurrentUser(storedUser);
            }
        };

        updateUser(); // Check f l-bedya

        // ✅ Listen l-ay taghyir f storage bach tbeddel smiya bla Refresh
        window.addEventListener('storage', updateUser);
        return () => window.removeEventListener('storage', updateUser);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (!token) return null;

    const getAvatarEmoji = (name) => {
        const emojis = ['👨‍💻', '🚀', '⚡', '🤖', '🌟', '🛡️', '🎯', '💻'];
        const index = name.charCodeAt(0) % emojis.length;
        return emojis[index];
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.logoContainer} onClick={() => navigate('/dashboard')}>
                <div style={styles.logoIcon}>K</div>
                <div style={styles.brandName}>
                    <span style={styles.karizma}>Karizma</span>
                    <span style={styles.manager}>Manager</span>
                </div>
            </div>

            <div style={styles.rightSection}>
                <div style={styles.userBadge}>
                    <div style={styles.avatar}>
                        {getAvatarEmoji(currentUser)}
                    </div>
                    <span style={styles.userName}>{currentUser}</span>
                </div>

                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
}

const styles = {
    nav: { position: 'fixed', top: 0, left: 0, width: '100%', height: '70px', backgroundColor: '#0f172a', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', zIndex: 1000, boxSizing: 'border-box' },
    logoContainer: { display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' },
    logoIcon: { width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '18px' },
    brandName: { fontSize: '20px', fontWeight: '800' },
    karizma: { color: '#fff' },
    manager: { color: '#6366f1', marginLeft: '4px' },
    rightSection: { display: 'flex', alignItems: 'center', gap: '24px' },
    userBadge: { display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '24px', borderRight: '1px solid rgba(255, 255, 255, 0.1)' },
    avatar: { width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '1.5px solid rgba(99, 102, 241, 0.3)' },
    userName: { color: '#e2e8f0', fontSize: '15px', fontWeight: '600', textTransform: 'capitalize' },
    logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '14px', fontWeight: '700', padding: '8px 12px', borderRadius: '10px', transition: '0.2s', backgroundColor: 'rgba(239, 68, 68, 0.05)' },
    icon: { width: '18px', height: '18px' }
};

export default Navbar;