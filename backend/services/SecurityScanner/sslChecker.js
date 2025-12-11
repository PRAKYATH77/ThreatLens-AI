// backend/services/SecurityScanner/sslChecker.js
const tls = require('tls');
const url = require('url');

const checkSSL = (targetUrl, scanId) => {
    return new Promise(resolve => {
        const results = [];
        try {
            const urlParts = url.parse(targetUrl);
            
            // 1. Basic Protocol Check
            if (urlParts.protocol !== 'https:') {
                results.push({
                    scanId, targetUrl, category: 'TLS/SSL', severity: 'High',
                    title: 'Not Using HTTPS', description: 'Target is not using a secure HTTPS connection.',
                    remediation: 'Enforce HTTPS on your server.'
                });
                return resolve(results);
            }

            const options = { 
                host: urlParts.hostname, 
                port: 443, 
                rejectUnauthorized: false // Allow inspecting invalid certs without crashing
            };

            const socket = tls.connect(options, () => {
                const cert = socket.getPeerCertificate();
                const authorized = socket.authorized;
                socket.end();

                if (!cert || Object.keys(cert).length === 0) {
                     results.push({
                        scanId, targetUrl, category: 'TLS/SSL', severity: 'Critical',
                        title: 'No Certificate', description: 'No SSL certificate found.',
                        remediation: 'Install a valid SSL certificate.'
                    });
                } else {
                    // 2. Validity Check
                    if (!authorized) {
                         results.push({
                            scanId, targetUrl, category: 'TLS/SSL', severity: 'High',
                            title: 'Invalid Certificate', description: `Certificate is invalid. Reason: ${socket.authorizationError}`,
                            remediation: 'Renew or replace the SSL certificate.'
                        });
                    }
                    // 3. Expiration Check
                    const validTo = new Date(cert.valid_to);
                    if (validTo < new Date()) {
                        results.push({
                            scanId, targetUrl, category: 'TLS/SSL', severity: 'High',
                            title: 'Certificate Expired', description: `Certificate expired on ${validTo}.`,
                            remediation: 'Renew the certificate immediately.'
                        });
                    }
                }
                resolve(results);
            });

            socket.on('error', (err) => {
                results.push({
                    scanId, targetUrl, category: 'TLS/SSL', severity: 'Medium',
                    title: 'SSL Connection Failed', description: err.message,
                    remediation: 'Check server SSL configuration.'
                });
                resolve(results);
            });

        } catch (err) {
            resolve([]);
        }
    });
};

module.exports = { checkSSL };