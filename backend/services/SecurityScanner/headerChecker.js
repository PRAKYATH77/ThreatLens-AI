// backend/services/SecurityScanner/headerChecker.js
const axios = require('axios');

const checkHeaders = async (targetUrl, scanId) => {
    const results = [];
    
    try {
        // Make a request to the target URL
        const response = await axios.get(targetUrl, { maxRedirects: 0, validateStatus: () => true });
        const headers = response.headers;

        // Define the security headers we want to enforce
        const checks = {
            'content-security-policy': { required: true, severity: 'High', title: 'CSP Missing', description: 'Content Security Policy header is missing, increasing XSS risk.' },
            'x-frame-options': { required: true, severity: 'Medium', title: 'Clickjacking Risk', description: 'X-Frame-Options header is missing.' },
            'strict-transport-security': { required: true, severity: 'High', title: 'HSTS Not Enforced', description: 'Strict-Transport-Security header is missing.' },
            'x-content-type-options': { required: true, severity: 'Low', title: 'MIME Sniffing Risk', description: 'X-Content-Type-Options header is missing.' }
        };

        // Loop through checks
        for (const [header, config] of Object.entries(checks)) {
            // Headers in axios are lowercase
            if (!headers[header]) {
                if (config.required) {
                    results.push({
                        scanId, targetUrl, category: 'HEADER', 
                        severity: config.severity, title: config.title, 
                        description: config.description,
                        remediation: `Configure your server to send the ${header} header.`
                    });
                }
            }
        }
    } catch (error) {
        console.error(`Header Check Error: ${error.message}`);
        results.push({
            scanId, targetUrl, category: 'OTHER', severity: 'Low',
            title: 'Scan Error', description: `Could not access target for header check: ${error.message}`,
            remediation: 'Ensure the URL is correct and accessible.'
        });
    }

    return results;
};

module.exports = { checkHeaders };