const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const requireManager = require('../middleware/requireManager');
const { createReport, submitReport, getMyReports, getReportById, updateReport, getAllReports, reviewReport } = require('../controllers/reportController');

router.post('/', requireAuth, createReport);
router.patch('/:id/submit', requireAuth, submitReport);
router.get('/my-reports', requireAuth, getMyReports);
router.get('/all', requireAuth, requireManager, getAllReports);
router.get('/:id', requireAuth, getReportById);
router.put('/:id', requireAuth, updateReport);
router.patch('/:id/review', requireAuth, requireManager, reviewReport);

module.exports = router;