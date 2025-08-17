/**
 * Events Service for Admin Portal
 * Handles communication with Google Apps Script backend
 */

export class EventsService {
    constructor() {
        this.config = {
            // Replace with your actual Google Apps Script URL
            baseUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
            timeout: 30000, // 30 seconds
            maxRetries: 3,
            retryDelay: 1000 // 1 second
        };
        
        this.authToken = null;
    }

    /**
     * Set authentication token
     */
    setAuthToken(token) {
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
    async makeRequest(endpoint, options = {}, retries = 0) {
        try {
            const url = `${this.config.baseUrl}?path=${encodeURIComponent(endpoint)}`;
            
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': window.location.origin,
                    ...options.headers
                },
                ...options
            };

            // Add auth header if available and endpoint requires it
            if (this.authToken && endpoint.startsWith('/api/admin/')) {
                requestOptions.headers = {
                    ...requestOptions.headers,
                    'Authorization': `Bearer ${this.authToken}`
                };
            }

            // Set timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

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
            if (retries < this.config.maxRetries && this.shouldRetry(error)) {
                console.log(`Retrying request (${retries + 1}/${this.config.maxRetries})...`);
                await this.delay(this.config.retryDelay * (retries + 1));
                return this.makeRequest(endpoint, options, retries + 1);
            }

            throw error;
        }
    }

    /**
     * Check if error should trigger a retry
     */
    shouldRetry(error) {
        if (error.name === 'AbortError') return false; // Don't retry timeouts
        if (error.message?.includes('401') || error.message?.includes('403')) return false; // Don't retry auth errors
        return true;
    }

    /**
     * Delay utility for retries
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get dashboard metrics
     */
    async getDashboardMetrics() {
        try {
            const response = await this.makeRequest('/api/admin/analytics');
            return response;
        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
            return {
                success: false,
                error: error.message,
                metrics: null
            };
        }
    }

    /**
     * Get all events for admin
     */
    async getEvents() {
        try {
            const response = await this.makeRequest('/api/admin/events');
            return response;
        } catch (error) {
            console.error('Error fetching events:', error);
            return {
                success: false,
                error: error.message,
                events: [],
                count: 0
            };
        }
    }

    /**
     * Create new event
     */
    async createEvent(eventData) {
        try {
            const response = await this.makeRequest('/api/admin/events', {
                method: 'POST',
                body: JSON.stringify({ event: eventData })
            });
            return response;
        } catch (error) {
            console.error('Error creating event:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update event
     */
    async updateEvent(eventId, eventData) {
        try {
            const response = await this.makeRequest(`/api/admin/events/?id=${eventId}`, {
                method: 'PUT',
                body: JSON.stringify({ event: eventData })
            });
            return response;
        } catch (error) {
            console.error('Error updating event:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete event
     */
    async deleteEvent(eventId) {
        try {
            const response = await this.makeRequest(`/api/admin/events/?id=${eventId}`, {
                method: 'DELETE'
            });
            return response;
        } catch (error) {
            console.error('Error deleting event:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Upload event image
     */
    async uploadEventImage(file) {
        try {
            if (!this.authToken) {
                throw new Error('Authentication required');
            }

            const formData = new FormData();
            formData.append('file', file);

            const url = `${this.config.baseUrl}?path=${encodeURIComponent('/api/admin/events/upload')}`;
            
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
                error: error.message
            };
        }
    }

    /**
     * Get activity log
     */
    async getActivityLog() {
        try {
            const response = await this.makeRequest('/api/admin/activity');
            return response;
        } catch (error) {
            console.error('Error fetching activity log:', error);
            return {
                success: false,
                error: error.message,
                activities: []
            };
        }
    }

    /**
     * Get admin users
     */
    async getAdminUsers() {
        try {
            const response = await this.makeRequest('/api/admin/users');
            return response;
        } catch (error) {
            console.error('Error fetching admin users:', error);
            return {
                success: false,
                error: error.message,
                users: []
            };
        }
    }

    /**
     * Add admin user
     */
    async addAdminUser(userData) {
        try {
            const response = await this.makeRequest('/api/admin/users', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            return response;
        } catch (error) {
            console.error('Error adding admin user:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Remove admin user
     */
    async removeAdminUser(email) {
        try {
            const response = await this.makeRequest(`/api/admin/users/?email=${encodeURIComponent(email)}`, {
                method: 'DELETE'
            });
            return response;
        } catch (error) {
            console.error('Error removing admin user:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Run manual cleanup
     */
    async runManualCleanup() {
        try {
            const response = await this.makeRequest('/api/admin/cleanup', {
                method: 'POST'
            });
            return response;
        } catch (error) {
            console.error('Error running cleanup:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Test API connection
     */
    async testConnection() {
        try {
            const response = await this.makeRequest('/api/events');
            return response.success;
        } catch (error) {
            console.error('API connection test failed:', error);
            return false;
        }
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    }

    /**
     * Format event date range
     */
    formatEventDateRange(dateStart, dateEnd) {
        if (!dateEnd || dateStart === dateEnd) {
            return this.formatDate(dateStart);
        }
        
        const start = new Date(dateStart);
        const end = new Date(dateEnd);
        
        if (start.getFullYear() === end.getFullYear()) {
            if (start.getMonth() === end.getMonth()) {
                return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${end.getDate()}, ${start.getFullYear()}`;
            }
            return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
        }
        
        return `${this.formatDate(dateStart)} - ${this.formatDate(dateEnd)}`;
    }

    /**
     * Get configuration status
     */
    getConfigStatus() {
        const issues = [];

        if (this.config.baseUrl === 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
            issues.push('Google Apps Script URL not configured');
        }

        return {
            configured: issues.length === 0,
            issues
        };
    }
}
