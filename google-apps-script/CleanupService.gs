/**
 * Cleanup Service
 * Handles automatic cleanup of past events and maintenance tasks
 */

const CleanupService = {
  
  /**
   * Set up automatic cleanup trigger
   */
  setupCleanupTrigger() {
    try {
      // Delete existing triggers for this function
      const triggers = ScriptApp.getProjectTriggers();
      triggers.forEach(trigger => {
        if (trigger.getHandlerFunction() === 'autoCleanupPastEvents') {
          ScriptApp.deleteTrigger(trigger);
        }
      });
      
      // Create new daily trigger at 2 AM
      ScriptApp.newTrigger('autoCleanupPastEvents')
        .timeBased()
        .everyDays(1)
        .atHour(2)
        .create();
      
      Logger.log('Cleanup trigger set up successfully');
      return true;
      
    } catch (error) {
      Logger.log(`Error setting up cleanup trigger: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Automatic cleanup function (triggered daily)
   */
  autoCleanupPastEvents() {
    try {
      Logger.log('Starting automatic cleanup...');
      
      const results = {
        timestamp: new Date().toISOString(),
        eventsProcessed: 0,
        eventsArchived: 0,
        imagesArchived: 0,
        errors: []
      };
      
      const sheet = SheetsService.getEventsSheet();
      const data = sheet.getDataRange().getValues();
      
      if (data.length <= 1) {
        Logger.log('No events to process');
        return results;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Process events from bottom to top to avoid index issues
      for (let i = data.length - 1; i >= 1; i--) {
        try {
          const event = SheetsService.rowToEvent(data[i], i + 1);
          if (!event) continue;
          
          results.eventsProcessed++;
          
          // Check if event should be cleaned up (day after event ends)
          if (this.shouldCleanupEvent(event, today)) {
            // Archive event data
            this.archiveEvent(event);
            
            // Archive/delete event image
            if (event.imageDriveId) {
              try {
                DriveService.deleteEventImage(event.imageDriveId);
                results.imagesArchived++;
              } catch (imageError) {
                Logger.log(`Warning: Could not archive image ${event.imageDriveId}: ${imageError.message}`);
                results.errors.push(`Image archive failed for ${event.id}: ${imageError.message}`);
              }
            }
            
            // Delete event row from sheet
            sheet.deleteRow(i + 1);
            results.eventsArchived++;
            
            Logger.log(`Archived event: ${event.title} (${event.id})`);
          }
          
        } catch (eventError) {
          Logger.log(`Error processing event at row ${i + 1}: ${eventError.message}`);
          results.errors.push(`Row ${i + 1}: ${eventError.message}`);
        }
      }
      
      // Additional cleanup tasks
      this.performMaintenanceTasks(results);
      
      // Log cleanup activity
      ActivityLogger.logActivity('auto_cleanup', 'system', null, {
        results: results,
        trigger: 'automatic'
      });
      
      Logger.log(`Cleanup completed. Archived ${results.eventsArchived} events and ${results.imagesArchived} images.`);
      
      return results;
      
    } catch (error) {
      Logger.log(`Cleanup failed: ${error.message}`);
      
      // Log cleanup failure
      ActivityLogger.logActivity('cleanup_failed', 'system', null, {
        error: error.message,
        trigger: 'automatic'
      });
      
      throw error;
    }
  },
  
  /**
   * Check if event should be cleaned up
   */
  shouldCleanupEvent(event, today) {
    // Use end date if available, otherwise use start date
    const eventEndDate = new Date(event.dateEnd || event.dateStart);
    eventEndDate.setHours(23, 59, 59, 999);
    
    // Add one day to event end date for cleanup threshold
    const cleanupDate = new Date(eventEndDate);
    cleanupDate.setDate(cleanupDate.getDate() + 1);
    
    return today >= cleanupDate;
  },
  
  /**
   * Archive event data to separate sheet
   */
  archiveEvent(event) {
    try {
      const spreadsheet = SpreadsheetApp.openById(CONFIG.EVENTS_SHEET_ID);
      let archiveSheet = spreadsheet.getSheetByName('Archived_Events');
      
      // Create archive sheet if it doesn't exist
      if (!archiveSheet) {
        archiveSheet = spreadsheet.insertSheet('Archived_Events');
        
        // Set up headers
        const headers = [
          'archived_date',      // When it was archived
          'event_id',
          'title',
          'description',
          'date_start',
          'date_end',
          'time',
          'speaker_name',
          'hosted_by',
          'location',
          'image_drive_id',
          'image_url',
          'status',
          'is_multi_day',
          'created_at',
          'updated_at',
          'created_by',
          'last_modified_by'
        ];
        
        archiveSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        
        // Format header row
        const headerRange = archiveSheet.getRange(1, 1, 1, headers.length);
        headerRange.setBackground('#757575');
        headerRange.setFontColor('#FFFFFF');
        headerRange.setFontWeight('bold');
        archiveSheet.setFrozenRows(1);
      }
      
      // Add archived event
      const archiveRow = [
        new Date(),               // archived_date
        event.id,
        event.title,
        event.description,
        event.dateStart,
        event.dateEnd || '',
        event.time,
        event.speaker,
        event.hostedBy,
        event.location,
        event.imageDriveId,
        event.imageUrl,
        event.status,
        event.isMultiDay ? 'TRUE' : 'FALSE',
        event.createdAt ? new Date(event.createdAt) : '',
        event.updatedAt ? new Date(event.updatedAt) : '',
        event.createdBy,
        event.lastModifiedBy
      ];
      
      archiveSheet.appendRow(archiveRow);
      
    } catch (error) {
      Logger.log(`Error archiving event: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Perform additional maintenance tasks
   */
  performMaintenanceTasks(results) {
    try {
      // Clean up old activity logs (keep last 365 days)
      const logCleanupResult = ActivityLogger.cleanupOldLogs(365);
      results.oldLogsDeleted = logCleanupResult.deletedCount;
      
      // Clean up old archived Drive files (keep last 90 days)
      const driveCleanupResult = DriveService.cleanupArchivedFiles();
      results.oldFilesDeleted = driveCleanupResult;
      
      Logger.log(`Maintenance completed. Deleted ${results.oldLogsDeleted} old logs and ${results.oldFilesDeleted} old files.`);
      
    } catch (error) {
      Logger.log(`Error in maintenance tasks: ${error.message}`);
      results.errors.push(`Maintenance error: ${error.message}`);
    }
  },
  
  /**
   * Manual cleanup (admin-triggered)
   */
  runManualCleanup(authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'manual-cleanup')) {
        throw new Error('Insufficient permissions to run manual cleanup');
      }
      
      Logger.log(`Manual cleanup initiated by ${authResult.user.email}`);
      
      // Run the same cleanup process
      const results = this.autoCleanupPastEvents();
      
      // Override trigger type for logging
      results.trigger = 'manual';
      results.initiatedBy = authResult.user.email;
      
      // Log manual cleanup
      ActivityLogger.logActivity('manual_cleanup', authResult.user.email, null, {
        results: results,
        trigger: 'manual'
      });
      
      return {
        success: true,
        results: results,
        message: `Cleanup completed. Archived ${results.eventsArchived} events.`
      };
      
    } catch (error) {
      Logger.log(`Manual cleanup failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        results: null
      };
    }
  },
  
  /**
   * Get cleanup statistics
   */
  getCleanupStats(authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'view-analytics')) {
        throw new Error('Insufficient permissions to view cleanup stats');
      }
      
      const spreadsheet = SpreadsheetApp.openById(CONFIG.EVENTS_SHEET_ID);
      const archiveSheet = spreadsheet.getSheetByName('Archived_Events');
      
      const stats = {
        totalArchivedEvents: 0,
        lastCleanupRun: null,
        cleanupHistory: []
      };
      
      // Count archived events
      if (archiveSheet) {
        stats.totalArchivedEvents = Math.max(0, archiveSheet.getLastRow() - 1); // exclude header
      }
      
      // Get cleanup history from activity log
      const activityResult = ActivityLogger.getActivityLog(authResult, 100);
      if (activityResult.success) {
        const cleanupActivities = activityResult.activities.filter(activity => 
          activity.action === 'auto_cleanup' || activity.action === 'manual_cleanup'
        );
        
        if (cleanupActivities.length > 0) {
          stats.lastCleanupRun = cleanupActivities[0].timestamp;
          stats.cleanupHistory = cleanupActivities.slice(0, 10).map(activity => ({
            timestamp: activity.timestamp,
            type: activity.action,
            initiatedBy: activity.adminEmail,
            results: activity.details.results || {}
          }));
        }
      }
      
      return {
        success: true,
        stats: stats
      };
      
    } catch (error) {
      Logger.log(`Error getting cleanup stats: ${error.message}`);
      return {
        success: false,
        error: error.message,
        stats: null
      };
    }
  },
  
  /**
   * Preview what would be cleaned up (without actually cleaning)
   */
  previewCleanup(authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'view-analytics')) {
        throw new Error('Insufficient permissions to preview cleanup');
      }
      
      const sheet = SheetsService.getEventsSheet();
      const data = sheet.getDataRange().getValues();
      
      const preview = {
        eventsToArchive: [],
        totalEvents: Math.max(0, data.length - 1), // exclude header
        previewDate: new Date().toISOString()
      };
      
      if (data.length <= 1) {
        return {
          success: true,
          preview: preview
        };
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check which events would be cleaned up
      for (let i = 1; i < data.length; i++) {
        const event = SheetsService.rowToEvent(data[i], i + 1);
        if (!event) continue;
        
        if (this.shouldCleanupEvent(event, today)) {
          preview.eventsToArchive.push({
            id: event.id,
            title: event.title,
            dateStart: event.dateStart,
            dateEnd: event.dateEnd,
            status: event.status
          });
        }
      }
      
      return {
        success: true,
        preview: preview
      };
      
    } catch (error) {
      Logger.log(`Error previewing cleanup: ${error.message}`);
      return {
        success: false,
        error: error.message,
        preview: null
      };
    }
  },
  
  /**
   * Get cleanup schedule information
   */
  getCleanupSchedule(authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'view-analytics')) {
        throw new Error('Insufficient permissions to view cleanup schedule');
      }
      
      const triggers = ScriptApp.getProjectTriggers();
      const cleanupTrigger = triggers.find(trigger => 
        trigger.getHandlerFunction() === 'autoCleanupPastEvents'
      );
      
      const schedule = {
        isEnabled: !!cleanupTrigger,
        nextRun: null,
        frequency: 'Daily at 2:00 AM',
        lastRun: null
      };
      
      if (cleanupTrigger) {
        // Calculate next run time (next 2 AM)
        const now = new Date();
        const nextRun = new Date();
        nextRun.setHours(2, 0, 0, 0);
        
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        
        schedule.nextRun = nextRun.toISOString();
      }
      
      // Get last run from activity log
      const activityResult = ActivityLogger.getActivityLog(authResult, 50);
      if (activityResult.success) {
        const lastCleanup = activityResult.activities.find(activity => 
          activity.action === 'auto_cleanup'
        );
        
        if (lastCleanup) {
          schedule.lastRun = lastCleanup.timestamp;
        }
      }
      
      return {
        success: true,
        schedule: schedule
      };
      
    } catch (error) {
      Logger.log(`Error getting cleanup schedule: ${error.message}`);
      return {
        success: false,
        error: error.message,
        schedule: null
      };
    }
  }
};
