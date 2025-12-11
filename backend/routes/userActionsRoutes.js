const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { StatusCodes } = require('http-status-codes');

// POST /api/actions/protected-data
router.post('/protected-data', auth, (req, res) => {
    // Note: Threat Detector runs BEFORE this automatically via server.js
    res.status(StatusCodes.OK).json({ msg: `Request inspected and accepted.` });
});

module.exports = router;