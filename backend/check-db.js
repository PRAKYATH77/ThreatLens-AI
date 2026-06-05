require('dotenv').config();
const axios = require('axios');

const API_BASE = 'http://127.0.0.1:5000/api';

async function testRealScan() {
    // 1. Login
    console.log('🔐 Logging in...');
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
        email: 'browser@test.com',
        password: 'password123'
    });
    const token = loginRes.data.token;
    console.log('✅ Logged in\n');

    // 2. Scan a real URL
    const targetUrl = 'https://example.com';
    console.log(`🔍 Scanning ${targetUrl} ...`);
    const scanRes = await axios.post(`${API_BASE}/scan/start`, { targetUrl }, {
        headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`\n✅ Scan complete! Found ${scanRes.data.issuesFound} vulnerabilities\n`);
    scanRes.data.results.forEach((v, i) => {
        console.log(`  [${i+1}] ${v.title} | ${v.severity} | Category: ${v.category}`);
        console.log(`       Remediation: ${v.remediation}`);
    });

    // 3. Check alerts created
    console.log('\n📊 Checking newly created alerts...');
    const alertsRes = await axios.get(`${API_BASE}/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const recent = alertsRes.data.alerts.slice(0, scanRes.data.issuesFound);
    recent.forEach((a, i) => {
        console.log(`\n  Alert ${i+1}: ${a.message}`);
        console.log(`  Source URL: ${a.threatSource?.targetURL}`);
        console.log(`  Detection: ${a.threatSource?.detectionSource}`);
        console.log(`  Confidence: ${a.analysis?.confidence}%`);
    });

    process.exit(0);
}

testRealScan().catch(err => {
    console.error('Error:', err.response?.data || err.message);
    process.exit(1);
});
