const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth'); 
const { getIncidentAnalysis } = require('../controllers/aiController');

router.get('/analyze/:id', auth, getIncidentAnalysis);

module.exports = router;