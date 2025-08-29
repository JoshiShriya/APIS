const mysqlAnalyticsService = require('../services/mysqlAnalyticsService');
const mysqlAnalyticsController = {
  getTenantActivity: async (req, res) => {
    try {
      const { tenantId, days } = req.query;
      const data = await mysqlAnalyticsService.getTenantActivity(tenantId, parseInt(days) || 30);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  getApiPerformanceDashboard: async (req, res) => {
    try {
      const { days } = req.query;
      const data = await mysqlAnalyticsService.getApiPerformanceDashboard(parseInt(days) || 7);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  getTenantHealthScores: async (req, res) => {
    try {
      const data = await mysqlAnalyticsService.getTenantHealthScores();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
module.exports = mysqlAnalyticsController;