// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import useAuthStore from '../context/authstore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!email || !password) {
        setError('Email and password are required.');
        setLoading(false);
        return;
    }

    try {
      const response = await axiosInstance.post('/auth/login', { email, password });

      // If backend returns a token (helpful in dev when cookies are blocked), store it
      if (response.data?.token) {
        try {
          localStorage.setItem('auth_token', response.data.token);
          // Set default Authorization header for subsequent requests
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        } catch (e) {
          console.warn('Could not persist token:', e.message);
        }
      }

      login(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login Failed:', err.response?.data?.msg || err.message);
      setError(err.response?.data?.msg || 'Login Failed: Check credentials or server status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-green/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-green/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-10">
          <div className="inline-block mb-6">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-green via-emerald-400 to-accent-green">
              🛡️ ThreatLens
            </div>
          </div>
          <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase">AI-Powered Security Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-accent-green/20 rounded-2xl shadow-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-white mb-8">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm font-medium text-center animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-slate-900/50 border border-accent-green/30 text-white rounded-lg focus:outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/50 transition placeholder-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-900/50 border border-accent-green/30 text-white rounded-lg focus:outline-none focus:border-accent-green focus:ring-2 focus:ring-accent-green/50 transition placeholder-gray-500"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-bold text-black bg-gradient-to-r from-accent-green to-emerald-500 hover:from-emerald-400 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-accent-green/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
                  Signing in...
                </>
              ) : (
                <>Sign In Securely</>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">🔐 Enterprise-Grade Security Monitoring</p>
        </div>
      </div>
    </div>
  );
};

export default Login;