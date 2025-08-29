const { createMySQLConnection } = require('../config/database');

class MySQLAnalyticsService {
  async getTenantActivity(tenantId, days = 30) {
    const connection = await createMySQLConnection();
    
    try {
      const [results] = await connection.execute(`
        SELECT 
          adoption_segment,
          plan_type,
          COUNT(*) as tenant_count,
          AVG(active_users) as avg_active_users,
          AVG(features_used) as avg_features_used,
          AVG(daily_activity_rate) as avg_daily_activity
        FROM tenant_segmentation
        WHERE tenant_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY adoption_segment, plan_type
        ORDER BY 
          FIELD(adoption_segment, 'Power User', 'Active', 'Casual', 'Inactive'),
          FIELD(plan_type, 'enterprise', 'premium', 'basic', 'free')
      `, [tenantId, days]);

      return results;
    } finally {
      await connection.end();
    }
  }

  async getApiPerformanceDashboard(days = 7) {
    const connection = await createMySQLConnection();
    
    try {
      const [results] = await connection.execute(`
        SELECT 
          integration_name,
          COUNT(*) AS total_calls,
          COUNT(CASE WHEN success = TRUE THEN 1 END) AS successful_calls,
          COUNT(CASE WHEN success = FALSE THEN 1 END) AS failed_calls,
          AVG(duration_ms) AS avg_latency_ms,
          MAX(duration_ms) AS max_latency_ms,
          COUNT(CASE WHEN status_code BETWEEN 400 AND 499 THEN 1 END) AS client_errors,
          COUNT(CASE WHEN status_code BETWEEN 500 AND 599 THEN 1 END) AS server_errors,
          COUNT(CASE WHEN success = TRUE THEN 1 END) * 100.0 / COUNT(*) AS success_rate
        FROM api_logs 
        WHERE started_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY integration_name
        HAVING total_calls > 0
        ORDER BY success_rate ASC, total_calls DESC
      `, [days]);

      return results;
    } finally {
      await connection.end();
    }
  }

  async getTenantHealthScores() {
    const connection = await createMySQLConnection();
    
    try {
      const [results] = await connection.execute(`
        SELECT 
          t.tenant_id,
          t.name AS tenant_name,
          t.plan_type,
          COALESCE(te.avg_engagement_rate, 0) AS engagement_rate,
          COALESCE(ta.active_users, 0) AS active_users,
          COALESCE(ta.features_used, 0) AS features_used,
          COALESCE(au.api_success_rate, 100) AS api_success_rate,
          (COALESCE(te.avg_engagement_rate, 0) * 0.3 +
           COALESCE(ta.active_users, 0) * 0.2 +
           COALESCE(ta.features_used, 0) * 0.2 +
           COALESCE(au.api_success_rate, 0) * 0.3) AS health_score
        FROM tenants t
        LEFT JOIN tenant_engagement te ON t.tenant_id = te.tenant_id
        LEFT JOIN tenant_activity ta ON t.tenant_id = ta.tenant_id
        LEFT JOIN api_usage au ON t.tenant_id = au.tenant_id
        WHERE t.is_active = TRUE
        ORDER BY health_score DESC
        LIMIT 50
      `);

      return results;
    } finally {
      await connection.end();
    }
  }
}

module.exports = new MySQLAnalyticsService();