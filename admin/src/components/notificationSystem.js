/**
 * Notification System
 * Admin notification system for important events and alerts
 */

export class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.listeners = [];
        this.settings = {
            enableSound: true,
            enableBrowserNotifications: true,
            autoHide: true,
            autoHideDelay: 5000,
            position: 'top-right'
        };
        
        this.notificationTypes = {
            info: { color: 'blue', icon: 'info' },
            success: { color: 'green', icon: 'check' },
            warning: { color: 'yellow', icon: 'warning' },
            error: { color: 'red', icon: 'error' },
            system: { color: 'purple', icon: 'system' }
        };

        this.initialize();
    }

    /**
     * Initialize notification system
     */
    initialize() {
        this.createNotificationContainer();
        this.requestBrowserPermission();
        this.startPeriodicChecks();
    }

    /**
     * Create notification container in DOM
     */
    createNotificationContainer() {
        if (document.getElementById('notification-container')) return;

        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = `fixed ${this.getPositionClasses()} z-50 max-w-sm w-full pointer-events-none`;
        document.body.appendChild(container);
    }

    /**
     * Get position classes based on settings
     */
    getPositionClasses() {
        const positions = {
            'top-right': 'top-4 right-4',
            'top-left': 'top-4 left-4',
            'bottom-right': 'bottom-4 right-4',
            'bottom-left': 'bottom-4 left-4',
            'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
            'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
        };
        return positions[this.settings.position] || positions['top-right'];
    }

    /**
     * Show notification
     */
    show(message, type = 'info', options = {}) {
        const notification = {
            id: this.generateId(),
            message,
            type,
            timestamp: new Date(),
            ...options
        };

        this.notifications.unshift(notification);
        this.renderNotification(notification);
        
        if (this.settings.enableBrowserNotifications) {
            this.showBrowserNotification(notification);
        }
        
        if (this.settings.enableSound) {
            this.playNotificationSound(type);
        }

        // Auto hide if enabled
        if (this.settings.autoHide && !options.persistent) {
            setTimeout(() => {
                this.hide(notification.id);
            }, options.duration || this.settings.autoHideDelay);
        }

        // Notify listeners
        this.notifyListeners('notification-added', notification);

        return notification.id;
    }

    /**
     * Render notification in DOM
     */
    renderNotification(notification) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const { color, icon } = this.notificationTypes[notification.type];
        
        const notificationElement = document.createElement('div');
        notificationElement.id = `notification-${notification.id}`;
        notificationElement.className = `notification-item mb-4 pointer-events-auto transform transition-all duration-300 ease-out translate-x-full opacity-0`;
        
        notificationElement.innerHTML = `
            <div class="bg-white border-l-4 border-${color}-500 rounded-lg shadow-lg max-w-sm">
                <div class="p-4">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            ${this.getNotificationIcon(icon, color)}
                        </div>
                        <div class="ml-3 flex-1">
                            ${notification.title ? `<h4 class="text-sm font-semibold text-gray-800 mb-1">${notification.title}</h4>` : ''}
                            <p class="text-sm text-gray-600">${notification.message}</p>
                            ${notification.actions ? this.renderNotificationActions(notification.actions) : ''}
                        </div>
                        <div class="ml-4 flex-shrink-0">
                            <button 
                                class="notification-close text-gray-400 hover:text-gray-600 transition-colors"
                                onclick="notificationSystem.hide('${notification.id}')"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    ${notification.timestamp ? `
                        <div class="mt-2 text-xs text-gray-500">
                            ${this.formatTimestamp(notification.timestamp)}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        container.insertBefore(notificationElement, container.firstChild);

        // Animate in
        setTimeout(() => {
            notificationElement.classList.remove('translate-x-full', 'opacity-0');
        }, 50);
    }

    /**
     * Get notification icon SVG
     */
    getNotificationIcon(icon, color) {
        const icons = {
            info: `<svg class="w-5 h-5 text-${color}-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`,
            success: `<svg class="w-5 h-5 text-${color}-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`,
            warning: `<svg class="w-5 h-5 text-${color}-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>`,
            error: `<svg class="w-5 h-5 text-${color}-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`,
            system: `<svg class="w-5 h-5 text-${color}-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>`
        };
        return icons[icon] || icons.info;
    }

    /**
     * Render notification actions
     */
    renderNotificationActions(actions) {
        if (!actions || actions.length === 0) return '';

        return `
            <div class="mt-3 flex space-x-2">
                ${actions.map(action => `
                    <button 
                        class="text-xs px-3 py-1 rounded-md font-medium ${action.primary ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors"
                        onclick="${action.handler}"
                    >
                        ${action.label}
                    </button>
                `).join('')}
            </div>
        `;
    }

    /**
     * Hide notification
     */
    hide(notificationId) {
        const element = document.getElementById(`notification-${notificationId}`);
        if (!element) return;

        element.classList.add('translate-x-full', 'opacity-0');
        
        setTimeout(() => {
            element.remove();
            this.notifications = this.notifications.filter(n => n.id !== notificationId);
            this.notifyListeners('notification-removed', notificationId);
        }, 300);
    }

    /**
     * Clear all notifications
     */
    clearAll() {
        const container = document.getElementById('notification-container');
        if (container) {
            container.innerHTML = '';
        }
        this.notifications = [];
        this.notifyListeners('notifications-cleared');
    }

    /**
     * Show browser notification
     */
    showBrowserNotification(notification) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const browserNotification = new Notification(notification.title || 'SSMA Admin', {
                body: notification.message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: notification.id
            });

            browserNotification.onclick = () => {
                window.focus();
                browserNotification.close();
            };

            setTimeout(() => {
                browserNotification.close();
            }, 5000);
        }
    }

    /**
     * Request browser notification permission
     */
    async requestBrowserPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    this.show('Browser notifications enabled', 'success');
                }
            } catch (error) {
                console.warn('Browser notifications not supported');
            }
        }
    }

    /**
     * Play notification sound
     */
    playNotificationSound(type) {
        try {
            // Create audio context for different notification sounds
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Different frequencies for different notification types
            const frequencies = {
                info: 440,      // A note
                success: 523,   // C note
                warning: 370,   // F# note
                error: 294,     // D note
                system: 659     // E note
            };

            oscillator.frequency.setValueAtTime(frequencies[type] || frequencies.info, audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            // Fallback for browsers without Web Audio API
            console.warn('Audio notifications not supported');
        }
    }

    /**
     * Start periodic system checks
     */
    startPeriodicChecks() {
        // Check for important system events every minute
        setInterval(() => {
            this.checkSystemHealth();
            this.checkUpcomingEvents();
            this.checkFailedOperations();
        }, 60000); // 1 minute
    }

    /**
     * Check system health and notify of issues
     */
    async checkSystemHealth() {
        try {
            // This would typically call your backend health check
            // For now, we'll simulate some checks
            const healthChecks = [
                { name: 'Google Sheets API', status: 'healthy' },
                { name: 'Google Drive API', status: 'healthy' },
                { name: 'Authentication Service', status: 'healthy' }
            ];

            const unhealthyServices = healthChecks.filter(check => check.status !== 'healthy');
            
            if (unhealthyServices.length > 0) {
                this.show(
                    `${unhealthyServices.length} service(s) are experiencing issues`,
                    'warning',
                    {
                        title: 'System Health Alert',
                        persistent: true,
                        actions: [
                            {
                                label: 'View Details',
                                handler: 'app.navigate("settings")',
                                primary: true
                            },
                            {
                                label: 'Dismiss',
                                handler: `notificationSystem.hide('${this.generateId()}')`
                            }
                        ]
                    }
                );
            }
        } catch (error) {
            console.error('Health check failed:', error);
        }
    }

    /**
     * Check for upcoming events and notify
     */
    async checkUpcomingEvents() {
        try {
            // This would typically fetch upcoming events from your backend
            // Notify about events starting soon, etc.
        } catch (error) {
            console.error('Event check failed:', error);
        }
    }

    /**
     * Check for failed operations
     */
    async checkFailedOperations() {
        try {
            // Check for failed uploads, deletions, etc.
            // Notify admins of operations that need attention
        } catch (error) {
            console.error('Operation check failed:', error);
        }
    }

    /**
     * Utility methods
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatTimestamp(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        
        if (diff < 60000) { // Less than 1 minute
            return 'Just now';
        } else if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diff < 86400000) { // Less than 1 day
            const hours = Math.floor(diff / 3600000);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            return timestamp.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    /**
     * Event listener management
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    notifyListeners(event, data) {
        this.listeners.forEach(listener => {
            try {
                listener(event, data);
            } catch (error) {
                console.error('Notification listener error:', error);
            }
        });
    }

    /**
     * Settings management
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        
        // Update container position if changed
        const container = document.getElementById('notification-container');
        if (container) {
            container.className = `fixed ${this.getPositionClasses()} z-50 max-w-sm w-full pointer-events-none`;
        }
    }

    getSettings() {
        return { ...this.settings };
    }

    /**
     * Predefined notification methods
     */
    info(message, options = {}) {
        return this.show(message, 'info', options);
    }

    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }

    error(message, options = {}) {
        return this.show(message, 'error', { ...options, persistent: true });
    }

    system(message, options = {}) {
        return this.show(message, 'system', options);
    }

    /**
     * Destroy notification system
     */
    destroy() {
        this.clearAll();
        const container = document.getElementById('notification-container');
        if (container) {
            container.remove();
        }
        this.listeners = [];
    }
}

// Create global instance
window.notificationSystem = new NotificationSystem();
