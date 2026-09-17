const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/summary', getDashboardSummary);

module.exports = router;
