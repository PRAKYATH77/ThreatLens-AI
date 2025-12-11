import React from 'react';

const AlertStats = ({ alerts }) => {
    const totalAlerts = alerts.length;
    const criticalCount = alerts.filter(a => a.severity === 'Critical').length;
    const highCount = alerts.filter(a => a.severity === 'High').length;
    const mediumCount = alerts.filter(a => a.severity === 'Medium').length;
    const lowCount = alerts.filter(a => a.severity === 'Low').length;

    // Calculate threat trend (last 24h vs before)
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const last24h = alerts.filter(a => new Date(a.timestamp) > oneDayAgo).length;

    const stats = [
        { label: 'Total Threats', value: totalAlerts, icon: '📊', color: 'from-blue-600 to-blue-400' },
        { label: 'Critical', value: criticalCount, icon: '🔴', color: 'from-red-600 to-red-400' },
        { label: 'High', value: highCount, icon: '🟠', color: 'from-orange-600 to-orange-400' },
        { label: 'Last 24h', value: last24h, icon: '📈', color: 'from-accent-green to-emerald-400' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
                <div 
                    key={idx}
                    className={`bg-gradient-to-br ${stat.color} p-[1px] rounded-xl`}
                >
                    <div className="bg-secondary-bg rounded-xl p-4 h-full">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent">{stat.value}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-semibold">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AlertStats;
