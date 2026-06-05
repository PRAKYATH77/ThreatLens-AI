const { emitAndSaveAlert } = require('../services/ThreatDetectionEngine/alertEmitter');
const signatureRules = require('../services/ThreatDetectionEngine/signatureRules');

const checkInputForThreats = (data, io, req) => {
    let detected = false;
    let type = 'OTHER';
    let inputString = '';

    try {
        inputString = JSON.stringify(data).toLowerCase();
    } catch (e) {
        inputString = String(data).toLowerCase();
    }
    
    // SQL Injection Check
    signatureRules.SQL_INJECTION.forEach(regex => {
        if (regex.test(inputString)) {
            detected = true;
            type = 'SQL_INJECTION';
        }
    });

    // XSS Check (Only if not already detected)
    if (!detected) {
        signatureRules.XSS.forEach(regex => {
            if (regex.test(inputString)) {
                detected = true;
                type = 'XSS';
            }
        });
    }

    if (detected) {
        const clientIP = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || '0.0.0.0';
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

        const alertData = {
            type: type,
            severity: (type === 'SQL_INJECTION' || type === 'XSS') ? 'Critical' : 'High',
            message: `${type.replace('_', ' ')} attempt detected from ${clientIP} on ${req.originalUrl}`,
            ip: clientIP,
            path: req.originalUrl,
            payload: inputString.substring(0, 300),
            threatSource: {
                detectionSource: 'Threat Detector',
                sourceIP: clientIP,
                sourcePath: req.originalUrl,
                targetURL: fullUrl,
                sourceCountry: 'N/A',
                sourceReputation: 'Malicious',
            },
            analysis: {
                attackVector: `${type} via ${req.method} request to ${req.originalUrl}`,
                confidence: type === 'SQL_INJECTION' ? 95 : 88,
                aiAnalysis: `Real-time threat detector identified a ${type.replace('_', ' ').toLowerCase()} pattern in the incoming ${req.method} request to ${req.originalUrl}. Source IP: ${clientIP}. The payload matched known attack signatures.`,
                recommendations: type === 'SQL_INJECTION' 
                    ? ['Use parameterized queries', 'Validate all user input', 'Enable WAF rules', 'Review database permissions']
                    : ['Sanitize user input', 'Implement Content Security Policy', 'Use output encoding', 'Regular security audits'],
            },
        };
        emitAndSaveAlert(alertData, io);
    }
    return detected; 
};

const threatDetector = (req, res, next) => {
    const io = req.app.get('socketio');
    
    // Check Query Params
    checkInputForThreats(req.query, io, req);
    
    // Check Body
    if (Object.keys(req.body || {}).length > 0) {
        checkInputForThreats(req.body, io, req);
    }
    
    // Check Path Params
    checkInputForThreats(req.params, io, req);

    next();
};

module.exports = threatDetector;