const axios = require('axios');

const API_BASE = 'http://127.0.0.1:5000/api';

// Test user credentials
const TEST_EMAIL = 'browser@test.com';
const TEST_PASSWORD = 'loginpassword123';

const threatTemplates = [
    {
        type: 'SQL_INJECTION',
        severity: 'Critical',
        message: 'SQL Injection attempt detected in login form',
        payload: "' OR '1'='1' -- DROP TABLE users;",
        threatSource: {
            detectionSource: 'Security Scanner',
            sourceIP: '192.168.1.105',
            sourcePath: '/api/auth/login',
            targetURL: 'https://threatLens.local/auth/login',
            sourceCountry: 'Unknown',
            sourceReputation: 'Malicious',
        },
        analysis: {
            attackVector: 'Direct SQL query manipulation',
            confidence: 98,
            aiAnalysis: 'High-confidence SQL injection attack targeting authentication endpoint. Payload structure suggests automated scanner.',
            recommendations: [
                'Implement parameterized queries',
                'Use ORM frameworks',
                'Enable WAF rules for SQL injection',
                'Review input validation'
            ]
        }
    },
    {
        type: 'XSS',
        severity: 'High',
        message: 'Cross-Site Scripting vulnerability detected',
        payload: '<img src=x onerror="alert(\'XSS\')">',
        threatSource: {
            detectionSource: 'Threat Detector',
            sourceIP: '10.0.0.42',
            sourcePath: '/search',
            targetURL: 'https://threatLens.local/dashboard?q=payload',
            sourceCountry: 'US',
            sourceReputation: 'Suspicious',
        },
        analysis: {
            attackVector: 'DOM-based XSS via search parameter',
            confidence: 85,
            aiAnalysis: 'Detected reflected XSS vulnerability in search functionality. Payload indicates user-controlled input not properly sanitized.',
            recommendations: [
                'Sanitize user input on both client and server',
                'Implement Content Security Policy (CSP)',
                'Use DOMPurify library for HTML sanitization',
                'Regular security audits'
            ]
        }
    },
    {
        type: 'BRUTE_FORCE',
        severity: 'High',
        message: 'Brute force attack on login endpoint detected',
        payload: 'Failed login attempts: 142 in 5 minutes',
        threatSource: {
            detectionSource: 'API Monitor',
            sourceIP: '203.0.113.45',
            sourcePath: '/api/auth/login',
            targetURL: 'https://threatLens.local/login',
            sourceCountry: 'CN',
            sourceReputation: 'Malicious',
        },
        analysis: {
            attackVector: 'Distributed brute force attack',
            confidence: 92,
            aiAnalysis: 'Multiple failed authentication attempts from single IP detected. Pattern matches known brute-force toolkits.',
            recommendations: [
                'Implement rate limiting on login endpoint',
                'Enable account lockout after failed attempts',
                'Deploy CAPTCHA verification',
                'Monitor for distributed attacks'
            ]
        }
    },
    {
        type: 'SUSPICIOUS_IP',
        severity: 'Medium',
        message: 'Suspicious IP address accessing sensitive endpoints',
        payload: 'Accessed /api/admin endpoints 23 times',
        threatSource: {
            detectionSource: 'Firewall',
            sourceIP: '198.51.100.89',
            sourcePath: '/api/admin/users',
            targetURL: 'https://threatLens.local/admin',
            sourceCountry: 'RU',
            sourceReputation: 'Suspicious',
        },
        analysis: {
            attackVector: 'Reconnaissance and enumeration',
            confidence: 72,
            aiAnalysis: 'IP address attempting to enumerate admin endpoints. Behavior suggests automated reconnaissance.',
            recommendations: [
                'Whitelist admin IPs only',
                'Enable IP-based access controls',
                'Monitor admin endpoint access',
                'Implement additional authentication'
            ]
        }
    },
    {
        type: 'SCANNER_ACTIVITY',
        severity: 'Medium',
        message: 'Automated scanner detected on network',
        payload: 'Nmap scan detected: Service enumeration',
        threatSource: {
            detectionSource: 'Firewall',
            sourceIP: '192.0.2.55',
            sourcePath: '/api',
            targetURL: 'https://threatLens.local',
            sourceCountry: 'Unknown',
            sourceReputation: 'Unknown',
        },
        analysis: {
            attackVector: 'Port and service scanning',
            confidence: 88,
            aiAnalysis: 'Detected Nmap-style network scanning activity. Systematic port enumeration suggests pre-attack reconnaissance.',
            recommendations: [
                'Block scanning IPs at firewall',
                'Implement honeypots',
                'Monitor for service enumeration',
                'Harden service exposure'
            ]
        }
    },
    {
        type: 'OTHER',
        severity: 'Low',
        message: 'Unusual request pattern detected',
        payload: 'Multiple large file requests in short time',
        threatSource: {
            detectionSource: 'API Monitor',
            sourceIP: '192.168.1.200',
            sourcePath: '/api/data/export',
            targetURL: 'https://threatLens.local/api/data/export',
            sourceCountry: 'US',
            sourceReputation: 'Unknown',
        },
        analysis: {
            attackVector: 'Potential data exfiltration attempt',
            confidence: 45,
            aiAnalysis: 'Unusual pattern of large data requests. Could indicate data scraping or exfiltration attempt.',
            recommendations: [
                'Rate limit large file downloads',
                'Monitor data export activity',
                'Implement user activity logging',
                'Review access patterns'
            ]
        }
    }
];

async function createAdvancedAlerts() {
    try {
        // 1. Login and get token
        console.log('🔐 Authenticating...');
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: TEST_EMAIL,
            password: TEST_PASSWORD
        });
        const token = loginRes.data.token;
        console.log('✅ Authenticated successfully\n');

        // 2. Create advanced alerts
        console.log('📊 Creating advanced alerts with detailed threat source data...\n');
        
        for (let i = 0; i < threatTemplates.length; i++) {
            const template = threatTemplates[i];
            try {
                const alertRes = await axios.post(
                    `${API_BASE}/alerts`,
                    {
                        type: template.type,
                        severity: template.severity,
                        message: template.message,
                        ip: template.threatSource.sourceIP,
                        path: template.threatSource.sourcePath,
                        payload: template.payload,
                        threatSource: template.threatSource,
                        analysis: template.analysis
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log(`✅ Created alert ${i + 1}/6: ${template.type}`);
                console.log(`   Severity: ${template.severity}`);
                console.log(`   Source IP: ${template.threatSource.sourceIP}`);
                console.log(`   Detection Source: ${template.threatSource.detectionSource}`);
                console.log(`   Confidence: ${template.analysis.confidence}%\n`);
            } catch (error) {
                console.error(`❌ Failed to create alert ${i + 1}:`, error.response?.data || error.message);
            }
        }

        console.log('🎉 Advanced alerts created successfully!');
        console.log('\n📝 Features demonstrated:');
        console.log('   ✓ Threat Source tracking (Detection Source, Source IP, Target URL)');
        console.log('   ✓ Source Reputation scoring');
        console.log('   ✓ AI Analysis with confidence levels');
        console.log('   ✓ Attack Vector identification');
        console.log('   ✓ Recommendations for remediation');
        console.log('\n🔍 Click on any alert in the dashboard to see full threat details!');

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        process.exit(1);
    }
}

createAdvancedAlerts();
