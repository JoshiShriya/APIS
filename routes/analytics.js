const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const firestoreAnalyticsController = require('../controllers/firestoreAnalyticsController');
const mysqlAnalyticsController = require('../controllers/mysqlAnalyticsController');

// MongoDB Analytics Routes
router.get('/mongodb/engagement', analyticsController.getPostEngagement);
router.get('/mongodb/brand-voice', analyticsController.getBrandVoiceAnalysis);

// Firestore Analytics Routes
router.get('/firestore/engagement', firestoreAnalyticsController.getPostEngagement);
router.get('/firestore/api-performance', firestoreAnalyticsController.getApiPerformance);

// MySQL Analytics Routes
router.get('/mysql/tenant-activity', mysqlAnalyticsController.getTenantActivity);
router.get('/mysql/api-dashboard', mysqlAnalyticsController.getApiPerformanceDashboard);
router.get('/mysql/tenant-health', mysqlAnalyticsController.getTenantHealthScores);

module.exports = router;