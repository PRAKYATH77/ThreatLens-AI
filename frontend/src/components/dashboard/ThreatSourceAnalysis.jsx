// frontend/src/components/dashboard/ThreatSourceAnalysis.jsx
import React from 'react';

const severityColors = {
    Critical: '#FF4560',
    High:     '#FF8C00',
    Medium:   '#FFD60A',
    Low:      '#00FFA3',
};

const typeColors = {
    SQL_INJECTION:    '#FF4560',
    XSS:             '#FF8C00',
    BRUTE_FORCE:     '#FFD60A',
    SUSPICIOUS_IP:   '#00D4FF',
    SCANNER_ACTIVITY:'#00FFA3',
    OTHER:           '#6B7280',
};

// Get a short readable label from a URL
const getUrlLabel = (url) => {
    if (!url || url === 'N/A' || url === 'Unknown') return null;
    try {
        const u = new URL(url);
        return u.hostname + (u.pathname !== '/' ? u.pathname : '');
    } catch {
        return url.length > 40 ? url.substring(0, 40) + '...' : url;
    }
};

// Pick a color based on URL hash for visual distinction
const urlColor = (url) => {
    const colors = ['#00FFA3', '#00D4FF', '#FF8C00', '#FF4560', '#A78BFA', '#F472B6'];
    let hash = 0;
    for (let i = 0; i < url.length; i++) hash = url.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
};

const ThreatSourceAnalysis = ({ alerts }) => {
    // Group by actual target URL
    const urlCounts = {};
    const urlTypes = {};
    const urlSeverities = {};

    alerts.forEach(alert => {
        const rawUrl = alert.threatSource?.targetURL || alert.threatSource?.sourcePath || null;
        const url = rawUrl && rawUrl !== 'N/A' && rawUrl !== 'Unknown' ? rawUrl : null;

        if (!url) return; // skip alerts with no real URL

        const type = alert.type || 'OTHER';
        const severity = alert.severity || 'Low';

        urlCounts[url] = (urlCounts[url] || 0) + 1;

        if (!urlTypes[url]) urlTypes[url] = {};
        urlTypes[url][type] = (urlTypes[url][type] || 0) + 1;

        if (!urlSeverities[url]) urlSeverities[url] = {};
        urlSeverities[url][severity] = (urlSeverities[url][severity] || 0) + 1;
    });

    const topUrls = Object.entries(urlCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6);

    const maxCount = Math.max(...Object.values(urlCounts), 1);

    // Count alerts with no real URL
    const unknownCount = alerts.filter(a => {
        const url = a.threatSource?.targetURL;
        return !url || url === 'N/A' || url === 'Unknown';
    }).length;

    return (
        <div className="glass-card p-6 h-full">
            <div className="section-header mb-5">
                <div className="pulse-dot" />
                <h3 className="text-base font-bold text-text-light tracking-tight">Threat Sources</h3>
                <span className="ml-auto text-xs font-mono text-text-muted">{alerts.length} total events</span>
            </div>

            {topUrls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                    <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    </svg>
                    <p className="text-sm font-medium">No URL sources detected</p>
                    <p className="text-xs mt-1 opacity-60">Run the Proactive Scanner on a URL to see results here</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {topUrls.map(([url, count], idx) => {
                        const color = urlColor(url);
                        const label = getUrlLabel(url);
                        const pct = (count / maxCount) * 100;
                        const types = Object.entries(urlTypes[url] || {}).sort(([,a],[,b]) => b-a);
                        const topSeverity = Object.entries(urlSeverities[url] || {}).sort(([,a],[,b]) => b-a)[0]?.[0];

                        return (
                            <div
                                key={idx}
                                className="rounded-xl p-4 fade-up transition-all duration-200 hover:scale-[1.01] cursor-default"
                                style={{
                                    background: `${color}08`,
                                    border: `1px solid ${color}25`,
                                    animationDelay: `${idx * 0.07}s`,
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Globe icon */}
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                                        </svg>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            {/* URL label */}
                                            <p
                                                className="text-xs font-bold truncate font-mono"
                                                style={{ color }}
                                                title={url}
                                            >
                                                {label || url}
                                            </p>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {topSeverity && (
                                                    <span
                                                        className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                                                        style={{
                                                            color: severityColors[topSeverity],
                                                            background: `${severityColors[topSeverity]}15`,
                                                            border: `1px solid ${severityColors[topSeverity]}30`,
                                                        }}
                                                    >
                                                        {topSeverity}
                                                    </span>
                                                )}
                                                <span className="text-lg font-black tabular-nums" style={{ color }}>
                                                    {count}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Full URL as subtitle */}
                                        <p className="text-[10px] text-text-muted font-mono truncate mb-2" title={url}>
                                            {url}
                                        </p>

                                        {/* Progress bar */}
                                        <div className="h-1 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}` }}
                                            />
                                        </div>

                                        {/* Type badges */}
                                        <div className="flex flex-wrap gap-1">
                                            {types.slice(0, 4).map(([type, tc], ti) => (
                                                <span
                                                    key={ti}
                                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                                    style={{
                                                        color: typeColors[type] || '#6B7280',
                                                        background: `${typeColors[type] || '#6B7280'}12`,
                                                        border: `1px solid ${typeColors[type] || '#6B7280'}25`,
                                                    }}
                                                >
                                                    {type.replace('_', ' ')} · {tc}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Show count of alerts with no real URL */}
                    {unknownCount > 0 && (
                        <div
                            className="rounded-xl p-3 text-center"
                            style={{ background: 'rgba(107,114,128,0.06)', border: '1px solid rgba(107,114,128,0.15)' }}
                        >
                            <p className="text-xs text-text-muted">
                                +{unknownCount} alerts with no tracked URL (simulated data)
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ThreatSourceAnalysis;
