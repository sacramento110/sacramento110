/**
 * Enhanced User Management Components
 * Advanced user role and permissions management
 */

export class UserRoleManager {
    constructor() {
        this.permissions = {
            'super-admin': [
                'manage-users',
                'manage-events',
                'view-analytics',
                'delete-events',
                'manage-settings',
                'view-logs',
                'manual-cleanup',
                'export-data',
                'system-admin'
            ],
            'admin': [
                'manage-events',
                'view-analytics',
                'view-logs',
                'export-data'
            ],
            'editor': [
                'manage-events',
                'view-analytics'
            ]
        };
    }

    /**
     * Render permissions editor
     */
    renderPermissionsEditor(containerId, userRole, currentPermissions = []) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const allPermissions = [
            { id: 'manage-users', label: 'User Management', description: 'Add, remove, and modify admin users' },
            { id: 'manage-events', label: 'Event Management', description: 'Create, edit, and delete events' },
            { id: 'view-analytics', label: 'View Analytics', description: 'Access dashboard and analytics' },
            { id: 'delete-events', label: 'Delete Events', description: 'Permission to delete events' },
            { id: 'manage-settings', label: 'System Settings', description: 'Configure system settings' },
            { id: 'view-logs', label: 'Activity Logs', description: 'View admin activity logs' },
            { id: 'manual-cleanup', label: 'Manual Cleanup', description: 'Run system cleanup operations' },
            { id: 'export-data', label: 'Export Data', description: 'Export system data and reports' },
            { id: 'system-admin', label: 'System Administration', description: 'Full system administration access' }
        ];

        container.innerHTML = `
            <div class="permissions-editor">
                <h4 class="text-md font-semibold text-admin-800 mb-4">Role Permissions</h4>
                <div class="space-y-3">
                    ${allPermissions.map(permission => {
                        const isEnabled = currentPermissions.includes(permission.id);
                        const isDefaultForRole = this.permissions[userRole]?.includes(permission.id);
                        
                        return `
                            <div class="permission-item flex items-start space-x-3 p-3 rounded-lg border ${isEnabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}">
                                <div class="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        id="perm-${permission.id}" 
                                        class="permission-checkbox w-4 h-4 text-islamic-green-600 rounded focus:ring-islamic-green-500" 
                                        ${isEnabled ? 'checked' : ''}
                                        ${isDefaultForRole ? 'data-default="true"' : ''}
                                        data-permission="${permission.id}"
                                    />
                                </div>
                                <div class="flex-1">
                                    <label for="perm-${permission.id}" class="text-sm font-medium text-admin-900 cursor-pointer">
                                        ${permission.label}
                                    </label>
                                    <p class="text-xs text-admin-600 mt-1">${permission.description}</p>
                                    ${isDefaultForRole ? '<span class="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Default for role</span>' : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div class="flex items-start space-x-2">
                        <svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <div>
                            <h5 class="text-sm font-medium text-yellow-800">Permission Guidelines</h5>
                            <ul class="mt-1 text-xs text-yellow-700 space-y-1">
                                <li>• Super-admins always have all permissions</li>
                                <li>• Users cannot modify their own permissions</li>
                                <li>• Changes take effect on next login</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for permission changes
        const checkboxes = container.querySelectorAll('.permission-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handlePermissionChange(e.target);
            });
        });
    }

    /**
     * Handle permission checkbox changes
     */
    handlePermissionChange(checkbox) {
        const permissionItem = checkbox.closest('.permission-item');
        const isChecked = checkbox.checked;
        
        if (isChecked) {
            permissionItem.classList.remove('bg-gray-50', 'border-gray-200');
            permissionItem.classList.add('bg-green-50', 'border-green-200');
        } else {
            permissionItem.classList.remove('bg-green-50', 'border-green-200');
            permissionItem.classList.add('bg-gray-50', 'border-gray-200');
        }
    }

    /**
     * Get selected permissions
     */
    getSelectedPermissions(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return [];

        const checkboxes = container.querySelectorAll('.permission-checkbox:checked');
        return Array.from(checkboxes).map(cb => cb.dataset.permission);
    }

    /**
     * Render user role selector
     */
    renderRoleSelector(containerId, currentRole = 'editor', onChange = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const roles = [
            { 
                value: 'editor', 
                label: 'Editor', 
                description: 'Can manage events and view analytics',
                color: 'yellow'
            },
            { 
                value: 'admin', 
                label: 'Admin', 
                description: 'Can manage events, view analytics, and activity logs',
                color: 'blue'
            },
            { 
                value: 'super-admin', 
                label: 'Super Admin', 
                description: 'Full system access and user management',
                color: 'purple'
            }
        ];

        container.innerHTML = `
            <div class="role-selector">
                <h4 class="text-md font-semibold text-admin-800 mb-4">User Role</h4>
                <div class="space-y-3">
                    ${roles.map(role => {
                        const isSelected = role.value === currentRole;
                        const colorClasses = {
                            yellow: 'border-yellow-200 bg-yellow-50 text-yellow-800',
                            blue: 'border-blue-200 bg-blue-50 text-blue-800',
                            purple: 'border-purple-200 bg-purple-50 text-purple-800'
                        };
                        
                        return `
                            <label class="role-option cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="user-role" 
                                    value="${role.value}" 
                                    class="sr-only role-radio"
                                    ${isSelected ? 'checked' : ''}
                                />
                                <div class="role-card p-4 border-2 rounded-lg transition-all ${isSelected ? `${colorClasses[role.color]} ring-2 ring-offset-2 ring-${role.color}-500` : 'border-gray-200 bg-white hover:border-gray-300'}">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h5 class="text-sm font-semibold ${isSelected ? '' : 'text-admin-900'}">${role.label}</h5>
                                            <p class="text-xs ${isSelected ? '' : 'text-admin-600'} mt-1">${role.description}</p>
                                            <div class="mt-2">
                                                <span class="text-xs ${isSelected ? '' : 'text-admin-500'}">
                                                    ${this.permissions[role.value]?.length || 0} permissions
                                                </span>
                                            </div>
                                        </div>
                                        <div class="flex-shrink-0">
                                            <div class="w-5 h-5 border-2 rounded-full ${isSelected ? `border-${role.color}-500 bg-${role.color}-500` : 'border-gray-300'} flex items-center justify-center">
                                                ${isSelected ? '<div class="w-2 h-2 bg-white rounded-full"></div>' : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </label>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // Add event listeners for role changes
        const radioButtons = container.querySelectorAll('.role-radio');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.handleRoleChange(container, e.target.value);
                    if (onChange) onChange(e.target.value);
                }
            });
        });
    }

    /**
     * Handle role selection changes
     */
    handleRoleChange(container, selectedRole) {
        const roleCards = container.querySelectorAll('.role-card');
        const roles = ['editor', 'admin', 'super-admin'];
        const colors = ['yellow', 'blue', 'purple'];
        
        roleCards.forEach((card, index) => {
            const role = roles[index];
            const color = colors[index];
            const isSelected = role === selectedRole;
            
            if (isSelected) {
                card.className = `role-card p-4 border-2 rounded-lg transition-all border-${color}-200 bg-${color}-50 text-${color}-800 ring-2 ring-offset-2 ring-${color}-500`;
            } else {
                card.className = 'role-card p-4 border-2 rounded-lg transition-all border-gray-200 bg-white hover:border-gray-300';
            }
            
            // Update radio button indicator
            const indicator = card.querySelector('.w-5.h-5');
            if (isSelected) {
                indicator.className = `w-5 h-5 border-2 rounded-full border-${color}-500 bg-${color}-500 flex items-center justify-center`;
                indicator.innerHTML = '<div class="w-2 h-2 bg-white rounded-full"></div>';
            } else {
                indicator.className = 'w-5 h-5 border-2 rounded-full border-gray-300 flex items-center justify-center';
                indicator.innerHTML = '';
            }
        });
    }

    /**
     * Get selected role
     */
    getSelectedRole(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;

        const selectedRadio = container.querySelector('.role-radio:checked');
        return selectedRadio ? selectedRadio.value : null;
    }

    /**
     * Render user activity summary
     */
    renderUserActivity(containerId, activityData) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { 
            totalLogins = 0, 
            lastLogin = null, 
            recentActions = [], 
            activityBreakdown = {} 
        } = activityData;

        container.innerHTML = `
            <div class="user-activity">
                <h4 class="text-md font-semibold text-admin-800 mb-4">Activity Summary</h4>
                
                <!-- Activity Stats -->
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="activity-stat p-3 bg-blue-50 rounded-lg">
                        <div class="text-2xl font-bold text-blue-900">${totalLogins}</div>
                        <div class="text-sm text-blue-600">Total Logins</div>
                    </div>
                    <div class="activity-stat p-3 bg-green-50 rounded-lg">
                        <div class="text-sm font-bold text-green-900">${lastLogin ? this.formatDate(lastLogin) : 'Never'}</div>
                        <div class="text-sm text-green-600">Last Login</div>
                    </div>
                </div>

                <!-- Recent Actions -->
                <div class="recent-actions">
                    <h5 class="text-sm font-semibold text-admin-700 mb-3">Recent Actions</h5>
                    ${recentActions.length > 0 ? `
                        <div class="space-y-2">
                            ${recentActions.slice(0, 5).map(action => `
                                <div class="action-item flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div class="flex-1">
                                        <span class="text-sm text-admin-900">${this.formatAction(action.action)}</span>
                                        <span class="text-xs text-admin-600 ml-2">${this.formatDate(action.timestamp)}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p class="text-sm text-admin-600">No recent activity</p>
                    `}
                </div>

                <!-- Activity Breakdown -->
                ${Object.keys(activityBreakdown).length > 0 ? `
                    <div class="activity-breakdown mt-6">
                        <h5 class="text-sm font-semibold text-admin-700 mb-3">Action Breakdown</h5>
                        <div class="space-y-2">
                            ${Object.entries(activityBreakdown).map(([action, count]) => `
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-admin-700">${this.formatAction(action)}</span>
                                    <span class="font-medium text-admin-900">${count}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Format action names
     */
    formatAction(action) {
        return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Format dates
     */
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    }

    /**
     * Get permissions for role
     */
    getPermissionsForRole(role) {
        return this.permissions[role] || [];
    }

    /**
     * Validate role change
     */
    canChangeRole(currentUser, targetUser, newRole) {
        // Super-admin can change anyone's role
        if (currentUser.role === 'super-admin') {
            // But cannot change own role or demote self
            if (currentUser.email === targetUser.email && newRole !== 'super-admin') {
                return { valid: false, reason: 'Cannot demote yourself from super-admin' };
            }
            return { valid: true };
        }

        // Regular admins cannot change roles
        return { valid: false, reason: 'Insufficient permissions to change user roles' };
    }
}
