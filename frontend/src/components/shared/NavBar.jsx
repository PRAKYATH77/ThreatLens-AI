// frontend/src/components/shared/NavBar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../context/authstore';

const NavBar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-accent-green/20 px-8 py-5 flex justify-between items-center sticky top-0 z-50 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-12">
                <Link to="/dashboard" className="flex items-center space-x-3 group cursor-pointer">
                    <div className="relative">
                        <div className="absolute inset-0 bg-accent-green/30 blur-lg rounded-full animate-pulse"></div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-green via-emerald-400 to-accent-green tracking-wider relative">
                            🛡️ ThreatLens
                        </h1>
                    </div>
                    <span className="text-xs font-bold text-accent-green/60 uppercase tracking-[3px]">Security</span>
                </Link>
                
                {user && (
                    <div className="flex space-x-2">
                        <Link 
                            to="/dashboard" 
                            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                isActive('/dashboard') 
                                    ? 'bg-accent-green text-black shadow-lg shadow-accent-green/50' 
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Dashboard
                        </Link>
                        <Link 
                            to="/scanner" 
                            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                isActive('/scanner') 
                                    ? 'bg-accent-green text-black shadow-lg shadow-accent-green/50' 
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Proactive Scanner
                        </Link>
                        <Link 
                            to="/settings" 
                            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                isActive('/settings') 
                                    ? 'bg-accent-green text-black shadow-lg shadow-accent-green/50' 
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            ⚙️ Settings
                        </Link>
                    </div>
                )}
            </div>
            
            {user && (
                <div className="flex items-center space-x-6">
                    <div className="h-10 w-px bg-gradient-to-b from-transparent via-accent-green/30 to-transparent"></div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-400">Logged in as</span>
                        <span className="text-sm font-bold text-accent-green">{user.username}</span>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg text-sm transition-all duration-300 shadow-lg hover:shadow-red-600/50 hover:shadow-xl"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default NavBar;