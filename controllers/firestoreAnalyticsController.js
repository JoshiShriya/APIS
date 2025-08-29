const firestoreAnalyticsService = require('../services/firestoreAnalyticsService');
const firestoreAnalyticsController = {
  getPostEngagement: async (req, res) => {
    try {
      const { tenantId, startDate, endDate } = req.query;
      const data = await firestoreAnalyticsService.getPostEngagement(tenantId, startDate, endDate);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  getApiPerformance: async (req, res) => {
    try {
      const { integrationName, hours } = req.query;
      const data = await firestoreAnalyticsService.getApiPerformance(integrationName, parseInt(hours) || 24);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
module.exports = firestoreAnalyticsController;