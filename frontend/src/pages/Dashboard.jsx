// frontend/src/pages/Dashboard.jsx (FINAL - Charts + AI)
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

const getAlertColor = (severity) => {
    switch (severity?.toLowerCase()) {
        case 'critical': return 'border-accent-red bg-red-900/10 hover:bg-red-900/20';
        case 'high': return 'border-orange-500 bg-orange-900/10 hover:bg-orange-900/20';
        case 'medium': return 'border-yellow-500 bg-yellow-900/10 hover:bg-yellow-900/20';
        default: return 'border-gray-600 bg-gray-800/50';
    }
};

const Dashboard = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL.replace('/api', ''); 
    const { alerts: socketAlerts } = useSocket(apiBaseUrl);
    const { user } = useAuthStore();
    const [selectedAlertId, setSelectedAlertId] = useState(null);
    const [dbAlerts, setDbAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [severityFilter, setSeverityFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedThreat, setSelectedThreat] = useState(null);

    // Fetch alerts from database on mount
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

    // Combine database alerts with socket alerts (socket alerts take priority)
    let allAlerts = [...socketAlerts, ...dbAlerts].reduce((unique, alert) => {
        if (!unique.find(a => a._id === alert._id)) {
            unique.push(alert);
        }
        return unique;
    }, []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Apply filters and search
    allAlerts = allAlerts.filter(alert => {
        const matchesSeverity = severityFilter === 'All' || alert.severity === severityFilter;
        const matchesSearch = searchQuery === '' || 
            alert.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.title?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSeverity && matchesSearch;
    });

    // Sort alerts
    if (sortBy === 'severity') {
        const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        allAlerts.sort((a, b) => (severityOrder[a.severity] || 999) - (severityOrder[b.severity] || 999));
    } 

    return (
        <Layout>
            <header className="mb-12 flex justify-between items-end border-b border-gradient-to-r from-accent-green/20 via-transparent to-transparent pb-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="text-6xl animate-bounce" style={{animationDuration: '2s'}}>🛡️</div>
                        <div>
                            <h1 className="text-5xl font-black bg-gradient-to-r from-accent-green via-emerald-400 to-accent-green bg-clip-text text-transparent tracking-tight">
                                Security Overview
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">Real-time threat detection & analysis</p>
                        </div>
                    </div>
                    <p className="text-gray-400 font-medium">
                        Welcome back, <span className="text-accent-green font-bold text-lg">{user?.username || 'Operator'}</span>
                        <span className="ml-3 text-xs bg-gradient-to-r from-accent-green/10 to-emerald-400/10 px-3 py-1 rounded-full text-accent-green font-semibold border border-accent-green/30">Premium Dashboard</span>
                    </p>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-accent-green/10 to-emerald-400/10 rounded-xl border border-accent-green/30 backdrop-blur-sm shadow-lg shadow-accent-green/10">
                    <span className="w-3 h-3 bg-accent-green rounded-full animate-pulse shadow-lg shadow-accent-green/50"></span>
                    <span className="text-sm text-gray-300 font-semibold">System Online</span>
                </div>
            </header>
            
            {/* --- ALERT STATISTICS CARDS --- */}
            <AlertStats alerts={allAlerts} />

            {/* --- THREAT CHARTS SECTION --- */}
            <div className="mb-10">
                <ThreatCharts alerts={allAlerts} />
            </div>

            {/* --- THREAT SOURCE ANALYSIS --- */}
            <div className="mb-10">
                <ThreatSourceAnalysis alerts={allAlerts} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Feed Column (Spans full width on mobile, 2 cols on large screens if needed, or full width) */}
                <div className="lg:col-span-3 bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-accent-green/20 p-8 h-[calc(100vh-250px)] flex flex-col hover:shadow-2xl hover:shadow-accent-green/10 transition-all duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🔴</span>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Live Threat Feed</h2>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-accent-green/10 rounded-lg border border-accent-green/30">
                            <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
                            <span className="bg-gradient-to-r from-accent-green to-emerald-400 bg-clip-text text-transparent text-sm font-bold">{allAlerts.length} Threats</span>
                        </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="mb-6 space-y-3">
                        <div className="flex flex-col md:flex-row gap-3">
                            <input 
                                type="text"
                                placeholder="🔍 Search alerts by type or message..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-4 py-2 bg-black/30 border border-accent-green/20 rounded-lg text-white placeholder-gray-500 focus:border-accent-green/60 focus:ring-1 focus:ring-accent-green/30 outline-none transition-all"
                            />
                            <select 
                                value={severityFilter}
                                onChange={(e) => setSeverityFilter(e.target.value)}
                                className="px-4 py-2 bg-black/30 border border-accent-green/20 rounded-lg text-white focus:border-accent-green/60 outline-none transition-all"
                            >
                                <option value="All">All Severity</option>
                                <option value="Critical">🔴 Critical</option>
                                <option value="High">🟠 High</option>
                                <option value="Medium">🟡 Medium</option>
                                <option value="Low">🟢 Low</option>
                            </select>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 bg-black/30 border border-accent-green/20 rounded-lg text-white focus:border-accent-green/60 outline-none transition-all"
                            >
                                <option value="newest">Newest First</option>
                                <option value="severity">By Severity</option>
                            </select>
                            <button 
                                onClick={() => exportAlertsToCSV(allAlerts)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600/30 to-blue-400/30 border border-blue-500/30 rounded-lg text-blue-300 hover:from-blue-600/50 hover:to-blue-400/50 font-semibold text-sm transition-all"
                                title="Export as CSV"
                            >
                                📥 CSV
                            </button>
                            <button 
                                onClick={() => exportAlertsToJSON(allAlerts)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600/30 to-purple-400/30 border border-purple-500/30 rounded-lg text-purple-300 hover:from-purple-600/50 hover:to-purple-400/50 font-semibold text-sm transition-all"
                                title="Export as JSON"
                            >
                                📥 JSON
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 pr-3 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-green mb-3"></div>
                                <p className="font-medium">Loading threats...</p>
                            </div>
                        ) : allAlerts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <span className="text-5xl mb-4">✅</span>
                                <p className="font-semibold mb-2">No Active Threats</p>
                                <span className="text-xs opacity-50">All systems secure • Monitoring active...</span>
                            </div>
                        ) : (
                            allAlerts.map((alert, index) => (
                                <div 
                                    key={alert._id || index} 
                                    onClick={() => setSelectedThreat(alert)}
                                    className={`p-4 rounded-xl border-l-4 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer ${getAlertColor(alert.severity)}`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-block px-3 py-1 bg-black/30 rounded-lg font-bold text-xs uppercase tracking-wider">{alert.type || alert.title || 'ALERT'}</span>
                                            {alert.severity && (
                                                <span className={`text-xs font-bold uppercase px-2 py-1 rounded-lg ${
                                                    alert.severity.toLowerCase() === 'critical' ? 'bg-red-900/30 text-red-300' :
                                                    alert.severity.toLowerCase() === 'high' ? 'bg-orange-900/30 text-orange-300' :
                                                    alert.severity.toLowerCase() === 'medium' ? 'bg-yellow-900/30 text-yellow-300' :
                                                    'bg-blue-900/30 text-blue-300'
                                                }`}>{alert.severity}</span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono opacity-70">
                                            {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Now'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-300 font-mono break-all bg-black/40 p-3 rounded-lg mb-4 border border-white/10 hover:border-white/20 transition-all">
                                        {alert.payload?.substring(0, 100) || alert.message?.substring(0, 100) || "No Payload"}...
                                    </p>
                                    
                                    <button 
                                        onClick={() => setSelectedAlertId(alert._id)}
                                        className="w-full py-2 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-accent-green/20 to-emerald-400/20 hover:from-accent-green/40 hover:to-emerald-400/40 border border-accent-green/30 hover:border-accent-green/60 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-accent-green/20"
                                    >
                                        🤖 Analyze with AI →
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            
            {/* Incident Modal */}
            {selectedAlertId && (
                <IncidentModal 
                    alertId={selectedAlertId} 
                    onClose={() => setSelectedAlertId(null)} 
                />
            )}
            
            {/* Threat Details Modal */}
            {selectedThreat && (
                <ThreatDetailsModal 
                    alert={selectedThreat} 
                    onClose={() => setSelectedThreat(null)} 
                />
            )}
        </Layout>
    );
};

export default Dashboard;