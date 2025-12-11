// backend/routes/scanRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { startScan, getScanResults } = require('../controllers/scanController');

router.post('/start', auth, startScan);
router.get('/results/:scanId', auth, getScanResults);

module.exports = router;