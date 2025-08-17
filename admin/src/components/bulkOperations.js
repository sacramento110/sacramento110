/**
 * Bulk Operations Manager
 * Handles bulk operations for events and users
 */

export class BulkOperationsManager {
    constructor(eventsService, authService, notificationSystem) {
        this.eventsService = eventsService;
        this.authService = authService;
        this.notificationSystem = notificationSystem;
        
        this.selectedItems = new Set();
        this.operationInProgress = false;
        this.operationQueue = [];
        
        this.operations = {
            events: {
                delete: 'Delete Events',
                export: 'Export Events',
                duplicate: 'Duplicate Events',
                updateStatus: 'Update Status',
                updateSpeaker: 'Update Speaker',
                updateLocation: 'Update Location',
                moveToArchive: 'Move to Archive'
            },
            users: {
                delete: 'Remove Users',
                export: 'Export Users',
                updateRole: 'Update Role',
                sendInvite: 'Send Invitations',
                suspendAccess: 'Suspend Access',
                restoreAccess: 'Restore Access'
            }
        };
    }

    /**
     * Render bulk operations toolbar
     */
    renderBulkToolbar(containerId, type = 'events', selectedCount = 0) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const operations = this.operations[type];
        const isVisible = selectedCount > 0;

        container.innerHTML = `
            <div class="bulk-toolbar transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span class="text-sm font-medium text-blue-900">
                                    <span id="selected-count">${selectedCount}</span> ${type} selected
                                </span>
                            </div>
                            
                            <button 
                                class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                onclick="bulkOperations.selectAll('${type}')"
                            >
                                Select All
                            </button>
                            
                            <button 
                                class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                onclick="bulkOperations.clearSelection()"
                            >
                                Clear Selection
                            </button>
                        </div>
                        
                        <div class="flex items-center space-x-2">
                            <!-- Bulk Operations Dropdown -->
                            <div class="relative">
                                <button 
                                    class="bulk-actions-button inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm bg-white text-sm font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onclick="bulkOperations.toggleActionsMenu('${type}')"
                                >
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                                    </svg>
                                    Bulk Actions
                                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                
                                <div id="bulk-actions-menu-${type}" class="bulk-actions-menu hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                    <div class="py-1">
                                        ${Object.entries(operations).map(([key, label]) => `
                                            <button 
                                                class="bulk-action-item block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                onclick="bulkOperations.executeOperation('${type}', '${key}')"
                                            >
                                                ${this.getOperationIcon(key)} ${label}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Progress Indicator -->
                            <div id="bulk-progress" class="hidden">
                                <div class="flex items-center space-x-2">
                                    <div class="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                    <span class="text-sm text-blue-600">Processing...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Operation Status -->
                    <div id="bulk-status" class="hidden mt-3 p-3 rounded-md">
                        <div class="flex items-center space-x-2">
                            <div id="status-icon"></div>
                            <div id="status-message" class="text-sm"></div>
                        </div>
                        <div id="status-progress" class="mt-2 hidden">
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div id="progress-bar" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                            </div>
                            <div class="flex justify-between text-xs text-gray-600 mt-1">
                                <span id="progress-text">0 of 0 processed</span>
                                <span id="progress-percentage">0%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.bulk-actions-button') && !e.target.closest('.bulk-actions-menu')) {
                this.hideActionsMenu(type);
            }
        });
    }

    /**
     * Get operation icon
     */
    getOperationIcon(operation) {
        const icons = {
            delete: '<svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>',
            export: '<svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>',
            duplicate: '<svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>',
            updateStatus: '<svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>',
            updateSpeaker: '<svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>',
            updateLocation: '<svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
            updateRole: '<svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
            sendInvite: '<svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>',
            moveToArchive: '<svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>',
            suspendAccess: '<svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path></svg>',
            restoreAccess: '<svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };
        return icons[operation] || '';
    }

    /**
     * Toggle actions menu
     */
    toggleActionsMenu(type) {
        const menu = document.getElementById(`bulk-actions-menu-${type}`);
        if (menu) {
            menu.classList.toggle('hidden');
        }
    }

    /**
     * Hide actions menu
     */
    hideActionsMenu(type) {
        const menu = document.getElementById(`bulk-actions-menu-${type}`);
        if (menu) {
            menu.classList.add('hidden');
        }
    }

    /**
     * Update selected count
     */
    updateSelectedCount(count) {
        const countElement = document.getElementById('selected-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    /**
     * Execute bulk operation
     */
    async executeOperation(type, operation) {
        if (this.operationInProgress) {
            this.notificationSystem.warning('Another operation is already in progress');
            return;
        }

        if (this.selectedItems.size === 0) {
            this.notificationSystem.warning('No items selected');
            return;
        }

        // Hide actions menu
        this.hideActionsMenu(type);

        // Confirm destructive operations
        if (['delete', 'suspendAccess', 'moveToArchive'].includes(operation)) {
            const confirmed = await this.confirmDestructiveOperation(type, operation, this.selectedItems.size);
            if (!confirmed) return;
        }

        try {
            this.operationInProgress = true;
            this.showProgress(true);
            
            await this.executeOperationByType(type, operation, Array.from(this.selectedItems));
            
            this.notificationSystem.success(`Bulk ${operation} completed successfully`);
            this.clearSelection();
            
        } catch (error) {
            console.error('Bulk operation failed:', error);
            this.notificationSystem.error(`Bulk operation failed: ${error.message}`);
        } finally {
            this.operationInProgress = false;
            this.showProgress(false);
        }
    }

    /**
     * Execute operation based on type
     */
    async executeOperationByType(type, operation, selectedIds) {
        switch (type) {
            case 'events':
                return await this.executeEventOperation(operation, selectedIds);
            case 'users':
                return await this.executeUserOperation(operation, selectedIds);
            default:
                throw new Error(`Unknown operation type: ${type}`);
        }
    }

    /**
     * Execute event operations
     */
    async executeEventOperation(operation, eventIds) {
        this.updateStatus('Processing events...', 'info');
        
        switch (operation) {
            case 'delete':
                await this.deleteEvents(eventIds);
                break;
            case 'export':
                await this.exportEvents(eventIds);
                break;
            case 'duplicate':
                await this.duplicateEvents(eventIds);
                break;
            case 'updateStatus':
                await this.updateEventStatus(eventIds);
                break;
            case 'updateSpeaker':
                await this.updateEventSpeaker(eventIds);
                break;
            case 'updateLocation':
                await this.updateEventLocation(eventIds);
                break;
            case 'moveToArchive':
                await this.archiveEvents(eventIds);
                break;
            default:
                throw new Error(`Unknown event operation: ${operation}`);
        }
    }

    /**
     * Execute user operations
     */
    async executeUserOperation(operation, userIds) {
        this.updateStatus('Processing users...', 'info');
        
        switch (operation) {
            case 'delete':
                await this.deleteUsers(userIds);
                break;
            case 'export':
                await this.exportUsers(userIds);
                break;
            case 'updateRole':
                await this.updateUserRoles(userIds);
                break;
            case 'sendInvite':
                await this.sendUserInvites(userIds);
                break;
            case 'suspendAccess':
                await this.suspendUsers(userIds);
                break;
            case 'restoreAccess':
                await this.restoreUsers(userIds);
                break;
            default:
                throw new Error(`Unknown user operation: ${operation}`);
        }
    }

    /**
     * Delete multiple events
     */
    async deleteEvents(eventIds) {
        let processed = 0;
        const total = eventIds.length;
        
        for (const eventId of eventIds) {
            try {
                await this.eventsService.deleteEvent(eventId);
                processed++;
                this.updateProgressBar(processed, total);
            } catch (error) {
                console.error(`Failed to delete event ${eventId}:`, error);
                // Continue with other events
            }
        }
        
        // Trigger UI refresh
        window.dispatchEvent(new CustomEvent('eventsUpdated'));
    }

    /**
     * Export multiple events
     */
    async exportEvents(eventIds) {
        const events = [];
        let processed = 0;
        const total = eventIds.length;
        
        for (const eventId of eventIds) {
            try {
                const event = await this.eventsService.getEvent(eventId);
                if (event) events.push(event);
                processed++;
                this.updateProgressBar(processed, total);
            } catch (error) {
                console.error(`Failed to fetch event ${eventId}:`, error);
            }
        }
        
        // Generate and download CSV
        const csvContent = this.generateEventCSV(events);
        this.downloadFile(csvContent, `events-export-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    }

    /**
     * Duplicate multiple events
     */
    async duplicateEvents(eventIds) {
        let processed = 0;
        const total = eventIds.length;
        
        for (const eventId of eventIds) {
            try {
                const originalEvent = await this.eventsService.getEvent(eventId);
                if (originalEvent) {
                    const duplicatedEvent = {
                        ...originalEvent,
                        id: undefined, // Remove ID so a new one is generated
                        title: `${originalEvent.title} (Copy)`,
                        createdAt: new Date().toISOString(),
                        createdBy: this.authService.getCurrentUser().email
                    };
                    
                    await this.eventsService.createEvent(duplicatedEvent);
                }
                processed++;
                this.updateProgressBar(processed, total);
            } catch (error) {
                console.error(`Failed to duplicate event ${eventId}:`, error);
            }
        }
        
        // Trigger UI refresh
        window.dispatchEvent(new CustomEvent('eventsUpdated'));
    }

    /**
     * Confirm destructive operations
     */
    async confirmDestructiveOperation(type, operation, count) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
            modal.innerHTML = `
                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div class="mt-3 text-center">
                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Confirm ${operation}</h3>
                        <div class="mt-2 px-7 py-3">
                            <p class="text-sm text-gray-500">
                                Are you sure you want to ${operation} ${count} ${type}? 
                                ${operation === 'delete' ? 'This action cannot be undone.' : ''}
                            </p>
                        </div>
                        <div class="items-center px-4 py-3">
                            <button
                                id="confirm-operation"
                                class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                                Confirm
                            </button>
                            <button
                                id="cancel-operation"
                                class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            document.getElementById('confirm-operation').onclick = () => {
                document.body.removeChild(modal);
                resolve(true);
            };
            
            document.getElementById('cancel-operation').onclick = () => {
                document.body.removeChild(modal);
                resolve(false);
            };
            
            // Close on outside click
            modal.onclick = (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                    resolve(false);
                }
            };
        });
    }

    /**
     * Show/hide progress indicator
     */
    showProgress(show) {
        const progressElement = document.getElementById('bulk-progress');
        const statusElement = document.getElementById('bulk-status');
        
        if (progressElement) {
            progressElement.classList.toggle('hidden', !show);
        }
        
        if (statusElement && show) {
            statusElement.classList.remove('hidden');
            this.updateProgressBar(0, 1);
        } else if (statusElement && !show) {
            setTimeout(() => statusElement.classList.add('hidden'), 2000);
        }
    }

    /**
     * Update status message
     */
    updateStatus(message, type = 'info') {
        const statusElement = document.getElementById('bulk-status');
        const iconElement = document.getElementById('status-icon');
        const messageElement = document.getElementById('status-message');
        
        if (!statusElement || !iconElement || !messageElement) return;
        
        const colors = {
            info: 'bg-blue-50 text-blue-800',
            success: 'bg-green-50 text-green-800',
            warning: 'bg-yellow-50 text-yellow-800',
            error: 'bg-red-50 text-red-800'
        };
        
        statusElement.className = `mt-3 p-3 rounded-md ${colors[type]}`;
        messageElement.textContent = message;
        
        // Show progress bar for info status
        const progressContainer = document.getElementById('status-progress');
        if (progressContainer) {
            progressContainer.classList.toggle('hidden', type !== 'info');
        }
    }

    /**
     * Update progress bar
     */
    updateProgressBar(processed, total) {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        const progressPercentage = document.getElementById('progress-percentage');
        
        if (!progressBar || !progressText || !progressPercentage) return;
        
        const percentage = Math.round((processed / total) * 100);
        
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${processed} of ${total} processed`;
        progressPercentage.textContent = `${percentage}%`;
    }

    /**
     * Generate CSV content for events
     */
    generateEventCSV(events) {
        const headers = ['ID', 'Title', 'Date Start', 'Date End', 'Speaker', 'Location', 'Hosted By', 'Status'];
        const rows = events.map(event => [
            event.id,
            `"${event.title}"`,
            event.dateStart,
            event.dateEnd || '',
            `"${event.speaker}"`,
            `"${event.location}"`,
            `"${event.hostedBy}"`,
            event.status || 'active'
        ]);
        
        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    /**
     * Download file utility
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Selection management
     */
    addToSelection(itemId) {
        this.selectedItems.add(itemId);
        this.updateSelectedCount(this.selectedItems.size);
    }

    removeFromSelection(itemId) {
        this.selectedItems.delete(itemId);
        this.updateSelectedCount(this.selectedItems.size);
    }

    toggleSelection(itemId) {
        if (this.selectedItems.has(itemId)) {
            this.removeFromSelection(itemId);
        } else {
            this.addToSelection(itemId);
        }
    }

    selectAll(type) {
        // This would typically get all visible items from the current page/filter
        // Implementation depends on the specific UI context
        this.notificationSystem.info('Select All functionality would be implemented based on current view');
    }

    clearSelection() {
        this.selectedItems.clear();
        this.updateSelectedCount(0);
        
        // Clear visual selection in UI
        document.querySelectorAll('.bulk-checkbox:checked').forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    /**
     * Get selected items
     */
    getSelectedItems() {
        return Array.from(this.selectedItems);
    }

    /**
     * Check if operation is in progress
     */
    isOperationInProgress() {
        return this.operationInProgress;
    }
}

// Global instance will be created when services are available
let bulkOperations = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // This will be initialized by the main app when services are ready
});
