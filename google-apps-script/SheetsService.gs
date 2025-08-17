/**
 * Google Sheets Service
 * Handles all spreadsheet operations for events and admin data
 */

const SheetsService = {
  
  /**
   * Initialize Google Sheets structure
   */
  initializeSheets() {
    try {
      Logger.log('Initializing Google Sheets...');
      
      const spreadsheet = SpreadsheetApp.openById(CONFIG.EVENTS_SHEET_ID);
      
      // Create Events sheet
      this.createEventsSheet(spreadsheet);
      
      // Create Admin Activity Log sheet
      this.createActivityLogSheet(spreadsheet);
      
      // Create Admin Users sheet
      this.createAdminUsersSheet(spreadsheet);
      
      Logger.log('Google Sheets initialized successfully');
      return true;
      
    } catch (error) {
      Logger.log(`Failed to initialize sheets: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Create or update Events sheet structure
   */
  createEventsSheet(spreadsheet) {
    const SHEET_NAME = 'Events';
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      Logger.log('Created new Events sheet');
    }
    
    // Define headers
    const headers = [
      'event_id',           // A
      'title',              // B
      'description',        // C
      'date_start',         // D
      'date_end',           // E
      'time',               // F
      'speaker_name',       // G
      'hosted_by',          // H
      'location',           // I
      'image_drive_id',     // J
      'image_url',          // K
      'status',             // L (active/inactive/past)
      'is_multi_day',       // M
      'created_at',         // N
      'updated_at',         // O
      'created_by',         // P
      'last_modified_by'    // Q
    ];
    
    // Set headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4CAF50');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      
      // Freeze header row
      sheet.setFrozenRows(1);
      
      Logger.log('Set up Events sheet headers');
    }
    
    return sheet;
  },
  
  /**
   * Create or update Admin Activity Log sheet
   */
  createActivityLogSheet(spreadsheet) {
    const SHEET_NAME = 'Admin_Activity_Log';
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      Logger.log('Created new Admin Activity Log sheet');
    }
    
    const headers = [
      'log_id',         // A
      'admin_email',    // B
      'action',         // C (login/create/update/delete/upload)
      'event_id',       // D
      'timestamp',      // E
      'ip_address',     // F
      'details',        // G (JSON)
      'session_id'      // H
    ];
    
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#2196F3');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      
      sheet.setFrozenRows(1);
      Logger.log('Set up Admin Activity Log sheet headers');
    }
    
    return sheet;
  },
  
  /**
   * Create or update Admin Users sheet
   */
  createAdminUsersSheet(spreadsheet) {
    const SHEET_NAME = 'Admin_Users';
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      Logger.log('Created new Admin Users sheet');
    }
    
    const headers = [
      'email',          // A
      'name',           // B
      'role',           // C (super-admin/admin/editor)
      'status',         // D (active/suspended)
      'added_by',       // E
      'added_at',       // F
      'last_login',     // G
      'login_count'     // H
    ];
    
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#FF9800');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      
      sheet.setFrozenRows(1);
      Logger.log('Set up Admin Users sheet headers');
    }
    
    return sheet;
  },
  
  /**
   * Get Events sheet
   */
  getEventsSheet() {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.EVENTS_SHEET_ID);
    return spreadsheet.getSheetByName('Events');
  },
  
  /**
   * Get Admin Activity Log sheet
   */
  getActivityLogSheet() {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.EVENTS_SHEET_ID);
    return spreadsheet.getSheetByName('Admin_Activity_Log');
  },
  
  /**
   * Get Admin Users sheet
   */
  getAdminUsersSheet() {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.EVENTS_SHEET_ID);
    return spreadsheet.getSheetByName('Admin_Users');
  },
  
  /**
   * Convert sheet row to event object
   */
  rowToEvent(row, rowIndex) {
    if (!row || row.length < 17) return null;
    
    return {
      id: row[0],
      title: row[1],
      description: row[2],
      dateStart: row[3] ? this.formatDate(row[3]) : '',
      dateEnd: row[4] ? this.formatDate(row[4]) : null,
      time: row[5],
      speaker: row[6],
      hostedBy: row[7],
      location: row[8],
      imageDriveId: row[9],
      imageUrl: row[10],
      status: row[11],
      isMultiDay: row[12] === 'TRUE' || row[12] === true,
      createdAt: row[13] ? row[13].toISOString() : '',
      updatedAt: row[14] ? row[14].toISOString() : '',
      createdBy: row[15],
      lastModifiedBy: row[16],
      _rowIndex: rowIndex // Internal use for updates
    };
  },
  
  /**
   * Convert event object to sheet row
   */
  eventToRow(event) {
    return [
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
      event.status || 'active',
      event.isMultiDay ? 'TRUE' : 'FALSE',
      event.createdAt ? new Date(event.createdAt) : new Date(),
      new Date(), // updatedAt
      event.createdBy,
      event.lastModifiedBy
    ];
  },
  
  /**
   * Format date for consistent storage
   */
  formatDate(date) {
    if (!date) return '';
    
    if (typeof date === 'string') {
      return date; // Already formatted
    }
    
    if (date instanceof Date) {
      return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }
    
    return String(date);
  },
  
  /**
   * Get all active events
   */
  getAllActiveEvents() {
    try {
      const sheet = this.getEventsSheet();
      const data = sheet.getDataRange().getValues();
      const events = [];
      
      // Skip header row
      for (let i = 1; i < data.length; i++) {
        const event = this.rowToEvent(data[i], i + 1);
        if (event && event.status === 'active') {
          events.push(event);
        }
      }
      
      // Sort by date
      events.sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart));
      
      return events;
      
    } catch (error) {
      Logger.log(`Error getting active events: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Get event by ID
   */
  getEventById(eventId) {
    try {
      const sheet = this.getEventsSheet();
      const data = sheet.getDataRange().getValues();
      
      // Skip header row
      for (let i = 1; i < data.length; i++) {
        const event = this.rowToEvent(data[i], i + 1);
        if (event && event.id === eventId) {
          return event;
        }
      }
      
      return null;
      
    } catch (error) {
      Logger.log(`Error getting event by ID: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Add new event
   */
  addEvent(eventData) {
    try {
      const sheet = this.getEventsSheet();
      const row = this.eventToRow(eventData);
      
      sheet.appendRow(row);
      
      Logger.log(`Added new event: ${eventData.id}`);
      return eventData;
      
    } catch (error) {
      Logger.log(`Error adding event: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Update existing event
   */
  updateEvent(eventId, eventData) {
    try {
      const sheet = this.getEventsSheet();
      const data = sheet.getDataRange().getValues();
      
      // Find event row
      for (let i = 1; i < data.length; i++) {
        const event = this.rowToEvent(data[i], i + 1);
        if (event && event.id === eventId) {
          const updatedRow = this.eventToRow(eventData);
          sheet.getRange(i + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
          
          Logger.log(`Updated event: ${eventId}`);
          return eventData;
        }
      }
      
      throw new Error(`Event not found: ${eventId}`);
      
    } catch (error) {
      Logger.log(`Error updating event: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Delete event
   */
  deleteEvent(eventId) {
    try {
      const sheet = this.getEventsSheet();
      const data = sheet.getDataRange().getValues();
      
      // Find and delete event row
      for (let i = 1; i < data.length; i++) {
        const event = this.rowToEvent(data[i], i + 1);
        if (event && event.id === eventId) {
          sheet.deleteRow(i + 1);
          
          Logger.log(`Deleted event: ${eventId}`);
          return true;
        }
      }
      
      throw new Error(`Event not found: ${eventId}`);
      
    } catch (error) {
      Logger.log(`Error deleting event: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Test connection to sheets
   */
  testConnection() {
    try {
      const spreadsheet = SpreadsheetApp.openById(CONFIG.EVENTS_SHEET_ID);
      const sheet = spreadsheet.getSheetByName('Events');
      
      return {
        connected: true,
        sheetName: sheet ? sheet.getName() : 'Events sheet not found',
        rowCount: sheet ? sheet.getLastRow() : 0
      };
      
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }
};
