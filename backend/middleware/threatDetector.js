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
        const alertData = {
            type: type,
            severity: (type === 'SQL_INJECTION' || type === 'XSS') ? 'Critical' : 'High',
            message: `Possible ${type} attempt detected in request payload.`,
            ip: req.ip || req.connection.remoteAddress,
            path: req.originalUrl,
            payload: inputString.substring(0, 150), // Truncate for DB safety
        };
        // Save to DB and Broadcast via Socket
        emitAndSaveAlert(alertData, io);
    }
    return detected; 
};

const threatDetector = (req, res, next) => {
    const io = req.app.get('socketio'); // Retrieve Socket.IO instance
    
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