// frontend/src/components/dashboard/AlertStats.jsx
import React from 'react';

const statConfig = [
    {
        label: 'Total Threats',
        key: 'total',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
        ),
        color: '#00D4FF',
        bg: 'rgba(0,212,255,0.08)',
        border: 'rgba(0,212,255,0.2)',
    },
    {
        label: 'Critical',
        key: 'critical',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
        ),
        color: '#FF4560',
        bg: 'rgba(255,69,96,0.08)',
        border: 'rgba(255,69,96,0.2)',
    },
    {
        label: 'High Severity',
        key: 'high',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
        ),
        color: '#FF8C00',
        bg: 'rgba(255,140,0,0.08)',
        border: 'rgba(255,140,0,0.2)',
    },
    {
        label: 'Last 24 Hours',
        key: 'last24h',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        ),
        color: '#00FFA3',
        bg: 'rgba(0,255,163,0.08)',
        border: 'rgba(0,255,163,0.2)',
    },
];

const AlertStats = ({ alerts }) => {
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

    const values = {
        total:   alerts.length,
        critical: alerts.filter(a => a.severity === 'Critical').length,
        high:    alerts.filter(a => a.severity === 'High').length,
        last24h: alerts.filter(a => new Date(a.timestamp) > oneDayAgo).length,
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statConfig.map((stat, idx) => (
                <div
                    key={idx}
                    className="metric-card fade-up"
                    style={{ animationDelay: `${idx * 0.08}s`, borderColor: stat.border }}
                >
                    {/* Top accent line override */}
                    <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: `linear-gradient(90deg, transparent, ${stat.color}60, transparent)` }}
                    />

                    <div className="flex items-start justify-between mb-4">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: stat.bg, color: stat.color, border: `1px solid ${stat.border}` }}
                        >
                            {stat.icon}
                        </div>
                        <div
                            className="text-3xl font-black tabular-nums"
                            style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}40` }}
                        >
                            {values[stat.key]}
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{stat.label}</p>

                    {/* Bottom progress bar */}
                    <div className="mt-3 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                                width: values.total > 0 ? `${(values[stat.key] / values.total) * 100}%` : '0%',
                                background: stat.color,
                                boxShadow: `0 0 8px ${stat.color}`,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AlertStats;
