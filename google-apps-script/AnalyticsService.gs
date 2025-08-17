/**
 * Analytics Service
 * Provides dashboard metrics and analytics for admin portal
 */

const AnalyticsService = {
  
  /**
   * Get comprehensive dashboard metrics
   */
  getDashboardMetrics(authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'view-analytics')) {
        throw new Error('Insufficient permissions to view analytics');
      }
      
      const metrics = {
        timestamp: new Date().toISOString(),
        overview: this.getOverviewMetrics(),
        events: this.getEventMetrics(),
        activity: this.getActivityMetrics(authResult),
        storage: this.getStorageMetrics(authResult),
        users: this.getUserMetrics(authResult),
        system: this.getSystemHealth()
      };
      
      return {
        success: true,
        metrics: metrics
      };
      
    } catch (error) {
      Logger.log(`Error getting dashboard metrics: ${error.message}`);
      return {
        success: false,
        error: error.message,
        metrics: null
      };
    }
  },
  
  /**
   * Get overview metrics
   */
  getOverviewMetrics() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const events = SheetsService.getAllActiveEvents();
      
      const overview = {
        eventsToday: [],
        eventsTomorrow: [],
        eventsThisWeek: [],
        totalActiveEvents: events.length,
        upcomingEventsCount: 0,
        multiDayEventsCount: 0
      };
      
      events.forEach(event => {
        const eventStart = new Date(event.dateStart);
        eventStart.setHours(0, 0, 0, 0);
        
        const eventEnd = event.dateEnd ? new Date(event.dateEnd) : eventStart;
        eventEnd.setHours(23, 59, 59, 999);
        
        // Check if event is today
        if (today >= eventStart && today <= eventEnd) {
          overview.eventsToday.push({
            id: event.id,
            title: event.title,
            time: event.time,
            speaker: event.speaker
          });
        }
        
        // Check if event starts tomorrow
        if (eventStart.getTime() === tomorrow.getTime()) {
          overview.eventsTomorrow.push({
            id: event.id,
            title: event.title,
            time: event.time,
            speaker: event.speaker
          });
        }
        
        // Check if event is this week
        if (eventStart >= today && eventStart <= weekEnd) {
          overview.eventsThisWeek.push({
            id: event.id,
            title: event.title,
            dateStart: event.dateStart,
            time: event.time,
            speaker: event.speaker
          });
        }
        
        // Count upcoming events
        if (eventEnd >= today) {
          overview.upcomingEventsCount++;
        }
        
        // Count multi-day events
        if (event.isMultiDay) {
          overview.multiDayEventsCount++;
        }
      });
      
      return overview;
      
    } catch (error) {
      Logger.log(`Error getting overview metrics: ${error.message}`);
      return {
        eventsToday: [],
        eventsTomorrow: [],
        eventsThisWeek: [],
        totalActiveEvents: 0,
        upcomingEventsCount: 0,
        multiDayEventsCount: 0
      };
    }
  },
  
  /**
   * Get event-specific metrics
   */
  getEventMetrics() {
    try {
      const events = SheetsService.getAllActiveEvents();
      
      const metrics = {
        totalEvents: events.length,
        recentlyAdded: [],
        topSpeakers: {},
        eventsByLocation: {},
        monthlyTrend: {},
        averageEventsPerMonth: 0
      };
      
      events.forEach(event => {
        // Count speakers
        const speaker = event.speaker;
        metrics.topSpeakers[speaker] = (metrics.topSpeakers[speaker] || 0) + 1;
        
        // Count locations
        const location = event.location;
        metrics.eventsByLocation[location] = (metrics.eventsByLocation[location] || 0) + 1;
        
        // Monthly trend
        const eventDate = new Date(event.dateStart);
        const monthKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
        metrics.monthlyTrend[monthKey] = (metrics.monthlyTrend[monthKey] || 0) + 1;
        
        // Recent events (last 5)
        if (metrics.recentlyAdded.length < 5) {
          metrics.recentlyAdded.push({
            id: event.id,
            title: event.title,
            dateStart: event.dateStart,
            speaker: event.speaker,
            createdAt: event.createdAt
          });
        }
      });
      
      // Convert speakers to array and sort
      metrics.topSpeakers = Object.entries(metrics.topSpeakers)
        .map(([name, count]) => ({ name, eventCount: count }))
        .sort((a, b) => b.eventCount - a.eventCount)
        .slice(0, 10);
      
      // Convert locations to array and sort
      metrics.eventsByLocation = Object.entries(metrics.eventsByLocation)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count);
      
      // Convert monthly trend to array and sort
      metrics.monthlyTrend = Object.entries(metrics.monthlyTrend)
        .map(([month, count]) => ({ month, eventCount: count }))
        .sort((a, b) => a.month.localeCompare(b.month));
      
      // Calculate average events per month
      if (metrics.monthlyTrend.length > 0) {
        const totalEvents = metrics.monthlyTrend.reduce((sum, item) => sum + item.eventCount, 0);
        metrics.averageEventsPerMonth = Math.round(totalEvents / metrics.monthlyTrend.length * 10) / 10;
      }
      
      // Sort recent events by creation date
      metrics.recentlyAdded.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return metrics;
      
    } catch (error) {
      Logger.log(`Error getting event metrics: ${error.message}`);
      return {
        totalEvents: 0,
        recentlyAdded: [],
        topSpeakers: [],
        eventsByLocation: [],
        monthlyTrend: [],
        averageEventsPerMonth: 0
      };
    }
  },
  
  /**
   * Get activity metrics
   */
  getActivityMetrics(authResult) {
    try {
      const activityResult = ActivityLogger.getActivitySummary(authResult, 7);
      
      if (!activityResult.success) {
        return {
          totalActivities: 0,
          actionCounts: {},
          userCounts: {},
          recentActions: []
        };
      }
      
      return activityResult.summary;
      
    } catch (error) {
      Logger.log(`Error getting activity metrics: ${error.message}`);
      return {
        totalActivities: 0,
        actionCounts: {},
        userCounts: {},
        recentActions: []
      };
    }
  },
  
  /**
   * Get storage metrics
   */
  getStorageMetrics(authResult) {
    try {
      const storageResult = DriveService.getStorageStats(authResult);
      
      if (!storageResult.success) {
        return {
          totalSize: 0,
          totalFiles: 0,
          averageSize: 0,
          formattedSize: '0 Bytes'
        };
      }
      
      return storageResult.stats;
      
    } catch (error) {
      Logger.log(`Error getting storage metrics: ${error.message}`);
      return {
        totalSize: 0,
        totalFiles: 0,
        averageSize: 0,
        formattedSize: '0 Bytes'
      };
    }
  },
  
  /**
   * Get user metrics
   */
  getUserMetrics(authResult) {
    try {
      const userResult = UserService.getUserStats(authResult);
      
      if (!userResult.success) {
        return {
          totalUsers: 0,
          activeUsers: 0,
          suspendedUsers: 0,
          roleDistribution: {},
          recentLogins: []
        };
      }
      
      return userResult.stats;
      
    } catch (error) {
      Logger.log(`Error getting user metrics: ${error.message}`);
      return {
        totalUsers: 0,
        activeUsers: 0,
        suspendedUsers: 0,
        roleDistribution: {},
        recentLogins: []
      };
    }
  },
  
  /**
   * Get system health metrics
   */
  getSystemHealth() {
    try {
      const health = {
        timestamp: new Date().toISOString(),
        services: {
          sheets: SheetsService.testConnection(),
          drive: DriveService.testConnection(),
          auth: AuthService.testConfiguration()
        },
        config: {
          hasEventsSheetId: !!CONFIG.EVENTS_SHEET_ID && CONFIG.EVENTS_SHEET_ID !== 'YOUR_EVENTS_SPREADSHEET_ID',
          hasOAuthClientId: !!CONFIG.ADMIN_CONFIG.OAUTH_CLIENT_ID && CONFIG.ADMIN_CONFIG.OAUTH_CLIENT_ID !== 'YOUR_GOOGLE_OAUTH_CLIENT_ID',
          hasSuperAdmin: !!CONFIG.ADMIN_CONFIG.SUPER_ADMIN && CONFIG.ADMIN_CONFIG.SUPER_ADMIN !== 'your-email@gmail.com'
        },
        triggers: this.getTriggerStatus()
      };
      
      // Overall health status
      health.overallStatus = 'healthy';
      
      if (!health.services.sheets.connected || !health.services.drive.connected) {
        health.overallStatus = 'degraded';
      }
      
      if (!health.config.hasEventsSheetId || !health.config.hasOAuthClientId || !health.config.hasSuperAdmin) {
        health.overallStatus = 'configuration_required';
      }
      
      return health;
      
    } catch (error) {
      Logger.log(`Error getting system health: ${error.message}`);
      return {
        timestamp: new Date().toISOString(),
        overallStatus: 'error',
        error: error.message
      };
    }
  },
  
  /**
   * Get trigger status
   */
  getTriggerStatus() {
    try {
      const triggers = ScriptApp.getProjectTriggers();
      const cleanupTrigger = triggers.find(trigger => 
        trigger.getHandlerFunction() === 'autoCleanupPastEvents'
      );
      
      return {
        cleanupTrigger: {
          enabled: !!cleanupTrigger,
          lastRun: null, // Would need to track this separately
          nextRun: cleanupTrigger ? this.calculateNextCleanupRun() : null
        },
        totalTriggers: triggers.length
      };
      
    } catch (error) {
      Logger.log(`Error getting trigger status: ${error.message}`);
      return {
        cleanupTrigger: {
          enabled: false,
          error: error.message
        },
        totalTriggers: 0
      };
    }
  },
  
  /**
   * Calculate next cleanup run time
   */
  calculateNextCleanupRun() {
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(2, 0, 0, 0); // 2 AM
    
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    return nextRun.toISOString();
  },
  
  /**
   * Get detailed analytics report
   */
  getDetailedReport(authResult, reportType = 'overview', dateRange = 30) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'view-analytics')) {
        throw new Error('Insufficient permissions to view detailed reports');
      }
      
      const report = {
        reportType: reportType,
        dateRange: dateRange,
        generatedAt: new Date().toISOString(),
        generatedBy: authResult.user.email,
        data: {}
      };
      
      switch (reportType) {
        case 'events':
          report.data = this.getDetailedEventReport(dateRange);
          break;
        
        case 'activity':
          report.data = this.getDetailedActivityReport(authResult, dateRange);
          break;
        
        case 'users':
          report.data = this.getDetailedUserReport(authResult);
          break;
        
        case 'overview':
        default:
          report.data = this.getDashboardMetrics(authResult).metrics;
          break;
      }
      
      // Log report generation
      ActivityLogger.logActivity('generate_report', authResult.user.email, null, {
        reportType: reportType,
        dateRange: dateRange
      });
      
      return {
        success: true,
        report: report
      };
      
    } catch (error) {
      Logger.log(`Error generating detailed report: ${error.message}`);
      return {
        success: false,
        error: error.message,
        report: null
      };
    }
  },
  
  /**
   * Get detailed event report
   */
  getDetailedEventReport(dateRange) {
    // Implementation for detailed event analytics
    const events = SheetsService.getAllActiveEvents();
    
    return {
      summary: this.getEventMetrics(),
      eventsList: events.slice(0, 50), // Limit for performance
      trends: {
        // Add trend analysis here
      }
    };
  },
  
  /**
   * Get detailed activity report
   */
  getDetailedActivityReport(authResult, dateRange) {
    const activityResult = ActivityLogger.getActivitySummary(authResult, dateRange);
    
    return {
      summary: activityResult.success ? activityResult.summary : {},
      trends: {
        // Add activity trend analysis here
      }
    };
  },
  
  /**
   * Get detailed user report
   */
  getDetailedUserReport(authResult) {
    const userResult = UserService.getUserStats(authResult);
    
    return {
      summary: userResult.success ? userResult.stats : {},
      userDetails: UserService.getAdminUsers(authResult)
    };
  }
};
