// frontend/src/components/shared/NavBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../context/authstore';

const NavBar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => { logout(); navigate('/'); };
    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-primary-bg/95 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl'
                    : 'bg-primary-bg/80 backdrop-blur-md border-b border-white/[0.04]'
            }`}
        >
            <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        {/* Shield icon */}
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <div className="absolute inset-0 bg-accent-green/20 rounded-lg blur-md group-hover:bg-accent-green/30 transition-all duration-300" />
                            <svg className="w-5 h-5 text-accent-green relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                            </svg>
                        </div>
                        <div>
                            <span className="text-lg font-black tracking-tight text-white">ThreatLens</span>
                            <span className="text-xs font-semibold text-accent-green/60 tracking-[2px] uppercase ml-2">AI</span>
                        </div>
                    </Link>

                    {user && (
                        <div className="flex items-center gap-1">
                            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                                Dashboard
                            </Link>
                            <Link to="/scanner" className={`nav-link ${isActive('/scanner') ? 'active' : ''}`}>
                                Scanner
                            </Link>
                            <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>
                                Settings
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right: Status + User */}
                {user && (
                    <div className="flex items-center gap-5">
                        {/* Live clock */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                            <div className="pulse-dot" />
                            <span className="text-xs font-mono text-text-muted">
                                {time.toLocaleTimeString('en-US', { hour12: false })}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="h-6 w-px bg-white/[0.08]" />

                        {/* User */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-accent-green/15 border border-accent-green/25 flex items-center justify-center">
                                <span className="text-xs font-bold text-accent-green">
                                    {user.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-xs font-semibold text-text-light leading-none">{user.username}</p>
                                <p className="text-[10px] text-text-muted mt-0.5">{user.role || 'Analyst'}</p>
                            </div>
                        </div>

                        <button onClick={handleLogout} className="btn-danger text-xs">
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;