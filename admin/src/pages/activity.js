/**
 * Activity Logs Page
 * Activity monitoring and audit trail interface
 */

export class ActivityPage {
    constructor() {
        this.activities = [];
        this.filteredActivities = [];
        this.filterAction = 'all';
        this.filterUser = 'all';
        this.dateRange = 7; // days
    }

    async render(user, eventsService) {
        // Check if user has permission to view logs
        if (!user.permissions || !user.permissions.includes('view-logs')) {
            return `
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-admin-900 mb-2">Access Denied</h3>
                    <p class="text-admin-600">You don't have permission to view activity logs.</p>
                </div>
            `;
        }

        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-admin-900">Activity Logs</h2>
                        <p class="text-admin-600">Monitor all admin activities and system events</p>
                    </div>
                    <div class="mt-4 sm:mt-0 flex space-x-3">
                        <button id="refresh-activity-btn" class="btn-secondary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Refresh
                        </button>
                        ${user.role === 'super-admin' ? `
                        <button id="export-logs-btn" class="btn-secondary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Export
                        </button>
                        ` : ''}
                    </div>
                </div>

                <!-- Filters -->
                <div class="admin-card">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label for="filter-action" class="form-label">Filter by Action</label>
                            <select id="filter-action" class="form-select">
                                <option value="all">All Actions</option>
                                <option value="login">Login</option>
                                <option value="create">Create</option>
                                <option value="update">Update</option>
                                <option value="delete">Delete</option>
                                <option value="upload">Upload</option>
                                <option value="cleanup">Cleanup</option>
                            </select>
                        </div>
                        
                        <div>
                            <label for="filter-user" class="form-label">Filter by User</label>
                            <select id="filter-user" class="form-select">
                                <option value="all">All Users</option>
                                <!-- Populated dynamically -->
                            </select>
                        </div>
                        
                        <div>
                            <label for="filter-date-range" class="form-label">Date Range</label>
                            <select id="filter-date-range" class="form-select">
                                <option value="1">Last 24 hours</option>
                                <option value="7" selected>Last 7 days</option>
                                <option value="30">Last 30 days</option>
                                <option value="90">Last 90 days</option>
                            </select>
                        </div>
                        
                        <div class="flex items-end">
                            <button id="clear-filters-btn" class="btn-secondary w-full">Clear Filters</button>
                        </div>
                    </div>
                </div>

                <!-- Activity Summary -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="admin-card">
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-admin-600">Total Activities</p>
                                <p class="text-2xl font-bold text-admin-900" id="total-activities">-</p>
                            </div>
                        </div>
                    </div>

                    <div class="admin-card">
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-admin-600">Today's Logins</p>
                                <p class="text-2xl font-bold text-admin-900" id="today-logins">-</p>
                            </div>
                        </div>
                    </div>

                    <div class="admin-card">
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-admin-600">Events Created</p>
                                <p class="text-2xl font-bold text-admin-900" id="events-created">-</p>
                            </div>
                        </div>
                    </div>

                    <div class="admin-card">
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-admin-600">Active Users</p>
                                <p class="text-2xl font-bold text-admin-900" id="active-users">-</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Activity Timeline -->
                <div class="admin-card">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-admin-900">Activity Timeline</h3>
                        <div class="text-sm text-admin-600">
                            Showing <span id="showing-count">0</span> of <span id="total-count">0</span> activities
                        </div>
                    </div>
                    
                    <div id="activity-timeline">
                        <div class="animate-pulse space-y-4">
                            <div class="flex space-x-4">
                                <div class="w-10 h-10 bg-admin-200 rounded-full"></div>
                                <div class="flex-1 space-y-2">
                                    <div class="h-4 bg-admin-200 rounded w-3/4"></div>
                                    <div class="h-3 bg-admin-200 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div class="flex space-x-4">
                                <div class="w-10 h-10 bg-admin-200 rounded-full"></div>
                                <div class="flex-1 space-y-2">
                                    <div class="h-4 bg-admin-200 rounded w-2/3"></div>
                                    <div class="h-3 bg-admin-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Load more button -->
                    <div id="load-more-container" class="text-center mt-6 hidden">
                        <button id="load-more-btn" class="btn-secondary">
                            Load More Activities
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async initialize(user, eventsService) {
        this.user = user;
        this.eventsService = eventsService;
        
        // Only load if user has permissions
        if (user.permissions && user.permissions.includes('view-logs')) {
            await this.loadActivities();
            this.setupEventListeners();
        }
    }

    async loadActivities() {
        try {
            const result = await this.eventsService.getActivityLog();
            
            if (result.success) {
                this.activities = result.activities || [];
                this.populateUserFilter();
                this.applyFilters();
                this.renderActivities();
                this.updateSummary();
            } else {
                console.error('Failed to load activities:', result.error);
                this.showError(result.error || 'Failed to load activities');
            }
        } catch (error) {
            console.error('Error loading activities:', error);
            this.showError('Unable to connect to backend');
        }
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refresh-activity-btn')?.addEventListener('click', () => this.loadActivities());
        
        // Export button (super-admin only)
        document.getElementById('export-logs-btn')?.addEventListener('click', () => this.exportLogs());
        
        // Filters
        document.getElementById('filter-action')?.addEventListener('change', () => this.handleFilterChange());
        document.getElementById('filter-user')?.addEventListener('change', () => this.handleFilterChange());
        document.getElementById('filter-date-range')?.addEventListener('change', () => this.handleFilterChange());
        document.getElementById('clear-filters-btn')?.addEventListener('click', () => this.clearFilters());
        
        // Load more
        document.getElementById('load-more-btn')?.addEventListener('click', () => this.loadMoreActivities());
    }

    populateUserFilter() {
        const userFilter = document.getElementById('filter-user');
        if (!userFilter) return;
        
        const users = [...new Set(this.activities.map(activity => activity.adminEmail))];
        
        // Clear existing options (except "All Users")
        userFilter.innerHTML = '<option value="all">All Users</option>';
        
        users.forEach(email => {
            const option = document.createElement('option');
            option.value = email;
            option.textContent = email;
            userFilter.appendChild(option);
        });
    }

    handleFilterChange() {
        this.filterAction = document.getElementById('filter-action')?.value || 'all';
        this.filterUser = document.getElementById('filter-user')?.value || 'all';
        this.dateRange = parseInt(document.getElementById('filter-date-range')?.value) || 7;
        
        this.applyFilters();
        this.renderActivities();
        this.updateSummary();
    }

    applyFilters() {
        const now = new Date();
        const cutoffDate = new Date(now.getTime() - (this.dateRange * 24 * 60 * 60 * 1000));
        
        this.filteredActivities = this.activities.filter(activity => {
            // Date filter
            const activityDate = new Date(activity.timestamp);
            if (activityDate < cutoffDate) return false;
            
            // Action filter
            if (this.filterAction !== 'all' && activity.action !== this.filterAction) return false;
            
            // User filter
            if (this.filterUser !== 'all' && activity.adminEmail !== this.filterUser) return false;
            
            return true;
        });
    }

    renderActivities() {
        const container = document.getElementById('activity-timeline');
        
        if (this.filteredActivities.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-admin-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p class="text-admin-600">No activities found for the selected filters</p>
                </div>
            `;
            document.getElementById('load-more-container').classList.add('hidden');
            return;
        }

        // Show first 50 activities
        const activitiesToShow = this.filteredActivities.slice(0, 50);
        
        container.innerHTML = activitiesToShow.map((activity, index) => {
            const isLast = index === activitiesToShow.length - 1;
            return this.renderActivityItem(activity, isLast);
        }).join('');

        // Show load more button if there are more activities
        const loadMoreContainer = document.getElementById('load-more-container');
        if (this.filteredActivities.length > 50) {
            loadMoreContainer.classList.remove('hidden');
        } else {
            loadMoreContainer.classList.add('hidden');
        }

        this.updateCounts();
    }

    renderActivityItem(activity, isLast) {
        const icon = this.getActivityIcon(activity.action);
        const description = this.getActivityDescription(activity);
        const timeAgo = this.getTimeAgo(activity.timestamp);
        const actionClass = this.getActionClass(activity.action);
        
        return `
            <div class="relative ${!isLast ? 'pb-8' : ''}">
                ${!isLast ? '<span class="absolute top-10 left-5 -ml-px h-full w-0.5 bg-admin-200" aria-hidden="true"></span>' : ''}
                <div class="relative flex space-x-3">
                    <div>
                        <span class="h-10 w-10 rounded-full ${actionClass} flex items-center justify-center ring-8 ring-white">
                            ${icon}
                        </span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div>
                            <div class="text-sm">
                                <span class="font-medium text-admin-900">${activity.adminEmail}</span>
                                <span class="text-admin-600">${description}</span>
                            </div>
                            <p class="mt-0.5 text-xs text-admin-500">${timeAgo}</p>
                        </div>
                        ${activity.details ? this.renderActivityDetails(activity.details) : ''}
                    </div>
                </div>
            </div>
        `;
    }

    getActivityIcon(action) {
        const icons = {
            login: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>',
            create: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>',
            update: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>',
            delete: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>',
            upload: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>',
            cleanup: '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>'
        };
        return icons[action] || icons.create;
    }

    getActionClass(action) {
        const classes = {
            login: 'bg-blue-500',
            create: 'bg-green-500',
            update: 'bg-yellow-500',
            delete: 'bg-red-500',
            upload: 'bg-purple-500',
            cleanup: 'bg-gray-500'
        };
        return classes[action] || 'bg-gray-500';
    }

    getActivityDescription(activity) {
        const descriptions = {
            login: ' signed in',
            create: ' created an event',
            update: ' updated an event',
            delete: ' deleted an event',
            upload: ' uploaded an image',
            cleanup: ' ran cleanup',
            user_added: ' added a new user',
            user_removed: ' removed a user'
        };
        return descriptions[activity.action] || ` performed ${activity.action}`;
    }

    renderActivityDetails(details) {
        if (!details || typeof details !== 'object') return '';
        
        const detailsArray = [];
        
        if (details.title) {
            detailsArray.push(`Event: ${details.title}`);
        }
        
        if (details.fileName) {
            detailsArray.push(`File: ${details.fileName}`);
        }
        
        if (details.newUserEmail) {
            detailsArray.push(`User: ${details.newUserEmail}`);
        }
        
        if (detailsArray.length === 0) return '';
        
        return `
            <div class="mt-2 text-xs text-admin-600 bg-admin-50 rounded-md p-2">
                ${detailsArray.join(' • ')}
            </div>
        `;
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return time.toLocaleDateString();
    }

    updateSummary() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayActivities = this.filteredActivities.filter(activity => {
            const activityDate = new Date(activity.timestamp);
            activityDate.setHours(0, 0, 0, 0);
            return activityDate.getTime() === today.getTime();
        });
        
        const todayLogins = todayActivities.filter(activity => activity.action === 'login');
        const eventsCreated = this.filteredActivities.filter(activity => activity.action === 'create');
        const activeUsers = new Set(this.filteredActivities.map(activity => activity.adminEmail)).size;
        
        document.getElementById('total-activities').textContent = this.filteredActivities.length;
        document.getElementById('today-logins').textContent = todayLogins.length;
        document.getElementById('events-created').textContent = eventsCreated.length;
        document.getElementById('active-users').textContent = activeUsers;
    }

    updateCounts() {
        const showingCount = Math.min(50, this.filteredActivities.length);
        document.getElementById('showing-count').textContent = showingCount;
        document.getElementById('total-count').textContent = this.filteredActivities.length;
    }

    loadMoreActivities() {
        // This would implement pagination in a real application
        alert('Load more functionality would be implemented here');
    }

    clearFilters() {
        document.getElementById('filter-action').value = 'all';
        document.getElementById('filter-user').value = 'all';
        document.getElementById('filter-date-range').value = '7';
        
        this.filterAction = 'all';
        this.filterUser = 'all';
        this.dateRange = 7;
        
        this.applyFilters();
        this.renderActivities();
        this.updateSummary();
    }

    async exportLogs() {
        try {
            // This would export logs in a real implementation
            alert('Export functionality would be implemented here.\nThis would generate a CSV file with all activity logs.');
        } catch (error) {
            console.error('Export error:', error);
            this.showError('Failed to export logs');
        }
    }

    showError(message) {
        alert('Error: ' + message);
    }
}
