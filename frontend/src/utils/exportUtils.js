// Export utility for alerts
export const exportAlertsToCSV = (alerts) => {
    if (!alerts || alerts.length === 0) {
        alert('No alerts to export');
        return;
    }

    // Prepare CSV headers
    const headers = ['Timestamp', 'Type', 'Severity', 'Message', 'Payload', 'Source'];
    
    // Prepare CSV rows
    const rows = alerts.map(alert => [
        new Date(alert.timestamp).toLocaleString(),
        alert.type || 'N/A',
        alert.severity || 'N/A',
        (alert.message || alert.title || 'N/A').replace(/,/g, ';'),
        (alert.payload || 'N/A').substring(0, 100).replace(/,/g, ';'),
        alert.source || 'Unknown'
    ]);

    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `threats-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportAlertsToJSON = (alerts) => {
    if (!alerts || alerts.length === 0) {
        alert('No alerts to export');
        return;
    }

    const jsonContent = JSON.stringify(alerts, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `threats-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
