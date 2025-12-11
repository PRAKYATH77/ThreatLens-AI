import React, { useState } from 'react';
import axios from 'axios';

const AlertGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState('sql-injection');

    const API_BASE = 'http://127.0.0.1:5000/api';

    const generateAlert = async (type) => {
        setLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE}/simulate/${type}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setMessage(`✅ ${type.toUpperCase()} alert generated successfully!`);
            setAlertType(type);
        } catch (error) {
            setMessage(`❌ Failed: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const generateRandom = async () => {
        setLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE}/simulate/random`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setMessage('✅ Random threat alert generated!');
        } catch (error) {
            setMessage(`❌ Failed: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const clearAllAlerts = async () => {
        if (window.confirm('Are you sure you want to delete ALL alerts?')) {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.delete(`${API_BASE}/simulate/clear-all`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setMessage(`✅ ${res.data.message}`);
            } catch (error) {
                setMessage(`❌ Failed: ${error.response?.data?.error || error.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="bg-gradient-to-br from-secondary-bg to-primary-bg rounded-xl border border-accent-green/30 p-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🔨</span> Security Alert Generator
            </h3>
            
            <p className="text-gray-400 text-sm mb-6">Generate different types of security threats to test the system:</p>

            <div className="space-y-4">
                {/* Specific Threat Types */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => generateAlert('sql-injection')}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-300 font-semibold text-sm transition-all disabled:opacity-50"
                    >
                        💉 SQL Injection
                    </button>
                    <button
                        onClick={() => generateAlert('xss')}
                        disabled={loading}
                        className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 rounded-lg text-orange-300 font-semibold text-sm transition-all disabled:opacity-50"
                    >
                        🔥 XSS Attack
                    </button>
                    <button
                        onClick={() => generateAlert('brute-force')}
                        disabled={loading}
                        className="px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 rounded-lg text-yellow-300 font-semibold text-sm transition-all disabled:opacity-50"
                    >
                        🔨 Brute Force
                    </button>
                    <button
                        onClick={() => generateAlert('suspicious-ip')}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 font-semibold text-sm transition-all disabled:opacity-50"
                    >
                        👁️ Suspicious IP
                    </button>
                    <button
                        onClick={() => generateAlert('scanner')}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-300 font-semibold text-sm transition-all disabled:opacity-50"
                    >
                        🔍 Scanner Activity
                    </button>
                    <button
                        onClick={() => generateAlert('data-exfil')}
                        disabled={loading}
                        className="px-4 py-2 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 rounded-lg text-pink-300 font-semibold text-sm transition-all disabled:opacity-50"
                    >
                        📤 Data Exfil
                    </button>
                </div>

                {/* Random Alert Button */}
                <div className="border-t border-gray-700 pt-4">
                    <button
                        onClick={generateRandom}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-gradient-to-r from-accent-green/30 to-emerald-400/30 hover:from-accent-green/50 hover:to-emerald-400/50 border border-accent-green/50 rounded-lg text-white font-bold transition-all disabled:opacity-50"
                    >
                        🎲 Generate Random Alert
                    </button>
                </div>

                {/* Clear All Button */}
                <button
                    onClick={clearAllAlerts}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-red-900/20 hover:bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 font-semibold text-sm transition-all disabled:opacity-50"
                >
                    🗑️ Clear All Alerts
                </button>

                {/* Status Message */}
                {message && (
                    <div className={`p-4 rounded-lg border ${
                        message.includes('✅') 
                            ? 'bg-green-900/20 border-green-500/30 text-green-300'
                            : 'bg-red-900/20 border-red-500/30 text-red-300'
                    }`}>
                        {message}
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-black/30 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400">
                    💡 <strong>How to use:</strong> Click any button above to generate that type of security alert. Each alert includes realistic threat source information, attack vectors, and AI analysis. Check the Dashboard to see the new alerts appear in real-time via Socket.IO!
                </p>
            </div>
        </div>
    );
};

export default AlertGenerator;
