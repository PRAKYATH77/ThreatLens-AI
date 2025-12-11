const express = require('express');
const axios = require('axios');

const router = express.Router();
const API_BASE = 'http://127.0.0.1:5000/api';

/**
 * Vulnerability Testing Routes
 * These endpoints simulate real security vulnerabilities and trigger alerts
 */

// Test token for authentication
let TEST_TOKEN = null;

// ============================================================================
// 1. SQL INJECTION TEST ENDPOINT
// ============================================================================
router.post('/test/sql-injection', async (req, res) => {
    try {
        const { payload = "' OR '1'='1" } = req.body;
        
        // Trigger alert
        const alert = await createAlert({
            type: 'SQL_INJECTION',
            severity: 'Critical',
            message: 'SQL Injection attack detected - malicious payload in query',
            payload: payload,
            threatSource: {
                detectionSource: 'Security Scanner',
                sourceIP: req.ip || '127.0.0.1',
                sourcePath: '/api/test/sql-injection',
                targetURL: 'http://127.0.0.1:5000/api/vulnerable/query',
                sourceReputation: 'Malicious',
            },
            analysis: {
                attackVector: 'Direct SQL query manipulation via input field',
                confidence: 98,
                aiAnalysis: 'High-confidence SQL injection attack. Payload structure indicates automated scanner or manual pen test.',
                recommendations: [
                    'Use parameterized queries immediately',
                    'Implement input validation and sanitization',
                    'Deploy WAF with SQL injection rules',
                    'Review all query building code'
                ]
            }
        });

        res.json({
            success: true,
            message: '🔴 SQL Injection alert triggered',
            alert: alert,
            tips: [
                '✓ Use parameterized queries: db.query("SELECT * FROM users WHERE id = ?", [userId])',
                '✓ Use ORM frameworks like Sequelize, TypeORM, or Mongoose',
                '✓ Never concatenate user input into SQL strings',
                '✓ Implement input validation and whitelisting'
            ]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// 2. XSS (CROSS-SITE SCRIPTING) TEST ENDPOINT
// ============================================================================
router.post('/test/xss', async (req, res) => {
    try {
        const { payload = '<img src=x onerror="alert(\'XSS\')">' } = req.body;
        
        const alert = await createAlert({
            type: 'XSS',
            severity: 'High',
            message: 'Cross-Site Scripting vulnerability detected',
            payload: payload,
            threatSource: {
                detectionSource: 'Threat Detector',
                sourceIP: req.ip || '127.0.0.1',
                sourcePath: '/search?q=payload',
                targetURL: 'http://127.0.0.1:5000/dashboard',
                sourceCountry: 'Unknown',
                sourceReputation: 'Suspicious',
            },
            analysis: {
                attackVector: 'DOM-based XSS via unsanitized user input',
                confidence: 92,
                aiAnalysis: 'Reflected XSS vulnerability allowing script injection. Payload will execute in user browser context.',
                recommendations: [
                    'Sanitize all user input before rendering',
                    'Use DOMPurify library for HTML sanitization',
                    'Implement Content Security Policy (CSP)',
                    'Encode output based on context (HTML, JS, URL)',
                    'Use templating engines with auto-escaping'
                ]
            }
        });

        res.json({
            success: true,
            message: '🔴 XSS alert triggered',
            alert: alert,
            tips: [
                '✓ React auto-escapes by default: <div>{userInput}</div> is safe',
                '✓ Never use dangerouslySetInnerHTML with user content',
                '✓ Install DOMPurify: npm install dompurify',
                '✓ Add CSP header: Content-Security-Policy: script-src \'self\'',
                '✓ Always validate and sanitize on both client and server'
            ]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// 3. BRUTE FORCE ATTACK SIMULATOR
// ============================================================================
router.post('/test/brute-force', async (req, res) => {
    try {
        const { attempts = 50 } = req.body;
        
        const failedAttempts = [];
        for (let i = 0; i < attempts; i++) {
            failedAttempts.push(`Failed login attempt ${i + 1}: Invalid credentials`);
        }

        const alert = await createAlert({
            type: 'BRUTE_FORCE',
            severity: 'High',
            message: `Brute force attack detected - ${attempts} failed login attempts in rapid succession`,
            payload: failedAttempts.join('\n'),
            threatSource: {
                detectionSource: 'API Monitor',
                sourceIP: req.ip || '127.0.0.1',
                sourcePath: '/api/auth/login',
                targetURL: 'http://127.0.0.1:5000/login',
                sourceCountry: 'Unknown',
                sourceReputation: 'Malicious',
            },
            analysis: {
                attackVector: 'Automated credential guessing attack',
                confidence: 95,
                aiAnalysis: `Detected ${attempts} failed authentication attempts from single IP in short timeframe. Behavior matches known brute-force attack patterns.`,
                recommendations: [
                    `Implement rate limiting: max 5 attempts per 15 minutes per IP`,
                    'Lock account after 5 failed attempts for 30 minutes',
                    'Enable CAPTCHA after 3 failed attempts',
                    'Implement 2FA/MFA for all accounts',
                    'Monitor for distributed attacks from multiple IPs'
                ]
            }
        });

        res.json({
            success: true,
            message: `🔴 Brute force alert triggered (${attempts} attempts)`,
            alert: alert,
            tips: [
                '✓ Use rate limiting middleware: npm install express-rate-limit',
                '✓ Implement exponential backoff: 1s, 2s, 4s, 8s delays',
                '✓ Use bcrypt for password hashing with salt rounds',
                '✓ Implement account lockout after N failed attempts',
                '✓ Send security alerts on suspicious activity'
            ]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// 4. SUSPICIOUS IP/RECONNAISSANCE DETECTION
// ============================================================================
router.post('/test/reconnaissance', async (req, res) => {
    try {
        const { endpoint_count = 25 } = req.body;
        
        const scanPattern = [];
        for (let i = 0; i < endpoint_count; i++) {
            scanPattern.push(`GET /api/admin/endpoint-${i}`);
        }

        const alert = await createAlert({
            type: 'SUSPICIOUS_IP',
            severity: 'Medium',
            message: 'Reconnaissance activity detected - systematic endpoint enumeration',
            payload: scanPattern.join('\n'),
            threatSource: {
                detectionSource: 'Firewall',
                sourceIP: req.ip || '127.0.0.1',
                sourcePath: '/api/admin',
                targetURL: 'http://127.0.0.1:5000/admin',
                sourceCountry: 'Unknown',
                sourceReputation: 'Suspicious',
            },
            analysis: {
                attackVector: 'Automated endpoint discovery and API enumeration',
                confidence: 88,
                aiAnalysis: 'Systematic scanning of admin endpoints suggests pre-attack reconnaissance. Behavior indicates automated security assessment tool.',
                recommendations: [
                    'Review who has access to /admin endpoints',
                    'Implement IP whitelisting for sensitive endpoints',
                    'Block IPs showing systematic scanning behavior',
                    'Add additional authentication layers for admin',
                    'Monitor and log all admin endpoint access'
                ]
            }
        });

        res.json({
            success: true,
            message: `🔴 Reconnaissance alert triggered (${endpoint_count} endpoints scanned)`,
            alert: alert,
            tips: [
                '✓ Protect admin endpoints: require admin role + IP whitelist',
                '✓ Use middleware to detect and block scanners',
                '✓ Implement CORS to restrict API access',
                '✓ Disable directory listing and error details',
                '✓ Use Web Application Firewall (WAF) for automated blocking'
            ]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// 5. SCANNER DETECTION - SIMULATING NMAP/VULNERABILITY SCANNER
// ============================================================================
router.post('/test/scanner', async (req, res) => {
    try {
        const scanResults = [
            'Open Port: 5000 (Node.js)',
            'Open Port: 27017 (MongoDB)',
            'Service: Express.js detected',
            'Potential vulnerabilities: Missing security headers'
        ];

        const alert = await createAlert({
            type: 'SCANNER_ACTIVITY',
            severity: 'Medium',
            message: 'Automated vulnerability scanner detected on network',
            payload: scanResults.join('\n'),
            threatSource: {
                detectionSource: 'Firewall',
                sourceIP: req.ip || '127.0.0.1',
                sourcePath: '/api',
                targetURL: 'http://127.0.0.1:5000',
                sourceReputation: 'Unknown',
            },
            analysis: {
                attackVector: 'Port scanning and service enumeration (Nmap-style)',
                confidence: 87,
                aiAnalysis: 'Detected systematic port and service scanning. Behavior matches Nmap, OpenVAS, or similar vulnerability assessment tools.',
                recommendations: [
                    'Implement firewall rules to block suspicious scan patterns',
                    'Harden service exposure - only expose necessary ports',
                    'Disable service version banners in responses',
                    'Implement honeypots to detect and track scanners',
                    'Monitor for repeated scanning from same IP'
                ]
            }
        });

        res.json({
            success: true,
            message: '🔴 Scanner activity alert triggered',
            alert: alert,
            tips: [
                '✓ Remove version info from HTTP headers',
                '✓ Disable unnecessary services on network',
                '✓ Use firewall to restrict port access',
                '✓ Implement intrusion detection system (IDS)',
                '✓ Regular security audits to find vulnerabilities first'
            ]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// 6. DATA EXFILTRATION ATTEMPT
// ============================================================================
router.post('/test/data-exfiltration', async (req, res) => {
    try {
        const { file_size_mb = 500 } = req.body;
        
        const alert = await createAlert({
            type: 'OTHER',
            severity: 'High',
            message: 'Potential data exfiltration detected - unusual large data transfer',
            payload: `Large file download request: ${file_size_mb}MB at unusual hours`,
            threatSource: {
                detectionSource: 'API Monitor',
                sourceIP: req.ip || '127.0.0.1',
                sourcePath: '/api/data/export',
                targetURL: 'http://127.0.0.1:5000/api/data/export',
                sourceCountry: 'Unknown',
                sourceReputation: 'Suspicious',
            },
            analysis: {
                attackVector: 'Bulk data download and exfiltration',
                confidence: 79,
                aiAnalysis: `Detected unusual large data transfer (${file_size_mb}MB). Download pattern suggests potential insider threat or account compromise.`,
                recommendations: [
                    'Review recent access logs and data downloads',
                    'Implement data loss prevention (DLP) tools',
                    'Rate limit large file downloads',
                    'Require multi-factor approval for bulk exports',
                    'Monitor and alert on unusual data access patterns'
                ]
            }
        });

        res.json({
            success: true,
            message: '🔴 Data exfiltration alert triggered',
            alert: alert,
            tips: [
                '✓ Limit export file sizes and frequency',
                '✓ Require authorization for bulk data access',
                '✓ Log all data access and export activity',
                '✓ Implement DLP to detect sensitive data transfers',
                '✓ Monitor outbound network traffic for anomalies'
            ]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// HELPER FUNCTION: Create Alert
// ============================================================================
async function createAlert(alertData) {
    try {
        // Get token if not already obtained
        if (!TEST_TOKEN) {
            const loginRes = await axios.post(`${API_BASE}/auth/login`, {
                email: 'browser@test.com',
                password: 'loginpassword123'
            });
            TEST_TOKEN = loginRes.data.token;
        }

        // Create alert
        const response = await axios.post(`${API_BASE}/alerts`, alertData, {
            headers: {
                'Authorization': `Bearer ${TEST_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error creating alert:', error.message);
        throw error;
    }
}

module.exports = router;
