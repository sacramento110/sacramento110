/**
 * Users Management Page
 * Super-admin only user management interface
 */

export class UsersPage {
    constructor() {
        this.users = [];
    }

    async render(user, eventsService) {
        // Check if user has permission to manage users
        if (!user.permissions || !user.permissions.includes('manage-users')) {
            return `
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-admin-900 mb-2">Access Denied</h3>
                    <p class="text-admin-600">You don't have permission to manage users.</p>
                </div>
            `;
        }

        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-admin-900">User Management</h2>
                        <p class="text-admin-600">Manage admin users and their permissions</p>
                    </div>
                    <div class="mt-4 sm:mt-0 flex space-x-3">
                        <button id="add-user-btn" class="btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Add User
                        </button>
                        <button id="refresh-users-btn" class="btn-secondary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                <!-- Users list -->
                <div class="admin-card">
                    <div id="users-list">
                        <div class="animate-pulse space-y-4">
                            <div class="h-4 bg-admin-200 rounded w-3/4"></div>
                            <div class="h-4 bg-admin-200 rounded w-1/2"></div>
                            <div class="h-4 bg-admin-200 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>

                <!-- Add user modal -->
                <div id="add-user-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-admin-900">Add New User</h3>
                            <button id="close-add-modal" class="text-admin-400 hover:text-admin-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <form id="add-user-form" class="space-y-4">
                            <div>
                                <label for="user-email" class="form-label">Email Address *</label>
                                <input type="email" id="user-email" name="email" class="form-input" required>
                                <p class="mt-1 text-sm text-admin-600">Must be a valid Gmail address</p>
                            </div>
                            
                            <div>
                                <label for="user-name" class="form-label">Full Name *</label>
                                <input type="text" id="user-name" name="name" class="form-input" required>
                            </div>
                            
                            <div>
                                <label for="user-role" class="form-label">Role *</label>
                                <select id="user-role" name="role" class="form-select" required>
                                    <option value="">Select a role</option>
                                    <option value="admin">Admin</option>
                                    <option value="editor">Editor</option>
                                </select>
                                <div class="mt-2 text-sm text-admin-600">
                                    <p><strong>Admin:</strong> Can manage events, view analytics, and activity logs</p>
                                    <p><strong>Editor:</strong> Can manage events and view analytics</p>
                                </div>
                            </div>
                            
                            <div class="flex space-x-3 pt-4">
                                <button type="button" id="cancel-add-user" class="flex-1 btn-secondary">Cancel</button>
                                <button type="submit" id="save-user-btn" class="flex-1 btn-primary">
                                    <span id="save-user-text">Add User</span>
                                    <div id="save-user-spinner" class="hidden loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2"></div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Remove user modal -->
                <div id="remove-user-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-admin-900">Remove User</h3>
                        </div>
                        <p class="text-admin-600 mb-6">Are you sure you want to remove this user? They will no longer be able to access the admin portal.</p>
                        <div class="flex space-x-3">
                            <button id="cancel-remove-user" class="flex-1 btn-secondary">Cancel</button>
                            <button id="confirm-remove-user" class="flex-1 btn-danger">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async initialize(user, eventsService) {
        this.user = user;
        this.eventsService = eventsService;
        
        // Only load if user has permissions
        if (user.permissions && user.permissions.includes('manage-users')) {
            await this.loadUsers();
            this.setupEventListeners();
        }
    }

    async loadUsers() {
        try {
            const result = await this.eventsService.getAdminUsers();
            
            if (result.success) {
                this.users = result.users || [];
                this.renderUsersList();
            } else {
                console.error('Failed to load users:', result.error);
                this.showError(result.error || 'Failed to load users');
            }
        } catch (error) {
            console.error('Error loading users:', error);
            this.showError('Unable to connect to backend');
        }
    }

    setupEventListeners() {
        // Add user button
        document.getElementById('add-user-btn')?.addEventListener('click', () => this.showAddUserModal());
        
        // Refresh button
        document.getElementById('refresh-users-btn')?.addEventListener('click', () => this.loadUsers());
        
        // Add user modal
        document.getElementById('close-add-modal')?.addEventListener('click', () => this.hideAddUserModal());
        document.getElementById('cancel-add-user')?.addEventListener('click', () => this.hideAddUserModal());
        document.getElementById('add-user-form')?.addEventListener('submit', (e) => this.handleAddUser(e));
        
        // Remove user modal
        document.getElementById('cancel-remove-user')?.addEventListener('click', () => this.hideRemoveUserModal());
        document.getElementById('confirm-remove-user')?.addEventListener('click', () => this.confirmRemoveUser());
    }

    renderUsersList() {
        const container = document.getElementById('users-list');
        
        if (this.users.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-admin-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                    <p class="text-admin-600">No users found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-admin-200">
                    <thead class="bg-admin-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">User</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">Role</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">Last Login</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">Added By</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-admin-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-admin-200">
                        ${this.users.map(user => this.renderUserRow(user)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderUserRow(user) {
        const isCurrentUser = user.email === this.user.email;
        const isSuperAdmin = user.role === 'super-admin';
        const canRemove = !isCurrentUser && !isSuperAdmin;
        
        return `
            <tr class="hover:bg-admin-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-islamic-green-100 flex items-center justify-center">
                                <span class="text-sm font-medium text-islamic-green-800">${user.name.charAt(0).toUpperCase()}</span>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-admin-900">
                                ${user.name}
                                ${isCurrentUser ? '<span class="ml-2 text-xs text-islamic-green-600">(You)</span>' : ''}
                            </div>
                            <div class="text-sm text-admin-500">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold ${this.getRoleBadgeClass(user.role)} rounded-full">
                        ${this.formatRole(user.role)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-full">
                        ${user.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-admin-500">
                    ${user.lastLogin ? this.eventsService.formatDate(user.lastLogin) : 'Never'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-admin-500">
                    ${user.addedBy || 'System'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${canRemove ? `
                        <button onclick="window.adminApp.currentPage === 'users' && window.adminApp.pages.users.removeUser('${user.email}')" 
                                class="text-red-600 hover:text-red-900">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    ` : `
                        <span class="text-admin-300">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </span>
                    `}
                </td>
            </tr>
        `;
    }

    getRoleBadgeClass(role) {
        const classes = {
            'super-admin': 'bg-purple-100 text-purple-800',
            'admin': 'bg-blue-100 text-blue-800',
            'editor': 'bg-yellow-100 text-yellow-800'
        };
        return classes[role] || 'bg-gray-100 text-gray-800';
    }

    formatRole(role) {
        return role.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    showAddUserModal() {
        document.getElementById('add-user-modal').classList.remove('hidden');
        document.getElementById('add-user-form').reset();
    }

    hideAddUserModal() {
        document.getElementById('add-user-modal').classList.add('hidden');
    }

    async handleAddUser(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());
        
        this.setAddUserLoading(true);
        
        try {
            const result = await this.eventsService.addAdminUser(userData);
            
            if (result.success) {
                this.showSuccess('User added successfully');
                await this.loadUsers();
                this.hideAddUserModal();
            } else {
                throw new Error(result.error || 'Failed to add user');
            }
            
        } catch (error) {
            console.error('Add user error:', error);
            this.showError(error.message);
        } finally {
            this.setAddUserLoading(false);
        }
    }

    removeUser(email) {
        this.userToRemove = email;
        document.getElementById('remove-user-modal').classList.remove('hidden');
    }

    hideRemoveUserModal() {
        document.getElementById('remove-user-modal').classList.add('hidden');
        this.userToRemove = null;
    }

    async confirmRemoveUser() {
        if (!this.userToRemove) return;
        
        try {
            const result = await this.eventsService.removeAdminUser(this.userToRemove);
            
            if (result.success) {
                this.showSuccess('User removed successfully');
                await this.loadUsers();
            } else {
                throw new Error(result.error || 'Failed to remove user');
            }
        } catch (error) {
            console.error('Remove user error:', error);
            this.showError(error.message);
        } finally {
            this.hideRemoveUserModal();
        }
    }

    setAddUserLoading(loading) {
        const saveBtn = document.getElementById('save-user-btn');
        const saveBtnText = document.getElementById('save-user-text');
        const saveBtnSpinner = document.getElementById('save-user-spinner');
        
        if (loading) {
            saveBtn.disabled = true;
            saveBtnText.textContent = 'Adding...';
            saveBtnSpinner.classList.remove('hidden');
        } else {
            saveBtn.disabled = false;
            saveBtnText.textContent = 'Add User';
            saveBtnSpinner.classList.add('hidden');
        }
    }

    showSuccess(message) {
        alert(message);
    }

    showError(message) {
        alert('Error: ' + message);
    }
}
