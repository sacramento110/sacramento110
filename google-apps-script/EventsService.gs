/**
 * Events Service
 * Handles CRUD operations for events
 */

const EventsService = {
  
  /**
   * Get all active events (public endpoint)
   */
  getActiveEvents() {
    try {
      const events = SheetsService.getAllActiveEvents();
      
      // Filter and enhance events for frontend
      const activeEvents = events
        .filter(event => this.isEventUpcoming(event))
        .map(event => this.enhanceEventForFrontend(event));
      
      return {
        success: true,
        events: activeEvents,
        count: activeEvents.length,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      Logger.log(`Error getting active events: ${error.message}`);
      return {
        success: false,
        error: error.message,
        events: [],
        count: 0
      };
    }
  },
  
  /**
   * Get specific event by ID (public endpoint)
   */
  getEventById(eventId) {
    try {
      const event = SheetsService.getEventById(eventId);
      
      if (!event) {
        return {
          success: false,
          error: 'Event not found',
          event: null
        };
      }
      
      const enhancedEvent = this.enhanceEventForFrontend(event);
      
      return {
        success: true,
        event: enhancedEvent
      };
      
    } catch (error) {
      Logger.log(`Error getting event by ID: ${error.message}`);
      return {
        success: false,
        error: error.message,
        event: null
      };
    }
  },
  
  /**
   * Create new event (admin endpoint)
   */
  createEvent(e, authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'manage-events')) {
        throw new Error('Insufficient permissions to create events');
      }
      
      const postData = JSON.parse(e.postData.getDataAsString());
      const eventData = postData.event;
      
      // Validate required fields
      this.validateEventData(eventData);
      
      // Generate unique event ID
      eventData.id = this.generateEventId();
      eventData.createdBy = authResult.user.email;
      eventData.lastModifiedBy = authResult.user.email;
      eventData.status = 'active';
      eventData.isMultiDay = !!(eventData.dateEnd && eventData.dateEnd !== eventData.dateStart);
      
      // Add to sheets
      const savedEvent = SheetsService.addEvent(eventData);
      
      // Log activity
      ActivityLogger.logActivity('create', authResult.user.email, eventData.id, {
        title: eventData.title,
        dateStart: eventData.dateStart,
        dateEnd: eventData.dateEnd
      });
      
      return {
        success: true,
        event: savedEvent,
        message: 'Event created successfully'
      };
      
    } catch (error) {
      Logger.log(`Error creating event: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Update existing event (admin endpoint)
   */
  updateEvent(eventId, e, authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'manage-events')) {
        throw new Error('Insufficient permissions to update events');
      }
      
      const postData = JSON.parse(e.postData.getDataAsString());
      const eventData = postData.event;
      
      // Get existing event
      const existingEvent = SheetsService.getEventById(eventId);
      if (!existingEvent) {
        throw new Error('Event not found');
      }
      
      // Validate updated data
      this.validateEventData(eventData);
      
      // Preserve creation data
      eventData.id = eventId;
      eventData.createdBy = existingEvent.createdBy;
      eventData.createdAt = existingEvent.createdAt;
      eventData.lastModifiedBy = authResult.user.email;
      eventData.isMultiDay = !!(eventData.dateEnd && eventData.dateEnd !== eventData.dateStart);
      
      // Update in sheets
      const updatedEvent = SheetsService.updateEvent(eventId, eventData);
      
      // Log activity
      ActivityLogger.logActivity('update', authResult.user.email, eventId, {
        title: eventData.title,
        changes: this.getEventChanges(existingEvent, eventData)
      });
      
      return {
        success: true,
        event: updatedEvent,
        message: 'Event updated successfully'
      };
      
    } catch (error) {
      Logger.log(`Error updating event: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Delete event (admin endpoint)
   */
  deleteEvent(eventId, authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'delete-events')) {
        throw new Error('Insufficient permissions to delete events');
      }
      
      // Get existing event for logging
      const existingEvent = SheetsService.getEventById(eventId);
      if (!existingEvent) {
        throw new Error('Event not found');
      }
      
      // Delete from sheets
      SheetsService.deleteEvent(eventId);
      
      // Delete associated image from Drive
      if (existingEvent.imageDriveId) {
        try {
          DriveService.deleteEventImage(existingEvent.imageDriveId);
        } catch (driveError) {
          Logger.log(`Warning: Could not delete image: ${driveError.message}`);
        }
      }
      
      // Log activity
      ActivityLogger.logActivity('delete', authResult.user.email, eventId, {
        title: existingEvent.title,
        dateStart: existingEvent.dateStart
      });
      
      return {
        success: true,
        message: 'Event deleted successfully'
      };
      
    } catch (error) {
      Logger.log(`Error deleting event: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Generate unique event ID
   */
  generateEventId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `event-${timestamp}-${random}`;
  },
  
  /**
   * Validate event data
   */
  validateEventData(eventData) {
    const required = ['title', 'description', 'dateStart', 'time', 'speaker', 'location', 'hostedBy'];
    
    for (const field of required) {
      if (!eventData[field] || eventData[field].trim() === '') {
        throw new Error(`${field} is required`);
      }
    }
    
    // Validate dates
    const startDate = new Date(eventData.dateStart);
    if (isNaN(startDate.getTime())) {
      throw new Error('Invalid start date format');
    }
    
    if (eventData.dateEnd) {
      const endDate = new Date(eventData.dateEnd);
      if (isNaN(endDate.getTime())) {
        throw new Error('Invalid end date format');
      }
      
      if (endDate < startDate) {
        throw new Error('End date must be after start date');
      }
    }
    
    // Validate time format (basic)
    if (!/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(eventData.time)) {
      throw new Error('Time must be in format "H:MM AM/PM"');
    }
    
    return true;
  },
  
  /**
   * Check if event is upcoming
   */
  isEventUpcoming(event) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventEndDate = event.dateEnd ? new Date(event.dateEnd) : new Date(event.dateStart);
    eventEndDate.setHours(23, 59, 59, 999);
    
    return eventEndDate >= today;
  },
  
  /**
   * Enhance event with calculated fields for frontend
   */
  enhanceEventForFrontend(event) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startDate = new Date(event.dateStart);
    startDate.setHours(0, 0, 0, 0);
    
    // Calculate status flags
    event.isToday = this.isEventToday(event.dateStart, event.dateEnd);
    event.isTomorrow = tomorrow.getTime() === startDate.getTime();
    event.isUpcoming = this.isEventUpcoming(event);
    event.daysRemaining = this.getDaysRemaining(event.dateStart, event.dateEnd);
    
    return event;
  },
  
  /**
   * Check if event is happening today
   */
  isEventToday(dateStart, dateEnd) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(dateStart);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = dateEnd ? new Date(dateEnd) : startDate;
    endDate.setHours(23, 59, 59, 999);
    
    return today >= startDate && today <= endDate;
  },
  
  /**
   * Get remaining days for multi-day events
   */
  getDaysRemaining(dateStart, dateEnd) {
    if (!dateEnd) return undefined;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(dateStart);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(dateEnd);
    endDate.setHours(23, 59, 59, 999);
    
    // If event hasn't started yet, return undefined
    if (today < startDate) return undefined;
    
    // If event has ended, return undefined
    if (today > endDate) return undefined;
    
    // Calculate days remaining (including today)
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
  
  /**
   * Get changes between old and new event data
   */
  getEventChanges(oldEvent, newEvent) {
    const changes = {};
    const fields = ['title', 'description', 'dateStart', 'dateEnd', 'time', 'speaker', 'location', 'hostedBy'];
    
    for (const field of fields) {
      if (oldEvent[field] !== newEvent[field]) {
        changes[field] = {
          from: oldEvent[field],
          to: newEvent[field]
        };
      }
    }
    
    return changes;
  },
  
  /**
   * Get events for admin dashboard
   */
  getEventsForAdmin(authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'view-analytics')) {
        throw new Error('Insufficient permissions to view events');
      }
      
      const allEvents = SheetsService.getAllActiveEvents();
      const enhancedEvents = allEvents.map(event => this.enhanceEventForFrontend(event));
      
      return {
        success: true,
        events: enhancedEvents,
        count: enhancedEvents.length
      };
      
    } catch (error) {
      Logger.log(`Error getting events for admin: ${error.message}`);
      return {
        success: false,
        error: error.message,
        events: [],
        count: 0
      };
    }
  }
};
