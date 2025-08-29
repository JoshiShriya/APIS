const Post = require('../models/mongoDB/postModel');

class AnalyticsService {
  // Post Engagement by Platform & Author Type
  async getPostEngagement(tenantId, startDate, endDate) {
    return await Post.aggregate([
      {
        $match: {
          tenantId: mongoose.Types.ObjectId(tenantId),
          status: 'published',
          'timestamps.publishedAt': {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          'metrics.impressions': { $gt: 0 }
        }
      },
      {
        $group: {
          _id: {
            platform: '$platform',
            authorType: '$author.type'
          },
          totalPosts: { $sum: 1 },
          avgLikes: { $avg: '$metrics.likes' },
          avgShares: { $avg: '$metrics.shares' },
          avgComments: { $avg: '$metrics.comments' },
          avgClicks: { $avg: '$metrics.clicks' },
          avgImpressions: { $avg: '$metrics.impressions' },
          avgEngagementRate: {
            $avg: {
              $multiply: [
                {
                  $divide: [
                    { $add: ['$metrics.likes', '$metrics.shares', '$metrics.comments'] },
                    { $max: ['$metrics.impressions', 1] }
                  ]
                },
                100
              ]
            }
          }
        }
      },
      { $sort: { '_id.platform': 1, 'avgEngagementRate': -1 } }
    ]);
  }

  // Brand Voice Consistency
  async getBrandVoiceAnalysis(tenantId) {
    return await Post.aggregate([
      {
        $match: {
          tenantId: mongoose.Types.ObjectId(tenantId),
          status: 'published',
          sentimentScore: { $exists: true },
          readabilityScore: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$author.type',
          postsAnalyzed: { $sum: 1 },
          avgSentiment: { $avg: '$sentimentScore' },
          avgReadability: { $avg: '$readabilityScore' },
          sentimentConsistency: { $stdDevPop: '$sentimentScore' }
        }
      }
    ]);
  }
}

module.exports = new AnalyticsService();