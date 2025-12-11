const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Alert = require('../models/Alert');
const { StatusCodes } = require('http-status-codes');

// POST /api/alerts - Create a new alert
router.post('/', auth, async (req, res) => {
    try {
        const { title, severity, description, source, targetUrl, type, ip, path, payload } = req.body;

        // Map title to message and use provided type or default to 'OTHER'
        const alertType = type || 'OTHER';
        const alertMessage = title || description || 'Security Alert';

        if (!alertMessage) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Title or description is required." });
        }

        const newAlert = await Alert.create({
            type: alertType,
            severity: severity || 'High',
            message: alertMessage,
            ip: ip || '0.0.0.0',
            path: path || targetUrl || '/api',
            payload: payload || 'N/A',
            timestamp: new Date()
        });

        // Get Socket.IO instance and emit the alert to all connected clients
        const io = req.app.get('socketio');
        if (io) {
            io.emit('newAlert', newAlert);
        }

        res.status(StatusCodes.CREATED).json({ 
            msg: "Alert created successfully", 
            alert: newAlert 
        });
    } catch (error) {
        console.error("Error creating alert:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to create alert.", error: error.message });
    }
});

// GET /api/alerts - Fetch all alerts
router.get('/', auth, async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ timestamp: -1 });
        res.status(StatusCodes.OK).json({ alerts });
    } catch (error) {
        console.error("Error fetching alerts:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to fetch alerts." });
    }
});

// GET /api/alerts/:id - Fetch single alert
router.get('/:id', auth, async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);
        if (!alert) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "Alert not found." });
        }
        res.status(StatusCodes.OK).json({ alert });
    } catch (error) {
        console.error("Error fetching alert:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to fetch alert." });
    }
});

module.exports = router;

