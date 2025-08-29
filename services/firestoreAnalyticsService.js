const db = require('../config/firebase');

class FirestoreAnalyticsService {
  async getPostEngagement(tenantId, startDate, endDate) {
    const postsRef = db.collection('posts');
    const snapshot = await postsRef
      .where('tenantId', '==', tenantId)
      .where('status', '==', 'published')
      .where('publishedAt', '>=', startDate)
      .where('publishedAt', '<=', endDate)
      .where('metrics.impressions', '>', 0)
      .get();

    if (snapshot.empty) {
      return [];
    }

    const results = new Map();

    snapshot.forEach(doc => {
      const post = doc.data();
      const key = `${post.platform}_${post.author.type}`;
      
      if (!results.has(key)) {
        results.set(key, {
          platform: post.platform,
          authorType: post.author.type,
          totalPosts: 0,
          totalLikes: 0,
          totalShares: 0,
          totalComments: 0,
          totalClicks: 0,
          totalImpressions: 0
        });
      }

      const stats = results.get(key);
      stats.totalPosts++;
      stats.totalLikes += post.metrics.likes || 0;
      stats.totalShares += post.metrics.shares || 0;
      stats.totalComments += post.metrics.comments || 0;
      stats.totalClicks += post.metrics.clicks || 0;
      stats.totalImpressions += post.metrics.impressions || 0;
    });

    // Calculate averages
    return Array.from(results.values()).map(item => ({
      ...item,
      avgLikes: item.totalLikes / item.totalPosts,
      avgShares: item.totalShares / item.totalPosts,
      avgComments: item.totalComments / item.totalPosts,
      avgClicks: item.totalClicks / item.totalPosts,
      avgImpressions: item.totalImpressions / item.totalPosts,
      avgEngagementRate: ((item.totalLikes + item.totalShares + item.totalComments) / item.totalImpressions) * 100
    }));
  }

  async getApiPerformance(integrationName, hours = 24) {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (hours * 60 * 60 * 1000));

    const logsRef = db.collection('api_logs');
    const snapshot = await logsRef
      .where('integrationName', '==', integrationName)
      .where('startedAt', '>=', startDate)
      .where('startedAt', '<=', endDate)
      .get();

    let totalCalls = 0;
    let successfulCalls = 0;
    let totalLatency = 0;
    const errors = new Map();

    snapshot.forEach(doc => {
      const log = doc.data();
      totalCalls++;
      
      if (log.success) {
        successfulCalls++;
        totalLatency += log.timestamps.durationMs || 0;
      } else {
        const errorMsg = log.error?.message || 'Unknown Error';
        errors.set(errorMsg, (errors.get(errorMsg) || 0) + 1);
      }
    });

    const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;
    const avgLatency = successfulCalls > 0 ? totalLatency / successfulCalls : 0;

    return {
      integrationName,
      totalCalls,
      successfulCalls,
      failedCalls: totalCalls - successfulCalls,
      successRate: Math.round(successRate * 100) / 100,
      avgLatency: Math.round(avgLatency * 100) / 100,
      topError: Array.from(errors.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
    };
  }
}

module.exports = new FirestoreAnalyticsService();