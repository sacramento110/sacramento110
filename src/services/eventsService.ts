/**
 * Events Service
 * Handles communication with Google Apps Script backend for events
 */

import { Event, EventFormData } from '@/types/event';
import { getConfig } from '@/config/production';

// Get configuration
const config = getConfig();

// Configuration
const API_CONFIG = {
  // Get from production config
  BASE_URL: config.BACKEND.API_URL,
  
  // Request timeout
  TIMEOUT: config.BACKEND.TIMEOUT,
  
  // Retry configuration
  MAX_RETRIES: config.BACKEND.MAX_RETRIES,
  RETRY_DELAY: 1000 // 1 second
};

class EventsService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Set authentication token for admin requests
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken() {
    this.authToken = null;
  }

  /**
   * Make API request with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = 0
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}?path=${encodeURIComponent(endpoint)}`;
      
      const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
          ...options.headers
        },
        ...options
      };

      // Add auth header if available
      if (this.authToken && endpoint.startsWith('/api/admin/')) {
        requestOptions.headers = {
          ...requestOptions.headers,
          'Authorization': `Bearer ${this.authToken}`
        };
      }

      // Set timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      try {
        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        return data;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }

    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);

      // Retry logic
      if (retries < API_CONFIG.MAX_RETRIES && this.shouldRetry(error)) {
        console.log(`Retrying request (${retries + 1}/${API_CONFIG.MAX_RETRIES})...`);
        await this.delay(API_CONFIG.RETRY_DELAY * (retries + 1));
        return this.makeRequest<T>(endpoint, options, retries + 1);
      }

      throw error;
    }
  }

  /**
   * Check if error should trigger a retry
   */
  private shouldRetry(error: any): boolean {
    if (error.name === 'AbortError') return false; // Don't retry timeouts
    if (error.message?.includes('401') || error.message?.includes('403')) return false; // Don't retry auth errors
    return true;
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get all active events (public endpoint)
   */
  async getActiveEvents(): Promise<{ events: Event[]; count: number }> {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        events: Event[];
        count: number;
      }>('/api/events');

      if (!response.success) {
        throw new Error('Failed to fetch events');
      }

      return {
        events: response.events || [],
        count: response.count || 0
      };
    } catch (error) {
      console.error('Error fetching active events:', error);
      return { events: [], count: 0 };
    }
  }

  /**
   * Get specific event by ID (public endpoint)
   */
  async getEventById(eventId: string): Promise<Event | null> {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        event: Event;
      }>(`/api/events/?id=${eventId}`);

      if (!response.success || !response.event) {
        return null;
      }

      return response.event;
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      return null;
    }
  }

  /**
   * Create new event (admin endpoint)
   */
  async createEvent(eventData: EventFormData): Promise<{ success: boolean; event?: Event; error?: string }> {
    try {
      if (!this.authToken) {
        throw new Error('Authentication required');
      }

      const response = await this.makeRequest<{
        success: boolean;
        event?: Event;
        error?: string;
      }>('/api/admin/events', {
        method: 'POST',
        body: JSON.stringify({ event: eventData })
      });

      return response;
    } catch (error) {
      console.error('Error creating event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create event'
      };
    }
  }

  /**
   * Update existing event (admin endpoint)
   */
  async updateEvent(eventId: string, eventData: EventFormData): Promise<{ success: boolean; event?: Event; error?: string }> {
    try {
      if (!this.authToken) {
        throw new Error('Authentication required');
      }

      const response = await this.makeRequest<{
        success: boolean;
        event?: Event;
        error?: string;
      }>(`/api/admin/events/?id=${eventId}`, {
        method: 'PUT',
        body: JSON.stringify({ event: eventData })
      });

      return response;
    } catch (error) {
      console.error('Error updating event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update event'
      };
    }
  }

  /**
   * Delete event (admin endpoint)
   */
  async deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.authToken) {
        throw new Error('Authentication required');
      }

      const response = await this.makeRequest<{
        success: boolean;
        error?: string;
      }>(`/api/admin/events/?id=${eventId}`, {
        method: 'DELETE'
      });

      return response;
    } catch (error) {
      console.error('Error deleting event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete event'
      };
    }
  }

  /**
   * Upload event image (admin endpoint)
   */
  async uploadEventImage(file: File): Promise<{ 
    success: boolean; 
    fileId?: string; 
    publicUrl?: string; 
    error?: string;
  }> {
    try {
      if (!this.authToken) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      formData.append('file', file);

      // Special handling for file upload
      const url = `${this.baseUrl}?path=${encodeURIComponent('/api/admin/events/upload')}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Origin': window.location.origin
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image'
      };
    }
  }

  /**
   * Get dashboard analytics (admin endpoint)
   */
  async getDashboardMetrics(): Promise<{ success: boolean; metrics?: any; error?: string }> {
    try {
      if (!this.authToken) {
        throw new Error('Authentication required');
      }

      const response = await this.makeRequest<{
        success: boolean;
        metrics?: any;
        error?: string;
      }>('/api/admin/analytics');

      return response;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch metrics'
      };
    }
  }

  /**
   * Get activity log (admin endpoint)
   */
  async getActivityLog(): Promise<{ success: boolean; activities?: any[]; error?: string }> {
    try {
      if (!this.authToken) {
        throw new Error('Authentication required');
      }

      const response = await this.makeRequest<{
        success: boolean;
        activities?: any[];
        error?: string;
      }>('/api/admin/activity');

      return response;
    } catch (error) {
      console.error('Error fetching activity log:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch activity log'
      };
    }
  }

  /**
   * Run manual cleanup (admin endpoint)
   */
  async runManualCleanup(): Promise<{ success: boolean; results?: any; error?: string }> {
    try {
      if (!this.authToken) {
        throw new Error('Authentication required');
      }

      const response = await this.makeRequest<{
        success: boolean;
        results?: any;
        error?: string;
      }>('/api/admin/cleanup', {
        method: 'POST'
      });

      return response;
    } catch (error) {
      console.error('Error running manual cleanup:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to run cleanup'
      };
    }
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ success: boolean }>('/api/events');
      return response.success;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get API configuration status
   */
  getConfigStatus(): { configured: boolean; issues: string[] } {
    const issues: string[] = [];

    if (API_CONFIG.BASE_URL === 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
      issues.push('Google Apps Script URL not configured');
    }

    return {
      configured: issues.length === 0,
      issues
    };
  }
}

// Export singleton instance
export const eventsService = new EventsService();
export default eventsService;
