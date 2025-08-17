/**
 * Dashboard Page
 * Comprehensive analytics and overview with enhanced visualizations
 */

import { ChartRenderer, AnalyticsProcessor } from '../components/charts.js';

export class DashboardPage {
    constructor() {
        this.metrics = null;
        this.refreshInterval = null;
        this.chartRenderer = new ChartRenderer();
    }

    async render(user, eventsService) {
        return `
            <div class="space-y-6">
                <!-- Quick Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div id="stats-today" class="metric-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-admin-600">Today's Events</p>
                                <p class="text-3xl font-bold text-admin-900" id="today-count">-</p>
                            </div>
                            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div id="stats-tomorrow" class="metric-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-admin-600">Tomorrow's Events</p>
                                <p class="text-3xl font-bold text-admin-900" id="tomorrow-count">-</p>
                            </div>
                            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div id="stats-week" class="metric-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-admin-600">This Week</p>
                                <p class="text-3xl font-bold text-admin-900" id="week-count">-</p>
                            </div>
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div id="stats-total" class="metric-card">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-admin-600">Total Active</p>
                                <p class="text-3xl font-bold text-admin-900" id="total-count">-</p>
                            </div>
                            <div class="w-12 h-12 bg-islamic-green-100 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-islamic-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Today's Events -->
                    <div class="lg:col-span-2">
                        <div class="admin-card">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-lg font-semibold text-admin-900">Today's Events</h3>
                                <button id="refresh-btn" class="btn-secondary text-sm">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Refresh
                                </button>
                            </div>
                            <div id="todays-events">
                                <div class="animate-pulse space-y-4">
                                    <div class="h-4 bg-admin-200 rounded w-3/4"></div>
                                    <div class="h-4 bg-admin-200 rounded w-1/2"></div>
                                    <div class="h-4 bg-admin-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- System Health -->
                    <div class="space-y-6">
                        <!-- System Status -->
                        <div class="admin-card">
                            <h3 class="text-lg font-semibold text-admin-900 mb-4">System Health</h3>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Backend API</span>
                                    <span id="api-status" class="px-2 py-1 text-xs rounded-full bg-admin-100 text-admin-600">Checking...</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Google Sheets</span>
                                    <span id="sheets-status" class="px-2 py-1 text-xs rounded-full bg-admin-100 text-admin-600">Checking...</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Google Drive</span>
                                    <span id="drive-status" class="px-2 py-1 text-xs rounded-full bg-admin-100 text-admin-600">Checking...</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Auto Cleanup</span>
                                    <span id="cleanup-status" class="px-2 py-1 text-xs rounded-full bg-admin-100 text-admin-600">Checking...</span>
                                </div>
                            </div>
                        </div>

                        <!-- Quick Actions -->
                        <div class="admin-card">
                            <h3 class="text-lg font-semibold text-admin-900 mb-4">Quick Actions</h3>
                            <div class="space-y-3">
                                <button id="add-event-btn" class="w-full btn-primary text-left">
                                    <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Add New Event
                                </button>
                                <button id="view-events-btn" class="w-full btn-secondary text-left">
                                    <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    Manage Events
                                </button>
                                ${user.permissions && user.permissions.includes('manual-cleanup') ? `
                                <button id="run-cleanup-btn" class="w-full btn-secondary text-left">
                                    <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Run Cleanup
                                </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity & Analytics -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Recent Activity -->
                    <div class="admin-card">
                        <h3 class="text-lg font-semibold text-admin-900 mb-4">Recent Activity</h3>
                        <div id="recent-activity">
                            <div class="animate-pulse space-y-3">
                                <div class="flex space-x-3">
                                    <div class="w-8 h-8 bg-admin-200 rounded-full"></div>
                                    <div class="flex-1 space-y-2">
                                        <div class="h-4 bg-admin-200 rounded w-3/4"></div>
                                        <div class="h-3 bg-admin-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div class="flex space-x-3">
                                    <div class="w-8 h-8 bg-admin-200 rounded-full"></div>
                                    <div class="flex-1 space-y-2">
                                        <div class="h-4 bg-admin-200 rounded w-2/3"></div>
                                        <div class="h-3 bg-admin-200 rounded w-1/3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Top Speakers -->
                    <div class="admin-card">
                        <h3 class="text-lg font-semibold text-admin-900 mb-4">Top Speakers</h3>
                        <div id="top-speakers">
                            <div class="animate-pulse space-y-3">
                                <div class="flex items-center justify-between">
                                    <div class="h-4 bg-admin-200 rounded w-1/2"></div>
                                    <div class="h-4 bg-admin-200 rounded w-8"></div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="h-4 bg-admin-200 rounded w-2/3"></div>
                                    <div class="h-4 bg-admin-200 rounded w-8"></div>
                                </div>
                                <div class="flex items-center justify-between">
                                    <div class="h-4 bg-admin-200 rounded w-1/3"></div>
                                    <div class="h-4 bg-admin-200 rounded w-8"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Advanced Analytics Charts -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Events Trends Chart -->
                    <div class="admin-card">
                        <h3 class="text-lg font-semibold text-admin-900 mb-4">Events Over Time</h3>
                        <div id="events-trend-chart" class="h-64"></div>
                    </div>

                    <!-- Activity Breakdown Pie Chart -->
                    <div class="admin-card">
                        <h3 class="text-lg font-semibold text-admin-900 mb-4">Activity Breakdown</h3>
                        <div id="activity-pie-chart" class="h-64 flex items-center justify-center"></div>
                    </div>
                </div>

                <!-- Performance Metrics -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div id="storage-metric-card"></div>
                    <div id="images-metric-card"></div>
                    <div id="users-metric-card"></div>
                    <div id="cleanup-metric-card"></div>
                </div>

                <!-- Additional Analytics -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Top Speakers Chart -->
                    <div class="admin-card">
                        <h3 class="text-lg font-semibold text-admin-900 mb-4">Top Speakers</h3>
                        <div id="speakers-chart"></div>
                    </div>

                    <!-- Event Locations Chart -->
                    <div class="admin-card">
                        <h3 class="text-lg font-semibold text-admin-900 mb-4">Popular Locations</h3>
                        <div id="locations-chart"></div>
                    </div>

                    <!-- System Health Ring -->
                    <div class="admin-card">
                        <h3 class="text-lg font-semibold text-admin-900 mb-4">System Health</h3>
                        <div id="system-health-ring" class="flex items-center justify-center h-40"></div>
                    </div>
                </div>
            </div>
        `;
    }

    async initialize(user, eventsService) {
        this.user = user;
        this.eventsService = eventsService;
        
        // Load initial data
        await this.loadDashboardData();
        
        // Set up auto-refresh
        this.refreshInterval = setInterval(() => {
            this.loadDashboardData();
        }, 60000); // Refresh every minute
        
        this.setupEventListeners();
    }

    async loadDashboardData() {
        try {
            const result = await this.eventsService.getDashboardMetrics();
            
            if (result.success && result.metrics) {
                this.metrics = result.metrics;
                this.updateDashboard();
            } else {
                console.error('Failed to load dashboard metrics:', result.error);
                this.showError(result.error || 'Failed to load dashboard data');
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showError('Unable to connect to backend');
        }
    }

    updateDashboard() {
        if (!this.metrics) return;

        // Update overview stats
        this.updateElement('today-count', this.metrics.overview?.eventsToday?.length || 0);
        this.updateElement('tomorrow-count', this.metrics.overview?.eventsTomorrow?.length || 0);
        this.updateElement('week-count', this.metrics.overview?.eventsThisWeek?.length || 0);
        this.updateElement('total-count', this.metrics.overview?.totalActiveEvents || 0);

        // Update system health
        this.updateSystemHealth();

        // Update today's events
        this.updateTodaysEvents();

        // Update recent activity
        this.updateRecentActivity();

        // Update top speakers
        this.updateTopSpeakers();

        // Render enhanced charts and metrics
        this.renderAdvancedCharts();
    }

    updateSystemHealth() {
        const system = this.metrics.system;
        
        this.updateStatus('api-status', system?.overallStatus === 'healthy');
        this.updateStatus('sheets-status', system?.services?.sheets?.connected);
        this.updateStatus('drive-status', system?.services?.drive?.connected);
        this.updateStatus('cleanup-status', system?.triggers?.cleanupTrigger?.enabled);
    }

    updateStatus(elementId, isHealthy) {
        const element = document.getElementById(elementId);
        if (element) {
            if (isHealthy) {
                element.textContent = 'Healthy';
                element.className = 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800';
            } else {
                element.textContent = 'Issue';
                element.className = 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800';
            }
        }
    }

    updateTodaysEvents() {
        const container = document.getElementById('todays-events');
        const todaysEvents = this.metrics.overview?.eventsToday || [];
        
        if (todaysEvents.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-admin-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p class="text-admin-600">No events scheduled for today</p>
                </div>
            `;
        } else {
            container.innerHTML = todaysEvents.map(event => `
                <div class="flex items-center justify-between py-3 border-b border-admin-100 last:border-b-0">
                    <div>
                        <p class="font-medium text-admin-900">${event.title}</p>
                        <p class="text-sm text-admin-600">${event.time} • ${event.speaker}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Today</span>
                    </div>
                </div>
            `).join('');
        }
    }

    updateRecentActivity() {
        const container = document.getElementById('recent-activity');
        const activities = this.metrics.activity?.recentActions || [];
        
        if (activities.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-admin-600">No recent activity</p>
                </div>
            `;
        } else {
            container.innerHTML = activities.slice(0, 5).map(activity => {
                const icon = this.getActivityIcon(activity.action);
                const timeAgo = this.getTimeAgo(activity.timestamp);
                
                return `
                    <div class="flex items-start space-x-3 py-2">
                        <div class="flex-shrink-0">
                            ${icon}
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm text-admin-900">${this.getActivityDescription(activity)}</p>
                            <p class="text-xs text-admin-600">${timeAgo}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    updateTopSpeakers() {
        const container = document.getElementById('top-speakers');
        const speakers = this.metrics.events?.topSpeakers || [];
        
        if (speakers.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-admin-600">No speaker data available</p>
                </div>
            `;
        } else {
            container.innerHTML = speakers.slice(0, 5).map((speaker, index) => `
                <div class="flex items-center justify-between py-2">
                    <div class="flex items-center space-x-3">
                        <span class="w-6 h-6 bg-islamic-green-100 text-islamic-green-800 rounded-full flex items-center justify-center text-xs font-medium">
                            ${index + 1}
                        </span>
                        <span class="text-sm text-admin-900">${speaker.name}</span>
                    </div>
                    <span class="text-sm font-medium text-admin-600">${speaker.eventCount}</span>
                </div>
            `).join('');
        }
    }

    updateStorageMetrics() {
        const storage = this.metrics.storage;
        const users = this.metrics.users;
        
        this.updateElement('storage-used', storage?.formattedSize || '0 MB');
        this.updateElement('total-images', storage?.totalFiles || 0);
        this.updateElement('active-users', users?.activeUsers || 0);
        this.updateElement('last-cleanup', this.formatLastCleanup());
    }

    formatLastCleanup() {
        // This would come from the cleanup metrics
        return 'Today'; // Placeholder
    }

    getActivityIcon(action) {
        const icons = {
            login: '<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg></div>',
            create: '<div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></div>',
            update: '<div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></div>',
            delete: '<div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"><svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></div>'
        };
        return icons[action] || icons.create;
    }

    getActivityDescription(activity) {
        const descriptions = {
            login: `${activity.adminEmail} signed in`,
            create: `${activity.adminEmail} created an event`,
            update: `${activity.adminEmail} updated an event`,
            delete: `${activity.adminEmail} deleted an event`,
            upload: `${activity.adminEmail} uploaded an image`
        };
        return descriptions[activity.action] || `${activity.adminEmail} performed ${activity.action}`;
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return time.toLocaleDateString();
    }

    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadDashboardData());
        }

        // Quick action buttons
        const addEventBtn = document.getElementById('add-event-btn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => {
                // Navigate to events page with add mode
                window.adminApp.navigateToPage('events');
            });
        }

        const viewEventsBtn = document.getElementById('view-events-btn');
        if (viewEventsBtn) {
            viewEventsBtn.addEventListener('click', () => {
                window.adminApp.navigateToPage('events');
            });
        }

        const runCleanupBtn = document.getElementById('run-cleanup-btn');
        if (runCleanupBtn) {
            runCleanupBtn.addEventListener('click', () => this.runCleanup());
        }
    }

    async runCleanup() {
        if (!confirm('Are you sure you want to run cleanup now? This will remove past events and their images.')) {
            return;
        }

        try {
            const result = await this.eventsService.runManualCleanup();
            
            if (result.success) {
                alert(`Cleanup completed successfully. Archived ${result.results?.eventsArchived || 0} events.`);
                this.loadDashboardData(); // Refresh data
            } else {
                alert(`Cleanup failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Error running cleanup:', error);
            alert('Failed to run cleanup. Please try again.');
        }
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    showError(message) {
        console.error('Dashboard error:', message);
        // Could show a toast notification here
    }

    renderAdvancedCharts() {
        if (!this.metrics) return;

        // Process data for charts
        const events = this.metrics.events || {};
        const activity = this.metrics.activity || {};
        const storage = this.metrics.storage || {};
        const users = this.metrics.users || {};
        const system = this.metrics.system || {};

        // 1. Events Trend Chart
        if (events.monthlyTrend) {
            this.chartRenderer.createLineChart('events-trend-chart', events.monthlyTrend, {
                title: '',
                color: '#22c55e',
                width: 500,
                height: 200,
                showDots: true,
                showGrid: true
            });
        }

        // 2. Activity Breakdown Pie Chart
        if (activity.actionCounts) {
            const activityData = Object.entries(activity.actionCounts).map(([action, count]) => ({
                label: this.formatAction(action),
                value: count
            }));
            
            this.chartRenderer.createPieChart('activity-pie-chart', activityData, {
                size: 200,
                colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
                showLegend: true
            });
        }

        // 3. Top Speakers Bar Chart
        if (events.topSpeakers) {
            this.chartRenderer.createBarChart('speakers-chart', events.topSpeakers, {
                color: '#3b82f6',
                maxHeight: 150,
                showValues: true,
                animate: true
            });
        }

        // 4. Event Locations Bar Chart
        if (events.eventsByLocation) {
            this.chartRenderer.createBarChart('locations-chart', events.eventsByLocation, {
                color: '#f59e0b',
                maxHeight: 150,
                showValues: true,
                animate: true
            });
        }

        // 5. System Health Progress Ring
        const healthPercentage = this.calculateSystemHealthPercentage(system);
        this.chartRenderer.createProgressRing('system-health-ring', healthPercentage, {
            size: 120,
            strokeWidth: 10,
            color: healthPercentage > 80 ? '#22c55e' : healthPercentage > 60 ? '#f59e0b' : '#ef4444',
            backgroundColor: '#e5e7eb',
            showPercentage: true,
            label: 'System Health'
        });

        // 6. Enhanced Metric Cards
        this.renderMetricCards(storage, users, system);
    }

    renderMetricCards(storage, users, system) {
        // Storage Metric Card
        this.chartRenderer.createMetricCard('storage-metric-card', {
            title: 'Storage Used',
            value: this.parseStorageSize(storage?.formattedSize || '0 MB'),
            format: 'storage',
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M7 8h10M7 8l4 4 4-4"></path>
            </svg>`,
            color: 'purple'
        });

        // Images Metric Card
        this.chartRenderer.createMetricCard('images-metric-card', {
            title: 'Total Images',
            value: storage?.totalFiles || 0,
            format: 'number',
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>`,
            color: 'blue'
        });

        // Users Metric Card
        this.chartRenderer.createMetricCard('users-metric-card', {
            title: 'Active Users',
            value: users?.activeUsers || 0,
            format: 'number',
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>`,
            color: 'green'
        });

        // Cleanup Metric Card
        this.chartRenderer.createMetricCard('cleanup-metric-card', {
            title: 'Last Cleanup',
            value: 'Today',
            format: 'text',
            icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`,
            color: 'green'
        });
    }

    calculateSystemHealthPercentage(system) {
        if (!system || !system.services) return 0;
        
        const services = system.services;
        const config = system.config || {};
        
        let healthyCount = 0;
        let totalCount = 0;
        
        // Check services
        if (services.sheets?.connected) healthyCount++;
        totalCount++;
        
        if (services.drive?.connected) healthyCount++;
        totalCount++;
        
        if (services.auth?.hasOAuthClientId) healthyCount++;
        totalCount++;
        
        // Check configuration
        if (config.hasEventsSheetId) healthyCount++;
        totalCount++;
        
        if (config.hasOAuthClientId) healthyCount++;
        totalCount++;
        
        if (config.hasSuperAdmin) healthyCount++;
        totalCount++;
        
        return totalCount > 0 ? Math.round((healthyCount / totalCount) * 100) : 0;
    }

    parseStorageSize(sizeString) {
        // Simple parser for storage size strings like "5.2 MB"
        const match = sizeString.match(/^([\d.]+)\s*(\w+)$/);
        if (!match) return 0;
        
        const value = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        
        switch (unit) {
            case 'KB': return value / 1024;
            case 'MB': return value;
            case 'GB': return value * 1024;
            default: return value;
        }
    }

    formatAction(action) {
        return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        if (this.chartRenderer) {
            this.chartRenderer.destroy();
        }
    }
}
