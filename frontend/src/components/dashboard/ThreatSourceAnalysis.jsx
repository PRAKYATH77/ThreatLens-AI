import React from 'react';

const ThreatSourceAnalysis = ({ alerts }) => {
    // Analyze threat sources
    const sourceCounts = {};
    const sourcesByType = {};
    
    alerts.forEach(alert => {
        const source = alert.source || 'Unknown';
        const type = alert.type || 'OTHER';
        
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        
        if (!sourcesByType[source]) {
            sourcesByType[source] = {};
        }
        sourcesByType[source][type] = (sourcesByType[source][type] || 0) + 1;
    });

    const topSources = Object.entries(sourceCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const getSourceIcon = (source) => {
        if (source.includes('Scanner')) return '🔍';
        if (source.includes('detector') || source.includes('Detector')) return '🎯';
        if (source.includes('WAF') || source.includes('Firewall')) return '🛡️';
        if (source.includes('API')) return '📡';
        return '⚠️';
    };

    const getSourceColor = (index) => {
        const colors = [
            'from-red-600 to-red-400',
            'from-orange-600 to-orange-400',
            'from-yellow-600 to-yellow-400',
            'from-blue-600 to-blue-400',
            'from-purple-600 to-purple-400'
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-accent-green/20 p-8">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📍</span>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Threat Sources</h3>
            </div>

            {topSources.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No threat sources detected yet</p>
            ) : (
                <div className="space-y-3">
                    {topSources.map(([source, count], idx) => (
                        <div key={idx} className={`bg-gradient-to-r ${getSourceColor(idx)} p-[1px] rounded-xl`}>
                            <div className="bg-secondary-bg rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-2xl">{getSourceIcon(source)}</span>
                                        <div className="flex-1">
                                            <p className="font-bold text-white">{source}</p>
                                            <p className="text-xs text-gray-400">Detection Source</p>
                                        </div>
                                    </div>
                                    <span className="text-2xl font-black bg-gradient-to-r from-accent-green to-emerald-400 bg-clip-text text-transparent">{count}</span>
                                </div>
                                
                                {/* Threat types from this source */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {Object.entries(sourcesByType[source])
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, 3)
                                        .map(([type, typeCount], typeIdx) => (
                                            <span key={typeIdx} className="text-xs bg-black/30 px-2 py-1 rounded text-gray-300 border border-white/10">
                                                {type}: {typeCount}
                                            </span>
                                        ))}
                                </div>

                                {/* Progress bar */}
                                <div className="mt-3 w-full bg-black/30 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className={`bg-gradient-to-r ${getSourceColor(idx)} h-full`}
                                        style={{ width: `${(count / Math.max(...Object.values(sourceCounts))) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThreatSourceAnalysis;
