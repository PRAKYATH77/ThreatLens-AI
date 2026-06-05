// frontend/src/pages/Scanner.jsx
import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import Layout from '../components/shared/Layout';

const severityMap = {
    Critical: { badge: 'badge-critical', barColor: '#FF4560', leftBorder: '#FF4560' },
    High:     { badge: 'badge-high',     barColor: '#FF8C00', leftBorder: '#FF8C00' },
    Medium:   { badge: 'badge-medium',   barColor: '#FFD60A', leftBorder: '#FFD60A' },
    Low:      { badge: 'badge-low',      barColor: '#00FFA3', leftBorder: '#00FFA3' },
};

const categoryIcons = {
    HEADER: '🔒', 'TLS/SSL': '🔐', COOKIE: '🍪', CORS: '🌐', OTHER: '⚠️',
};

const Scanner = () => {
    const [targetUrl, setTargetUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [scanMeta, setScanMeta] = useState(null);
    const [error, setError] = useState('');

    const handleScan = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResults(null);
        setScanMeta(null);

        try {
            const res = await axiosInstance.post('/scan/start', { targetUrl });
            setResults(res.data.results || []);
            setScanMeta({ scanId: res.data.scanId, issuesFound: res.data.issuesFound });
        } catch (err) {
            setError(err.response?.data?.msg || 'Scan failed. Ensure URL includes http/https.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <header className="mb-8 fade-up">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="pulse-dot" />
                        <span className="text-xs font-semibold text-accent-green uppercase tracking-widest">Proactive Defense</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Vulnerability <span className="text-accent-cyan">Scanner</span>
                    </h1>
                    <p className="text-sm text-text-muted mt-1">Comprehensive HTTP security header &amp; TLS/SSL audit</p>
                    <div className="mt-5 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.4), rgba(0,255,163,0.1), transparent)' }} />
                </header>

                {/* Scan Form */}
                <div className="glass-card p-6 mb-6 fade-up" style={{ animationDelay: '0.1s' }}>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Target URL</p>
                    <form onSubmit={handleScan} className="flex gap-3">
                        <div className="flex-1 relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                            </svg>
                            <input
                                type="url"
                                placeholder="https://example.com"
                                value={targetUrl}
                                onChange={e => setTargetUrl(e.target.value)}
                                className="input-field pl-11"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center gap-2 px-6 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                    Start Audit
                                </>
                            )}
                        </button>
                    </form>

                    {/* Scanning animation */}
                    {loading && (
                        <div className="mt-5 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                <div className="pulse-dot" style={{ background: '#00D4FF', boxShadow: '0 0 6px rgba(0,212,255,0.8)' }} />
                                <span className="font-mono">Analyzing HTTP security headers...</span>
                            </div>
                            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <div className="h-full rounded-full shimmer" style={{ width: '100%' }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl flex items-center gap-3 fade-up"
                        style={{ background: 'rgba(255,69,96,0.08)', border: '1px solid rgba(255,69,96,0.25)' }}>
                        <svg className="w-5 h-5 text-accent-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        <p className="text-sm text-accent-red font-medium">{error}</p>
                    </div>
                )}

                {/* Results */}
                {results && (
                    <div className="fade-up space-y-4">
                        {/* Summary bar */}
                        <div
                            className="p-4 rounded-xl flex items-center justify-between"
                            style={{
                                background: results.length > 0 ? 'rgba(255,69,96,0.08)' : 'rgba(0,255,163,0.08)',
                                border: `1px solid ${results.length > 0 ? 'rgba(255,69,96,0.25)' : 'rgba(0,255,163,0.25)'}`,
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{results.length > 0 ? '⚠️' : '✅'}</span>
                                <div>
                                    <p className="font-bold text-sm text-text-light">
                                        {results.length > 0 ? `${results.length} Vulnerabilities Found` : 'No Vulnerabilities Found'}
                                    </p>
                                    {scanMeta && (
                                        <p className="text-xs font-mono text-text-muted mt-0.5">Scan ID: {scanMeta.scanId?.slice(0, 16)}...</p>
                                    )}
                                </div>
                            </div>
                            <span className={results.length > 0 ? 'badge-critical' : 'badge-low'}>
                                {results.length > 0 ? 'Action Required' : 'Secure'}
                            </span>
                        </div>

                        {/* Vuln cards */}
                        {results.map((vuln, idx) => {
                            const cfg = severityMap[vuln.severity] || severityMap.Low;
                            const catIcon = categoryIcons[vuln.category] || '⚠️';
                            return (
                                <div
                                    key={idx}
                                    className="glass-card-hover p-5 fade-up"
                                    style={{
                                        borderLeft: `3px solid ${cfg.leftBorder}`,
                                        animationDelay: `${idx * 0.07}s`,
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl mt-0.5">{catIcon}</span>
                                            <div>
                                                <h3 className="font-bold text-text-light text-sm">{vuln.title}</h3>
                                                <p className="text-xs text-text-muted mt-0.5">{vuln.description}</p>
                                            </div>
                                        </div>
                                        <span className={`${cfg.badge} flex-shrink-0`}>{vuln.severity}</span>
                                    </div>

                                    {vuln.remediation && (
                                        <div
                                            className="mt-3 p-3 rounded-lg"
                                            style={{ background: 'rgba(0,255,163,0.04)', border: '1px solid rgba(0,255,163,0.1)' }}
                                        >
                                            <p className="text-xs text-text-muted">
                                                <span className="text-accent-green font-semibold mr-1">Remediation:</span>
                                                {vuln.remediation}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-3 flex items-center gap-2">
                                        <span
                                            className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                                            style={{ background: 'rgba(255,255,255,0.05)', color: '#6B7280', border: '1px solid rgba(255,255,255,0.08)' }}
                                        >
                                            {vuln.category}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Scanner;