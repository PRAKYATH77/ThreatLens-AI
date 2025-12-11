// frontend/src/components/dashboard/ThreatCharts.jsx
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ThreatCharts = ({ alerts }) => {
    // 1. Calculate Severity Distribution for Doughnut Chart
    const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    alerts.forEach(a => {
        if (severityCounts[a.severity]) severityCounts[a.severity]++;
    });

    const doughnutData = {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [
            {
                data: [severityCounts.Critical, severityCounts.High, severityCounts.Medium, severityCounts.Low],
                backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'], // Red, Yellow, Blue, Green
                borderWidth: 0,
            },
        ],
    };

    // 2. Calculate Attack Types for Bar Chart
    const typeCounts = {};
    alerts.forEach(a => {
        typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
    });

    const barData = {
        labels: Object.keys(typeCounts),
        datasets: [
            {
                label: 'Incident Count',
                data: Object.values(typeCounts),
                backgroundColor: '#10B981',
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#E2E8F0' } },
            title: { display: false },
        },
        scales: {
            y: { ticks: { color: '#94A3B8' }, grid: { color: '#334155' } },
            x: { ticks: { color: '#94A3B8' }, grid: { display: false } },
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Severity Distribution Chart */}
            <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/40 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-accent-green/20 hover:shadow-2xl hover:shadow-accent-green/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">📊</span>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Severity Distribution</h3>
                </div>
                <div className="w-full h-64 relative">
                   <Doughnut 
                       data={doughnutData} 
                       options={{ 
                           responsive: true,
                           maintainAspectRatio: false,
                           plugins: { 
                               legend: { 
                                   position: 'bottom', 
                                   labels: { 
                                       color: '#E2E8F0',
                                       font: { size: 12, weight: 'bold' },
                                       padding: 15,
                                       usePointStyle: true
                                   } 
                               } 
                           } 
                       }} 
                   />
                </div>
                <div className="mt-6 grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-red-900/20 rounded-lg border border-red-500/30"><span className="font-bold text-red-400">{severityCounts.Critical}</span><p className="text-gray-400 text-xs">Critical</p></div>
                    <div className="p-2 bg-orange-900/20 rounded-lg border border-orange-500/30"><span className="font-bold text-orange-400">{severityCounts.High}</span><p className="text-gray-400 text-xs">High</p></div>
                    <div className="p-2 bg-blue-900/20 rounded-lg border border-blue-500/30"><span className="font-bold text-blue-400">{severityCounts.Medium}</span><p className="text-gray-400 text-xs">Medium</p></div>
                    <div className="p-2 bg-green-900/20 rounded-lg border border-green-500/30"><span className="font-bold text-green-400">{severityCounts.Low}</span><p className="text-gray-400 text-xs">Low</p></div>
                </div>
            </div>

            {/* Attack Types Chart */}
            <div className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/40 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-accent-green/20 hover:shadow-2xl hover:shadow-accent-green/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🎯</span>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Attack Types</h3>
                </div>
                <div className="h-64 relative">
                    <Bar 
                        data={barData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { 
                                    display: false,
                                    labels: { color: '#E2E8F0', font: { size: 12 } } 
                                },
                                title: { display: false },
                            },
                            scales: {
                                y: { 
                                    ticks: { color: '#94A3B8', font: { size: 11 } }, 
                                    grid: { color: '#334155', drawBorder: false } 
                                },
                                x: { 
                                    ticks: { color: '#94A3B8', font: { size: 11 } }, 
                                    grid: { display: false, drawBorder: false } 
                                },
                            }
                        }} 
                    />
                </div>
                <div className="mt-4 text-xs text-gray-400 text-center">
                    <p>Total: <span className="font-bold text-accent-green">{Object.values(typeCounts).reduce((a, b) => a + b, 0)}</span> incidents detected</p>
                </div>
            </div>
        </div>
    );
};

export default ThreatCharts;