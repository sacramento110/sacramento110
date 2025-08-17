/**
 * Activity Logger Service
 * Handles logging of all admin activities for audit trail
 */

const ActivityLogger = {
  
  /**
   * Log admin activity
   */
  logActivity(action, adminEmail, eventId, details) {
    try {
      const sheet = SheetsService.getActivityLogSheet();
      
      // Generate unique log ID
      const logId = this.generateLogId();
      
      // Get session info (simplified)
      const sessionId = this.getCurrentSessionId(adminEmail);
      
      // Prepare log entry
      const logEntry = [
        logId,                                          // log_id
        adminEmail,                                     // admin_email  
        action,                                         // action
        eventId || '',                                  // event_id
        new Date(),                                     // timestamp
        this.getClientIP(),                             // ip_address
        JSON.stringify(details || {}),                  // details
        sessionId                                       // session_id
      ];
      
      // Add to sheet
      sheet.appendRow(logEntry);
      
      Logger.log(`Activity logged: ${action} by ${adminEmail}`);
      
    } catch (error) {
      Logger.log(`Error logging activity: ${error.message}`);
      // Don't throw error - logging failure shouldn't break the main operation
    }
  },
  
  /**
   * Generate unique log ID
   */
  generateLogId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `log-${timestamp}-${random}`;
  },
  
  /**
   * Get current session ID (simplified implementation)
   */
  getCurrentSessionId(adminEmail) {
    // In a real implementation, this would track actual sessions
    const today = new Date().toISOString().split('T')[0];
    return `session-${adminEmail}-${today}`;
  },
  
  /**
   * Get client IP address (limited in Apps Script)
   */
  getClientIP() {
    // Apps Script has limited access to client IP
    // This is a placeholder - real IP detection would need different approach
    return 'unknown';
  },
  
  /**
   * Get activity log for admin dashboard
   */
  getActivityLog(authResult, limit = 50) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'view-logs')) {
        throw new Error('Insufficient permissions to view activity logs');
      }
      
      const sheet = SheetsService.getActivityLogSheet();
      const data = sheet.getDataRange().getValues();
      
      if (data.length <= 1) {
        return {
          success: true,
          activities: [],
          count: 0
        };
      }
      
      // Convert rows to objects (skip header)
      const activities = [];
      for (let i = Math.max(1, data.length - limit); i < data.length; i++) {
        const row = data[i];
        activities.push({
          logId: row[0],
          adminEmail: row[1],
          action: row[2],
          eventId: row[3],
          timestamp: row[4],
          ipAddress: row[5],
          details: this.safeParseJSON(row[6]),
          sessionId: row[7]
        });
      }
      
      // Sort by timestamp (newest first)
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return {
        success: true,
        activities: activities.slice(0, limit),
        count: activities.length
      };
      
    } catch (error) {
      Logger.log(`Error getting activity log: ${error.message}`);
      return {
        success: false,
        error: error.message,
        activities: [],
        count: 0
      };
    }
  },
  
  /**
   * Get activity summary for dashboard
   */
  getActivitySummary(authResult, days = 7) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'view-analytics')) {
        throw new Error('Insufficient permissions to view activity summary');
      }
      
      const sheet = SheetsService.getActivityLogSheet();
      const data = sheet.getDataRange().getValues();
      
      if (data.length <= 1) {
        return {
          success: true,
          summary: this.getEmptySummary()
        };
      }
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Process activities
      const summary = {
        totalActivities: 0,
        actionCounts: {},
        userCounts: {},
        dailyActivity: {},
        recentActions: []
      };
      
      // Skip header row
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const timestamp = new Date(row[4]);
        
        // Only count activities within date range
        if (timestamp >= startDate && timestamp <= endDate) {
          summary.totalActivities++;
          
          const action = row[2];
          const adminEmail = row[1];
          const dateKey = timestamp.toISOString().split('T')[0];
          
          // Count by action
          summary.actionCounts[action] = (summary.actionCounts[action] || 0) + 1;
          
          // Count by user
          summary.userCounts[adminEmail] = (summary.userCounts[adminEmail] || 0) + 1;
          
          // Count by day
          summary.dailyActivity[dateKey] = (summary.dailyActivity[dateKey] || 0) + 1;
          
          // Collect recent actions (last 10)
          if (summary.recentActions.length < 10) {
            summary.recentActions.push({
              action: action,
              adminEmail: adminEmail,
              timestamp: timestamp,
              details: this.safeParseJSON(row[6])
            });
          }
        }
      }
      
      // Sort recent actions by timestamp
      summary.recentActions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return {
        success: true,
        summary: summary,
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          days: days
        }
      };
      
    } catch (error) {
      Logger.log(`Error getting activity summary: ${error.message}`);
      return {
        success: false,
        error: error.message,
        summary: this.getEmptySummary()
      };
    }
  },
  
  /**
   * Get empty summary structure
   */
  getEmptySummary() {
    return {
      totalActivities: 0,
      actionCounts: {},
      userCounts: {},
      dailyActivity: {},
      recentActions: []
    };
  },
  
  /**
   * Get user activity report
   */
  getUserActivityReport(authResult, userEmail, days = 30) {
    try {
      // Check permissions (super-admin only)
      if (authResult.role !== 'super-admin') {
        throw new Error('Insufficient permissions to view user activity reports');
      }
      
      const sheet = SheetsService.getActivityLogSheet();
      const data = sheet.getDataRange().getValues();
      
      if (data.length <= 1) {
        return {
          success: true,
          report: {
            userEmail: userEmail,
            activities: [],
            summary: { totalActions: 0, actionCounts: {} }
          }
        };
      }
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const activities = [];
      const actionCounts = {};
      
      // Process activities for specific user
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const rowUserEmail = row[1];
        const timestamp = new Date(row[4]);
        
        if (rowUserEmail === userEmail && timestamp >= startDate && timestamp <= endDate) {
          const action = row[2];
          
          activities.push({
            logId: row[0],
            action: action,
            eventId: row[3],
            timestamp: timestamp,
            details: this.safeParseJSON(row[6])
          });
          
          actionCounts[action] = (actionCounts[action] || 0) + 1;
        }
      }
      
      // Sort by timestamp (newest first)
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return {
        success: true,
        report: {
          userEmail: userEmail,
          activities: activities,
          summary: {
            totalActions: activities.length,
            actionCounts: actionCounts
          },
          dateRange: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            days: days
          }
        }
      };
      
    } catch (error) {
      Logger.log(`Error getting user activity report: ${error.message}`);
      return {
        success: false,
        error: error.message,
        report: null
      };
    }
  },
  
  /**
   * Safely parse JSON string
   */
  safeParseJSON(jsonString) {
    try {
      if (!jsonString || jsonString === '') {
        return {};
      }
      return JSON.parse(jsonString);
    } catch (error) {
      Logger.log(`Error parsing JSON: ${error.message}`);
      return { raw: jsonString };
    }
  },
  
  /**
   * Export activity log to CSV
   */
  exportActivityLog(authResult, days = 30) {
    try {
      // Check permissions (super-admin only)
      if (authResult.role !== 'super-admin') {
        throw new Error('Insufficient permissions to export activity log');
      }
      
      const sheet = SheetsService.getActivityLogSheet();
      const data = sheet.getDataRange().getValues();
      
      if (data.length <= 1) {
        return {
          success: true,
          csv: 'No activity data available',
          filename: `activity-log-${new Date().toISOString().split('T')[0]}.csv`
        };
      }
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Build CSV content
      let csvContent = 'Log ID,Admin Email,Action,Event ID,Timestamp,IP Address,Details\n';
      
      // Process data rows
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const timestamp = new Date(row[4]);
        
        if (timestamp >= startDate && timestamp <= endDate) {
          // Escape CSV fields
          const csvRow = [
            row[0],                                    // log_id
            row[1],                                    // admin_email
            row[2],                                    // action
            row[3] || '',                              // event_id
            timestamp.toISOString(),                   // timestamp
            row[5] || '',                              // ip_address
            (row[6] || '').replace(/"/g, '""')         // details (escaped)
          ];
          
          csvContent += csvRow.map(field => `"${field}"`).join(',') + '\n';
        }
      }
      
      const filename = `activity-log-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.csv`;
      
      // Log export activity
      this.logActivity('export_log', authResult.user.email, null, {
        exportType: 'activity_log',
        dateRange: `${days} days`,
        filename: filename
      });
      
      return {
        success: true,
        csv: csvContent,
        filename: filename,
        recordCount: csvContent.split('\n').length - 2 // exclude header and last empty line
      };
      
    } catch (error) {
      Logger.log(`Error exporting activity log: ${error.message}`);
      return {
        success: false,
        error: error.message,
        csv: null,
        filename: null
      };
    }
  },
  
  /**
   * Clean up old activity logs (run periodically)
   */
  cleanupOldLogs(retentionDays = 365) {
    try {
      const sheet = SheetsService.getActivityLogSheet();
      const data = sheet.getDataRange().getValues();
      
      if (data.length <= 1) {
        return { deletedCount: 0 };
      }
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      
      let deletedCount = 0;
      
      // Process from bottom to top to avoid index issues
      for (let i = data.length - 1; i >= 1; i--) {
        const row = data[i];
        const timestamp = new Date(row[4]);
        
        if (timestamp < cutoffDate) {
          sheet.deleteRow(i + 1);
          deletedCount++;
        }
      }
      
      Logger.log(`Cleaned up ${deletedCount} old activity log entries`);
      
      return { deletedCount: deletedCount };
      
    } catch (error) {
      Logger.log(`Error cleaning up old logs: ${error.message}`);
      return { deletedCount: 0, error: error.message };
    }
  }
};
