const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['SQL_INJECTION', 'XSS', 'BRUTE_FORCE', 'SUSPICIOUS_IP', 'SCANNER_ACTIVITY', 'OTHER'],
        required: true,
    },
    severity: {
        type: String,
        enum: ['Critical', 'High', 'Medium', 'Low'],
        default: 'Medium',
    },
    message: { type: String, required: true },
    ip: { type: String, required: true },
    path: { type: String, required: true },
    payload: { type: String, default: 'N/A' },
    timestamp: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Active', 'Resolved', 'Ignored'],
        default: 'Active',
    },
    // Threat Source Information
    threatSource: {
        detectionSource: {
            type: String,
            enum: ['Security Scanner', 'Threat Detector', 'Firewall', 'API Monitor', 'Unknown'],
            default: 'Unknown',
        },
        sourceIP: { type: String, default: 'Unknown' },
        sourcePath: { type: String, default: 'N/A' },
        targetURL: { type: String, default: 'N/A' },
        sourceCountry: { type: String, default: 'N/A' },
        sourceReputation: {
            type: String,
            enum: ['Malicious', 'Suspicious', 'Unknown', 'Clean'],
            default: 'Unknown',
        },
    },
    // Threat Analysis
    analysis: {
        aiAnalysis: { type: String, default: 'N/A' },
        attackVector: { type: String, default: 'N/A' },
        confidence: { type: Number, min: 0, max: 100, default: 0 },
        recommendations: [String],
    }
});

module.exports = mongoose.model('Alert', AlertSchema);