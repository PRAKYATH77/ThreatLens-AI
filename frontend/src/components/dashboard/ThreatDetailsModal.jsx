import React, { useState } from 'react';

const ThreatDetailsModal = ({ alert, onClose }) => {
    if (!alert) return null;

    const getSeverityBgColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical': return 'bg-red-900/30 border-red-500/30';
            case 'high': return 'bg-orange-900/30 border-orange-500/30';
            case 'medium': return 'bg-yellow-900/30 border-yellow-500/30';
            default: return 'bg-blue-900/30 border-blue-500/30';
        }
    };

    const getSeverityTextColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical': return 'text-red-300';
            case 'high': return 'text-orange-300';
            case 'medium': return 'text-yellow-300';
            default: return 'text-blue-300';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-secondary-bg to-primary-bg rounded-2xl shadow-2xl border border-accent-green/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-secondary-bg to-primary-bg/50 border-b border-accent-green/20 p-6 flex justify-between items-start">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">{alert.type || alert.title || 'Threat'}</h2>
                        <p className="text-gray-400 text-sm">{alert.message || alert.description || 'No description'}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl transition-all"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Severity and Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg border ${getSeverityBgColor(alert.severity)}`}>
                            <p className="text-xs text-gray-400 mb-1">Severity Level</p>
                            <p className={`text-xl font-bold ${getSeverityTextColor(alert.severity)}`}>
                                {alert.severity || 'Unknown'}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg border border-accent-green/30 bg-accent-green/10">
                            <p className="text-xs text-gray-400 mb-1">Detection Time</p>
                            <p className="text-lg font-bold text-accent-green">
                                {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Threat Source - KEY FEATURE */}
                    <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/30 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">📍</span>
                            <h3 className="text-lg font-bold text-white">Threat Source</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-2">Detection Source</p>
                                    <p className="text-sm font-bold text-blue-300 bg-blue-900/20 p-3 rounded-lg">
                                        {alert.threatSource?.detectionSource || alert.source || 'Security Scanner'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-2">Source Reputation</p>
                                    <p className={`text-sm font-bold p-3 rounded-lg ${
                                        alert.threatSource?.sourceReputation === 'Malicious' ? 'bg-red-900/20 text-red-300' :
                                        alert.threatSource?.sourceReputation === 'Suspicious' ? 'bg-orange-900/20 text-orange-300' :
                                        alert.threatSource?.sourceReputation === 'Clean' ? 'bg-green-900/20 text-green-300' :
                                        'bg-gray-900/20 text-gray-300'
                                    }`}>
                                        {alert.threatSource?.sourceReputation || 'Unknown'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-2">Source IP</p>
                                <p className="text-sm font-mono bg-black/30 p-3 rounded text-cyan-300 break-all border border-cyan-500/20">
                                    {alert.threatSource?.sourceIP || alert.ip || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-2">Source Path</p>
                                <p className="text-sm font-mono bg-black/30 p-3 rounded text-gray-300 break-all border border-gray-700">
                                    {alert.threatSource?.sourcePath || alert.path || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-2">Target URL</p>
                                <p className="text-sm font-mono bg-black/30 p-3 rounded text-purple-300 break-all border border-purple-500/20">
                                    {alert.threatSource?.targetURL || alert.targetUrl || 'N/A'}
                                </p>
                            </div>
                            {alert.threatSource?.sourceCountry && alert.threatSource?.sourceCountry !== 'N/A' && (
                                <div className="pt-2 border-t border-blue-500/20">
                                    <p className="text-xs text-gray-400 mb-2">Source Location</p>
                                    <p className="text-sm font-bold text-blue-300">🌍 {alert.threatSource?.sourceCountry}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payload/Evidence */}
                    <div className="bg-black/30 border border-gray-700 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <span>📋</span> Threat Evidence
                        </h3>
                        <div className="bg-black/50 p-4 rounded-lg border border-gray-700 font-mono text-sm text-gray-300 overflow-x-auto max-h-48">
                            {alert.payload ? (
                                typeof alert.payload === 'string' ? (
                                    <pre className="whitespace-pre-wrap break-words">{alert.payload}</pre>
                                ) : (
                                    <pre className="whitespace-pre-wrap break-words">{JSON.stringify(alert.payload, null, 2)}</pre>
                                )
                            ) : (
                                <p className="text-gray-500">No payload data available</p>
                            )}
                        </div>
                    </div>

                    {/* Threat Analysis */}
                    {alert.analysis && (
                        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span>🧠</span> Threat Analysis
                            </h3>
                            <div className="space-y-4">
                                {alert.analysis.confidence > 0 && (
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-xs text-gray-400">Detection Confidence</p>
                                            <p className="text-sm font-bold text-purple-300">{alert.analysis.confidence}%</p>
                                        </div>
                                        <div className="w-full bg-black/30 rounded-full h-2 border border-purple-500/20">
                                            <div 
                                                className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${alert.analysis.confidence}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {alert.analysis.attackVector && alert.analysis.attackVector !== 'N/A' && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-2">Attack Vector</p>
                                        <p className="text-sm text-purple-200 bg-purple-900/20 p-3 rounded-lg">{alert.analysis.attackVector}</p>
                                    </div>
                                )}
                                {alert.analysis.aiAnalysis && alert.analysis.aiAnalysis !== 'N/A' && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-2">AI Analysis</p>
                                        <p className="text-sm text-gray-300 bg-black/30 p-3 rounded-lg border border-gray-700">{alert.analysis.aiAnalysis}</p>
                                    </div>
                                )}
                                {alert.analysis.recommendations && alert.analysis.recommendations.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-2">Recommendations</p>
                                        <ul className="space-y-2">
                                            {alert.analysis.recommendations.map((rec, idx) => (
                                                <li key={idx} className="text-sm text-green-300 flex items-start gap-2">
                                                    <span className="text-green-400 mt-1">✓</span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Additional Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
                            <p className="text-xs text-gray-400 mb-2">Alert ID</p>
                            <p className="text-sm font-mono text-gray-300 break-all">{alert._id || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-black/20 rounded-lg border border-gray-700">
                            <p className="text-xs text-gray-400 mb-2">Detection Type</p>
                            <p className="text-sm font-bold text-white">{alert.type || 'OTHER'}</p>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-gradient-to-r from-accent-green/30 to-emerald-400/30 border border-accent-green/50 hover:from-accent-green/50 hover:to-emerald-400/50 rounded-lg text-white font-bold transition-all"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThreatDetailsModal;
