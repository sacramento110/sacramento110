/**
 * Settings Page
 * System settings and configuration
 */

export class SettingsPage {
    constructor() {
        this.systemHealth = null;
    }

    async render(user, eventsService) {
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div>
                    <h2 class="text-2xl font-bold text-admin-900">Settings</h2>
                    <p class="text-admin-600">System configuration and health monitoring</p>
                </div>

                <!-- System Health -->
                <div class="admin-card">
                    <h3 class="text-lg font-semibold text-admin-900 mb-6">System Health</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Backend Services -->
                        <div>
                            <h4 class="text-md font-medium text-admin-800 mb-4">Backend Services</h4>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Google Apps Script</span>
                                    <span id="gas-status" class="px-2 py-1 text-xs rounded-full bg-admin-100 text-admin-600">Checking...</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Google Sheets API</span>
                                    <span id="sheets-status" class="px-2 py-1 text-xs rounded-full bg-admin-100 text-admin-600">Checking...</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Google Drive API</span>
                                    <span id="drive-status" class="px-2 py-1 text-xs rounded-full bg-admin-100 text-admin-600">Checking...</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Authentication</span>
                                    <span id="auth-status" class="px-2 py-1 text-xs rounded-full bg-admin-100 text-admin-600">Checking...</span>
                                </div>
                            </div>
                        </div>

                        <!-- Configuration -->
                        <div>
                            <h4 class="text-md font-medium text-admin-800 mb-4">Configuration</h4>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Spreadsheet ID</span>
                                    <span id="spreadsheet-config" class="px-2 py-1 text-xs rounded-full bg-admin-100 text-admin-600">Checking...</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">OAuth Client ID</span>
                                    <span id="oauth-config" class="px-2 py-1 text-xs rounded-full bg-admin-100 text-admin-600">Checking...</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Super Admin</span>
                                    <span id="admin-config" class="px-2 py-1 text-xs rounded-full bg-admin-100 text-admin-600">Checking...</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Auto Cleanup</span>
                                    <span id="cleanup-config" class="px-2 py-1 text-xs rounded-full bg-admin-100 text-admin-600">Checking...</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-admin-200">
                        <button id="refresh-health-btn" class="btn-secondary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Refresh Health Check
                        </button>
                    </div>
                </div>

                <!-- Cleanup Management -->
                <div class="admin-card">
                    <h3 class="text-lg font-semibold text-admin-900 mb-6">Cleanup Management</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="text-md font-medium text-admin-800 mb-4">Cleanup Status</h4>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Schedule</span>
                                    <span class="text-sm text-admin-900">Daily at 2:00 AM</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Last Run</span>
                                    <span id="last-cleanup" class="text-sm text-admin-900">-</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Next Run</span>
                                    <span id="next-cleanup" class="text-sm text-admin-900">-</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-admin-600">Trigger Status</span>
                                    <span id="trigger-status" class="px-2 py-1 text-xs rounded-full bg-admin-100 text-admin-600">Checking...</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-md font-medium text-admin-800 mb-4">Cleanup Rules</h4>
                            <div class="space-y-2 text-sm text-admin-600">
                                <p>• Events are archived the day after they end</p>
                                <p>• Event images are moved to archive folder</p>
                                <p>• Activity logs are kept for 365 days</p>
                                <p>• Archived files are deleted after 90 days</p>
                            </div>
                        </div>
                    </div>

                    ${user.permissions && user.permissions.includes('manual-cleanup') ? `
                    <div class="mt-6 pt-6 border-t border-admin-200">
                        <button id="run-cleanup-btn" class="btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Run Cleanup Now
                        </button>
                        <p class="mt-2 text-sm text-admin-600">
                            This will immediately run the cleanup process to remove past events and their images.
                        </p>
                    </div>
                    ` : ''}
                </div>

                <!-- User Information -->
                <div class="admin-card">
                    <h3 class="text-lg font-semibold text-admin-900 mb-6">Current User</h3>
                    
                    <div class="flex items-center space-x-4">
                        <img src="${user.picture || '/default-avatar.png'}" alt="${user.name}" class="w-16 h-16 rounded-full">
                        <div>
                            <h4 class="text-lg font-medium text-admin-900">${user.name}</h4>
                            <p class="text-admin-600">${user.email}</p>
                            <div class="flex items-center space-x-2 mt-2">
                                <span class="px-2 py-1 text-xs font-semibold bg-islamic-green-100 text-islamic-green-800 rounded-full">
                                    ${this.formatRole(user.role)}
                                </span>
                                <span class="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                                    ${user.permissions ? user.permissions.length : 0} permissions
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-admin-200">
                        <h5 class="text-md font-medium text-admin-800 mb-3">Permissions</h5>
                        <div class="grid grid-cols-2 gap-2">
                            ${user.permissions ? user.permissions.map(permission => `
                                <div class="flex items-center space-x-2">
                                    <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <span class="text-sm text-admin-700">${this.formatPermission(permission)}</span>
                                </div>
                            `).join('') : '<p class="text-sm text-admin-600">No permissions found</p>'}
                        </div>
                    </div>
                </div>

                <!-- API Configuration -->
                <div class="admin-card">
                    <h3 class="text-lg font-semibold text-admin-900 mb-6">API Configuration</h3>
                    
                    <div class="bg-admin-50 rounded-lg p-4">
                        <div class="flex items-start space-x-3">
                            <svg class="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <h4 class="text-sm font-medium text-admin-900">Configuration Status</h4>
                                <div class="mt-2 space-y-1 text-sm">
                                    <div id="config-status">
                                        <p class="text-admin-600">Checking configuration...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4">
                        <button id="test-connection-btn" class="btn-secondary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Test Connection
                        </button>
                    </div>
                </div>

                <!-- Session Information -->
                <div class="admin-card">
                    <h3 class="text-lg font-semibold text-admin-900 mb-6">Session Information</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="text-md font-medium text-admin-800 mb-3">Current Session</h4>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-admin-600">Login Time:</span>
                                    <span class="text-admin-900" id="session-start">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-admin-600">Token Expires:</span>
                                    <span class="text-admin-900" id="session-expires">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-admin-600">Session Status:</span>
                                    <span id="session-status" class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-md font-medium text-admin-800 mb-3">Security</h4>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-admin-600">Auth Method:</span>
                                    <span class="text-admin-900">Google OAuth 2.0</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-admin-600">Token Type:</span>
                                    <span class="text-admin-900">JWT ID Token</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-admin-600">Auto Logout:</span>
                                    <span class="text-admin-900">24 hours</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-admin-200">
                        <button id="logout-btn" class="btn-danger">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async initialize(user, eventsService) {
        this.user = user;
        this.eventsService = eventsService;
        
        await this.loadSystemHealth();
        this.setupEventListeners();
        this.updateSessionInfo();
    }

    async loadSystemHealth() {
        try {
            // Check API configuration
            const configStatus = this.eventsService.getConfigStatus();
            this.updateConfigStatus(configStatus);
            
            // Test API connection
            const connectionTest = await this.eventsService.testConnection();
            this.updateConnectionStatus(connectionTest);
            
            // Load dashboard metrics for health info
            const metricsResult = await this.eventsService.getDashboardMetrics();
            if (metricsResult.success && metricsResult.metrics) {
                this.updateHealthStatus(metricsResult.metrics.system);
            }
        } catch (error) {
            console.error('Error loading system health:', error);
        }
    }

    setupEventListeners() {
        // Refresh health button
        document.getElementById('refresh-health-btn')?.addEventListener('click', () => this.loadSystemHealth());
        
        // Test connection button
        document.getElementById('test-connection-btn')?.addEventListener('click', () => this.testConnection());
        
        // Run cleanup button
        document.getElementById('run-cleanup-btn')?.addEventListener('click', () => this.runCleanup());
        
        // Logout button
        document.getElementById('logout-btn')?.addEventListener('click', () => this.logout());
    }

    updateConfigStatus(configStatus) {
        const statusEl = document.getElementById('config-status');
        if (!statusEl) return;
        
        if (configStatus.configured) {
            statusEl.innerHTML = '<p class="text-green-600">✓ All configuration values are set</p>';
        } else {
            statusEl.innerHTML = `
                <p class="text-red-600">⚠ Configuration issues found:</p>
                <ul class="mt-1 list-disc list-inside text-red-600">
                    ${configStatus.issues.map(issue => `<li>${issue}</li>`).join('')}
                </ul>
            `;
        }
    }

    updateConnectionStatus(connected) {
        this.updateStatus('gas-status', connected);
    }

    updateHealthStatus(systemHealth) {
        if (!systemHealth) return;
        
        // Update service statuses
        const services = systemHealth.services || {};
        this.updateStatus('sheets-status', services.sheets?.connected);
        this.updateStatus('drive-status', services.drive?.connected);
        this.updateStatus('auth-status', services.auth?.hasOAuthClientId);
        
        // Update configuration statuses
        const config = systemHealth.config || {};
        this.updateStatus('spreadsheet-config', config.hasEventsSheetId);
        this.updateStatus('oauth-config', config.hasOAuthClientId);
        this.updateStatus('admin-config', config.hasSuperAdmin);
        
        // Update cleanup status
        const triggers = systemHealth.triggers || {};
        this.updateStatus('cleanup-config', triggers.cleanupTrigger?.enabled);
        this.updateStatus('trigger-status', triggers.cleanupTrigger?.enabled);
        
        // Update cleanup times
        if (triggers.cleanupTrigger?.nextRun) {
            document.getElementById('next-cleanup').textContent = 
                new Date(triggers.cleanupTrigger.nextRun).toLocaleString();
        }
    }

    updateStatus(elementId, isHealthy) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        if (isHealthy) {
            element.textContent = 'Healthy';
            element.className = 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800';
        } else {
            element.textContent = 'Issue';
            element.className = 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800';
        }
    }

    updateSessionInfo() {
        // This would be populated with actual session data
        document.getElementById('session-start').textContent = 'Current session';
        document.getElementById('session-expires').textContent = '24 hours';
    }

    async testConnection() {
        const button = document.getElementById('test-connection-btn');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<div class="loading-spinner w-4 h-4 border-2 border-gray-300 border-t-islamic-green-600 rounded-full mr-2"></div>Testing...';
        button.disabled = true;
        
        try {
            const connected = await this.eventsService.testConnection();
            
            if (connected) {
                this.showSuccess('Connection test successful');
            } else {
                this.showError('Connection test failed');
            }
        } catch (error) {
            console.error('Connection test error:', error);
            this.showError('Connection test failed: ' + error.message);
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    async runCleanup() {
        if (!confirm('Are you sure you want to run cleanup now? This will remove past events and their images.')) {
            return;
        }
        
        try {
            const result = await this.eventsService.runManualCleanup();
            
            if (result.success) {
                this.showSuccess(`Cleanup completed successfully. Archived ${result.results?.eventsArchived || 0} events.`);
                this.loadSystemHealth(); // Refresh health status
            } else {
                this.showError(`Cleanup failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Cleanup error:', error);
            this.showError('Failed to run cleanup. Please try again.');
        }
    }

    async logout() {
        if (confirm('Are you sure you want to sign out?')) {
            try {
                await window.adminApp.handleLogout();
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    }

    formatRole(role) {
        return role.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatPermission(permission) {
        return permission.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    showSuccess(message) {
        alert(message);
    }

    showError(message) {
        alert('Error: ' + message);
    }
}
