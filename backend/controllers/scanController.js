// backend/controllers/scanController.js
const { v4: uuidv4 } = require('uuid');
const Vulnerability = require('../models/Vulnerability');
const Alert = require('../models/Alert');
const { checkHeaders } = require('../services/SecurityScanner/headerChecker');
const { checkSSL } = require('../services/SecurityScanner/sslChecker');
const { StatusCodes } = require('http-status-codes');

const startScan = async (req, res) => {
    const { targetUrl } = req.body;
    if (!targetUrl) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Target URL is required." });
    }

    const scanId = uuidv4();
    console.log(`[SCANNER] Starting scan ${scanId} for ${targetUrl}`);

    try {
        // Run scans in parallel for speed
        const [headerResults, sslResults] = await Promise.all([
            checkHeaders(targetUrl, scanId),
            checkSSL(targetUrl, scanId)
        ]);

        const allResults = [...headerResults, ...sslResults];

        // Save vulnerabilities to DB
        if (allResults.length > 0) {
            await Vulnerability.insertMany(allResults);
        }

        // Also create real alerts for each vulnerability found
        const io = req.app.get('socketio');
        for (const vuln of allResults) {
            try {
                const newAlert = await Alert.create({
                    type: vuln.category === 'HEADER' ? 'SCANNER_ACTIVITY' : 'OTHER',
                    severity: vuln.severity === 'High' ? 'High' : vuln.severity === 'Critical' ? 'Critical' : 'Medium',
                    message: `${vuln.title} — found on ${targetUrl}`,
                    ip: '0.0.0.0',
                    path: targetUrl,
                    payload: `${vuln.description} | Remediation: ${vuln.remediation}`,
                    threatSource: {
                        detectionSource: 'Security Scanner',
                        sourceIP: 'N/A (outbound scan)',
                        sourcePath: targetUrl,
                        targetURL: targetUrl,
                        sourceCountry: 'N/A',
                        sourceReputation: vuln.severity === 'High' || vuln.severity === 'Critical' ? 'Suspicious' : 'Unknown',
                    },
                    analysis: {
                        attackVector: `Missing security header/config on ${targetUrl}`,
                        confidence: vuln.severity === 'High' ? 90 : vuln.severity === 'Critical' ? 95 : 75,
                        aiAnalysis: `Proactive scan of ${targetUrl} detected: ${vuln.title}. ${vuln.description}. This is a real finding from an HTTP header/TLS analysis of the target server.`,
                        recommendations: [
                            vuln.remediation,
                            'Run periodic scans to verify fixes',
                            'Implement security headers in server config',
                        ],
                    },
                });

                if (io) {
                    io.emit('newAlert', newAlert);
                }
            } catch (alertErr) {
                console.error('[SCANNER] Error creating alert:', alertErr.message);
            }
        }

        console.log(`[SCANNER] Scan ${scanId} complete: ${allResults.length} issues found for ${targetUrl}`);

        res.status(StatusCodes.OK).json({
            msg: "Scan complete",
            scanId: scanId,
            issuesFound: allResults.length,
            results: allResults
        });

    } catch (error) {
        console.error("Scanner Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Scan failed." });
    }
};

const getScanResults = async (req, res) => {
    const { scanId } = req.params;
    try {
        const results = await Vulnerability.find({ scanId });
        res.status(StatusCodes.OK).json({ scanId, vulnerabilities: results });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Error fetching results." });
    }
};

module.exports = { startScan, getScanResults };