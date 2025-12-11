// backend/controllers/scanController.js
const { v4: uuidv4 } = require('uuid');
const Vulnerability = require('../models/Vulnerability');
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

        // Save results to DB
        if (allResults.length > 0) {
            await Vulnerability.insertMany(allResults);
        }

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