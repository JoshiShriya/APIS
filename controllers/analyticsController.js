const analyticsService = require('../services/analyticsService');

const analyticsController = {
  getPostEngagement: async (req, res) => {
    try {
      const { tenantId, startDate, endDate } = req.query;
      const data = await analyticsService.getPostEngagement(tenantId, startDate, endDate);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getBrandVoiceAnalysis: async (req, res) => {
    try {
      const { tenantId } = req.query;
      const data = await analyticsService.getBrandVoiceAnalysis(tenantId);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = analyticsController;