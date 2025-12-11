// frontend/src/pages/Scanner.jsx
import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import Layout from '../components/shared/Layout';

const Scanner = () => {
    const [targetUrl, setTargetUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const handleScan = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResults(null);

        try {
            // Start the scan
            const startRes = await axiosInstance.post('/scan/start', { targetUrl });
            const scanId = startRes.data.scanId;

            // In a real app, we might poll here. For now, we just wait for the response 
            // or fetch results immediately since your backend runs it in one request-response cycle 
            // (depending on how you implemented scanController.js - if it uses async/await correctly it returns results).
            
            // Assuming your startScan returns results directly (as per your Phase 4 code):
            setResults(startRes.data.results || []);
        } catch (err) {
            setError(err.response?.data?.msg || "Scan failed. Ensure URL includes http/https.");
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (sev) => {
        if (sev === 'Critical') return 'text-accent-red';
        if (sev === 'High') return 'text-orange-500';
        return 'text-yellow-400';
    };

    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="text-5xl">🔍</span>
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-accent-green via-emerald-400 to-accent-green bg-clip-text text-transparent">
                                Proactive Vulnerability Scanner
                            </h1>
                            <p className="text-gray-400 mt-2 font-medium">Comprehensive security audits for web applications</p>
                        </div>
                    </div>
                </div>

                {/* Scanner Form */}
                <div className="bg-gradient-to-br from-secondary-bg/80 to-primary-bg/50 backdrop-blur-sm rounded-xl border border-accent-green/10 p-8 hover:border-accent-green/30 transition-all duration-300 shadow-xl">
                    <form onSubmit={handleScan} className="space-y-4">
                        <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">Target URL</label>
                        <div className="flex gap-4">
                            <input 
                                type="url" 
                                placeholder="https://example.com" 
                                value={targetUrl}
                                onChange={(e) => setTargetUrl(e.target.value)}
                                className="flex-1 px-6 py-4 rounded-lg bg-primary-bg border border-gray-700 focus:border-accent-green focus:ring-2 focus:ring-accent-green/20 outline-none text-white font-medium placeholder-gray-500 transition-all"
                                required
                            />
                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`px-8 py-4 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 ${
                                    loading 
                                        ? 'bg-gray-600 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-accent-green to-emerald-500 hover:from-accent-green hover:to-emerald-600 shadow-lg shadow-accent-green/30'
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⚙️</span> Scanning...
                                    </span>
                                ) : (
                                    'Start Audit'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                {error && <div className="p-4 bg-red-900/30 border border-accent-red rounded text-red-200 mb-6">{error}</div>}

                {results && (
                    <div className="space-y-6">
                        {results.length === 0 && (
                            <div className="text-center py-12">
                                <span className="text-6xl mb-4 block">✅</span>
                                <p className="text-accent-green text-lg font-bold">No vulnerabilities found! 🎉</p>
                                <p className="text-gray-400 text-sm mt-2">This application passed all security checks.</p>
                            </div>
                        )}
                        
                        {results.length > 0 && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="p-4 bg-accent-red/10 border border-accent-red/30 rounded-lg">
                                    <h3 className="text-accent-red font-bold">{results.length} Vulnerabilities Found</h3>
                                </div>
                                {results.map((vuln, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`p-6 rounded-xl backdrop-blur-sm border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] ${
                                            vuln.severity === 'Critical' ? 'bg-red-900/10 border-accent-red' :
                                            vuln.severity === 'High' ? 'bg-orange-900/10 border-orange-500' :
                                            'bg-yellow-900/10 border-yellow-400'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-1">{vuln.title}</h3>
                                                <p className="text-gray-300 text-sm">{vuln.description}</p>
                                            </div>
                                            <span className={`font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap ml-4 ${
                                                vuln.severity === 'Critical' ? 'bg-red-600/30 text-red-300' :
                                                vuln.severity === 'High' ? 'bg-orange-600/30 text-orange-300' :
                                                'bg-yellow-600/30 text-yellow-300'
                                            }`}>
                                                {vuln.severity}
                                            </span>
                                        </div>
                                        <div className="bg-black/30 p-4 rounded-lg border border-white/10 mb-4">
                                            <p className="text-gray-300 text-sm"><span className="text-accent-green font-bold">Remediation:</span> {vuln.remediation}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Scanner;