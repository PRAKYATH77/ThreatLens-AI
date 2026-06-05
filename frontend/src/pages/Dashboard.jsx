// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import useSocket from '../hooks/useSocket';
import useAuthStore from '../context/authstore';
import axiosInstance from '../api/axiosInstance';
import Layout from '../components/shared/Layout';
import IncidentModal from '../components/dashboard/IncidentModal';
import ThreatCharts from '../components/dashboard/ThreatCharts';
import AlertStats from '../components/dashboard/AlertStats';
import ThreatSourceAnalysis from '../components/dashboard/ThreatSourceAnalysis';
import ThreatDetailsModal from '../components/dashboard/ThreatDetailsModal';
import { exportAlertsToCSV, exportAlertsToJSON } from '../utils/exportUtils';

const severityConfig = {
    Critical: { row: 'alert-row-critical', badge: 'badge-critical', dot: '#FF4560' },
    High:     { row: 'alert-row-high',     badge: 'badge-high',     dot: '#FF8C00' },
    Medium:   { row: 'alert-row-medium',   badge: 'badge-medium',   dot: '#FFD60A' },
    Low:      { row: 'alert-row-low',      badge: 'badge-low',      dot: '#00FFA3' },
};

const typeIcons = {
    SQL_INJECTION:    '💉',
    XSS:             '⚡',
    BRUTE_FORCE:     '🔨',
    SUSPICIOUS_IP:   '🌐',
    SCANNER_ACTIVITY:'📡',
    OTHER:           '🔔',
};

const Dashboard = () => {
    const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api').replace('/api', '');
    const { alerts: socketAlerts } = useSocket(apiBaseUrl);
    const { user } = useAuthStore();

    const [selectedAlertId, setSelectedAlertId] = useState(null);
    const [dbAlerts, setDbAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [severityFilter, setSeverityFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedThreat, setSelectedThreat] = useState(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await axiosInstance.get('/alerts');
                setDbAlerts(response.data.alerts || []);
            } catch (error) {
                console.error('Error fetching alerts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    let allAlerts = [...socketAlerts, ...dbAlerts].reduce((unique, alert) => {
        if (!unique.find(a => a._id === alert._id)) unique.push(alert);
        return unique;
    }, []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    allAlerts = allAlerts.filter(alert => {
        const matchesSeverity = severityFilter === 'All' || alert.severity === severityFilter;
        const matchesSearch = !searchQuery ||
            alert.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.title?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSeverity && matchesSearch;
    });

    if (sortBy === 'severity') {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        allAlerts.sort((a, b) => (order[a.severity] ?? 99) - (order[b.severity] ?? 99));
    }

    return (
        <Layout>
            {/* ── Page Header ── */}
            <header className="mb-8 fade-up">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="pulse-dot" />
                            <span className="text-xs font-semibold text-accent-green uppercase tracking-widest">Live Monitoring</span>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            Security <span className="text-accent-green">Overview</span>
                        </h1>
                        <p className="text-sm text-text-muted mt-1">
                            Welcome back, <span className="text-text-light font-semibold">{user?.username || 'Analyst'}</span>
                        </p>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => exportAlertsToCSV(allAlerts)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200"
                            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00D4FF' }}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            CSV
                        </button>
                        <button
                            onClick={() => exportAlertsToJSON(allAlerts)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200"
                            style={{ background: 'rgba(0,255,163,0.08)', border: '1px solid rgba(0,255,163,0.2)', color: '#00FFA3' }}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            JSON
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-6 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,255,163,0.3), rgba(0,212,255,0.1), transparent)' }} />
            </header>

            {/* ── Stat Cards ── */}
            <AlertStats alerts={allAlerts} />

            {/* ── Charts + Source Analysis ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                <div className="xl:col-span-2">
                    <ThreatCharts alerts={allAlerts} />
                </div>
                <div className="xl:col-span-1">
                    <ThreatSourceAnalysis alerts={allAlerts} />
                </div>
            </div>

            {/* ── Live Threat Feed ── */}
            <div className="glass-card p-6 fade-up">
                {/* Feed Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="pulse-dot" style={{ background: '#FF4560', boxShadow: '0 0 6px rgba(255,69,96,0.8)' }} />
                        <h2 className="text-base font-bold text-text-light">Live Threat Feed</h2>
                        <span
                            className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{ background: 'rgba(255,69,96,0.12)', border: '1px solid rgba(255,69,96,0.25)', color: '#FF4560' }}
                        >
                            {allAlerts.length} Events
                        </span>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative flex-1 sm:flex-none">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search threats..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-2 text-xs w-full sm:w-52 rounded-lg outline-none transition-all duration-200 font-mono"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#E2E8F0' }}
                            />
                        </div>
                        <select
                            value={severityFilter}
                            onChange={e => setSeverityFilter(e.target.value)}
                            className="px-3 py-2 text-xs rounded-lg outline-none cursor-pointer"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#E2E8F0' }}
                        >
                            <option value="All">All Severity</option>
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="px-3 py-2 text-xs rounded-lg outline-none cursor-pointer"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#E2E8F0' }}
                        >
                            <option value="newest">Newest First</option>
                            <option value="severity">By Severity</option>
                        </select>
                    </div>
                </div>

                {/* Feed List */}
                <div className="space-y-2 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-20 rounded-xl shimmer" />
                            ))}
                        </div>
                    ) : allAlerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-text-muted">
                            <svg className="w-14 h-14 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                            <p className="font-semibold text-sm">No Active Threats</p>
                            <p className="text-xs mt-1 opacity-60">All systems operating normally</p>
                        </div>
                    ) : (
                        allAlerts.map((alert, index) => {
                            const cfg = severityConfig[alert.severity] || severityConfig.Low;
                            const icon = typeIcons[alert.type] || '🔔';

                            return (
                                <div
                                    key={alert._id || index}
                                    onClick={() => setSelectedThreat(alert)}
                                    className={`alert-row ${cfg.row} fade-up`}
                                    style={{ animationDelay: `${index * 0.04}s` }}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Type Icon */}
                                        <div
                                            className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 mt-0.5"
                                            style={{ background: `${cfg.dot}10`, border: `1px solid ${cfg.dot}20` }}
                                        >
                                            {icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Row 1: type + severity + time */}
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="text-xs font-bold text-text-light uppercase tracking-wider">
                                                    {(alert.type || 'ALERT').replace('_', ' ')}
                                                </span>
                                                <span className={cfg.badge}>{alert.severity}</span>
                                                <span className="text-[10px] text-text-muted font-mono ml-auto">
                                                    {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Now'}
                                                </span>
                                            </div>

                                            {/* Row 2: Source URL — the real origin */}
                                            {alert.threatSource?.targetURL && alert.threatSource.targetURL !== 'N/A' && (
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke={cfg.dot} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                                                    </svg>
                                                    <span
                                                        className="text-xs font-bold font-mono truncate"
                                                        style={{ color: cfg.dot }}
                                                        title={alert.threatSource.targetURL}
                                                    >
                                                        {alert.threatSource.targetURL}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Row 3: Message */}
                                            <p className="text-xs text-text-muted leading-relaxed mb-2">
                                                {alert.message || 'No description available'}
                                            </p>

                                            {/* Row 4: Meta chips — detection source, IP, confidence */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {alert.threatSource?.detectionSource && alert.threatSource.detectionSource !== 'Unknown' && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold"
                                                        style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00D4FF' }}>
                                                        🔍 {alert.threatSource.detectionSource}
                                                    </span>
                                                )}
                                                {alert.threatSource?.sourceIP && alert.threatSource.sourceIP !== 'Unknown' && alert.threatSource.sourceIP !== 'N/A (outbound scan)' && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded font-mono"
                                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF' }}>
                                                        IP: {alert.threatSource.sourceIP}
                                                    </span>
                                                )}
                                                {alert.analysis?.confidence > 0 && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold"
                                                        style={{ background: 'rgba(0,255,163,0.06)', border: '1px solid rgba(0,255,163,0.15)', color: '#00FFA3' }}>
                                                        {alert.analysis.confidence}% confidence
                                                    </span>
                                                )}
                                                {alert.threatSource?.sourceReputation && alert.threatSource.sourceReputation !== 'Unknown' && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold"
                                                        style={{
                                                            background: alert.threatSource.sourceReputation === 'Malicious' ? 'rgba(255,69,96,0.08)' : 'rgba(255,140,0,0.08)',
                                                            border: `1px solid ${alert.threatSource.sourceReputation === 'Malicious' ? 'rgba(255,69,96,0.2)' : 'rgba(255,140,0,0.2)'}`,
                                                            color: alert.threatSource.sourceReputation === 'Malicious' ? '#FF4560' : '#FF8C00',
                                                        }}>
                                                        ⚠ {alert.threatSource.sourceReputation}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Analyze button */}
                                    <button
                                        onClick={e => { e.stopPropagation(); setSelectedAlertId(alert._id); }}
                                        className="mt-3 w-full py-2 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                        style={{ background: 'rgba(0,255,163,0.06)', border: '1px solid rgba(0,255,163,0.15)', color: '#00FFA3' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,163,0.12)'; e.currentTarget.style.borderColor = 'rgba(0,255,163,0.3)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,255,163,0.06)'; e.currentTarget.style.borderColor = 'rgba(0,255,163,0.15)'; }}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                        </svg>
                                        Analyze with AI
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Modals */}
            {selectedAlertId && (
                <IncidentModal alertId={selectedAlertId} onClose={() => setSelectedAlertId(null)} />
            )}
            {selectedThreat && (
                <ThreatDetailsModal alert={selectedThreat} onClose={() => setSelectedThreat(null)} />
            )}
        </Layout>
    );
};

export default Dashboard;