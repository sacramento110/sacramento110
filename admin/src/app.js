/**
 * SSMA Admin Portal - Main Application
 */

import { AuthService } from './services/authService.js';
import { EventsService } from './services/eventsService.js';
import { DashboardPage } from './pages/dashboard.js';
import { EventsPage } from './pages/events.js';
import { UsersPage } from './pages/users.js';
import { ActivityPage } from './pages/activity.js';
import { SettingsPage } from './pages/settings.js';

class AdminApp {
    constructor() {
        this.authService = new AuthService();
        this.eventsService = new EventsService();
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.pages = {
            dashboard: new DashboardPage(),
            events: new EventsPage(),
            users: new UsersPage(),
            activity: new ActivityPage(),
            settings: new SettingsPage()
        };
        
        this.init();
    }

    async init() {
        try {
            // Initialize authentication
            await this.authService.initialize();
            
            // Check if user is already authenticated
            const authStatus = this.authService.getAuthStatus();
            
            if (authStatus.isAuthenticated && !authStatus.tokenExpired) {
                this.currentUser = authStatus.user;
                this.showAdminInterface();
            } else {
                this.showLoginPage();
            }
            
            this.setupEventListeners();
            
        } catch (error) {
            console.error('Failed to initialize admin app:', error);
            this.showError('Failed to initialize application');
        } finally {
            this.hideLoadingScreen();
        }
    }

    setupEventListeners() {
        // Google Sign-in button
        const googleSigninBtn = document.getElementById('google-signin-btn');
        if (googleSigninBtn) {
            googleSigninBtn.addEventListener('click', () => this.handleGoogleSignIn());
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Navigation items
        const navItems = document.querySelectorAll('.nav-item[data-page]');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const sidebar = document.getElementById('sidebar');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('-translate-x-full');
                mobileOverlay.classList.toggle('hidden');
            });
        }

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => {
                sidebar.classList.add('-translate-x-full');
                mobileOverlay.classList.add('hidden');
            });
        }
    }

    async handleGoogleSignIn() {
        try {
            this.setLoading('google-signin-btn', true);
            this.hideError('login-error');

            const result = await this.authService.signIn();

            if (result.success) {
                this.currentUser = result.user;
                this.eventsService.setAuthToken(result.token);
                this.showAdminInterface();
            } else {
                this.showError(result.error, 'login-error');
            }
        } catch (error) {
            console.error('Sign-in failed:', error);
            this.showError('Sign-in failed. Please try again.', 'login-error');
        } finally {
            this.setLoading('google-signin-btn', false);
        }
    }

    async handleLogout() {
        try {
            await this.authService.signOut();
            this.currentUser = null;
            this.eventsService.clearAuthToken();
            this.showLoginPage();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    showLoginPage() {
        document.getElementById('login-page').classList.remove('hidden');
        document.getElementById('admin-interface').classList.add('hidden');
    }

    showAdminInterface() {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('admin-interface').classList.remove('hidden');
        
        this.updateUserInfo();
        this.setupUserPermissions();
        this.navigateToPage(this.currentPage);
    }

    updateUserInfo() {
        if (!this.currentUser) return;

        // Update user avatar and name in sidebar
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const userRole = document.getElementById('user-role');
        const headerUserName = document.getElementById('header-user-name');

        if (userAvatar) userAvatar.src = this.currentUser.picture || '/default-avatar.png';
        if (userName) userName.textContent = this.currentUser.name;
        if (userRole) userRole.textContent = this.capitalizeRole(this.currentUser.role);
        if (headerUserName) headerUserName.textContent = this.currentUser.name;
    }

    setupUserPermissions() {
        if (!this.currentUser) return;

        // Show/hide navigation items based on permissions
        const usersNav = document.getElementById('users-nav');
        
        if (this.currentUser.permissions && this.currentUser.permissions.includes('manage-users')) {
            usersNav?.classList.remove('hidden');
        } else {
            usersNav?.classList.add('hidden');
        }
    }

    async navigateToPage(pageName) {
        if (!this.pages[pageName]) {
            console.error(`Page ${pageName} not found`);
            return;
        }

        // Update current page
        this.currentPage = pageName;

        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`)?.classList.add('active');

        // Update page title
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = this.getPageTitle(pageName);
        }

        // Load page content
        try {
            const pageContent = document.getElementById('page-content');
            pageContent.innerHTML = '<div class="flex items-center justify-center h-64"><div class="loading-spinner w-8 h-8 border-4 border-islamic-green-200 border-t-islamic-green-600 rounded-full"></div></div>';
            
            const content = await this.pages[pageName].render(this.currentUser, this.eventsService);
            pageContent.innerHTML = content;
            
            // Initialize page-specific functionality
            await this.pages[pageName].initialize(this.currentUser, this.eventsService);
            
        } catch (error) {
            console.error(`Failed to load page ${pageName}:`, error);
            this.showPageError('Failed to load page content');
        }

        // Close mobile menu if open
        const sidebar = document.getElementById('sidebar');
        const mobileOverlay = document.getElementById('mobile-overlay');
        sidebar?.classList.add('-translate-x-full');
        mobileOverlay?.classList.add('hidden');
    }

    getPageTitle(pageName) {
        const titles = {
            dashboard: 'Dashboard',
            events: 'Events Management',
            users: 'User Management',
            activity: 'Activity Logs',
            settings: 'Settings'
        };
        return titles[pageName] || 'Admin Portal';
    }

    capitalizeRole(role) {
        return role.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    showError(message, containerId = 'error-container') {
        const errorContainer = document.getElementById(containerId);
        if (errorContainer) {
            errorContainer.classList.remove('hidden');
            const errorText = errorContainer.querySelector('p');
            if (errorText) {
                errorText.textContent = message;
            }
        } else {
            alert(message); // Fallback
        }
    }

    hideError(containerId) {
        const errorContainer = document.getElementById(containerId);
        if (errorContainer) {
            errorContainer.classList.add('hidden');
        }
    }

    showPageError(message) {
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            pageContent.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-admin-900 mb-2">Error Loading Page</h3>
                    <p class="text-admin-600 mb-4">${message}</p>
                    <button class="btn-primary" onclick="location.reload()">Refresh Page</button>
                </div>
            `;
        }
    }

    setLoading(elementId, loading) {
        const element = document.getElementById(elementId);
        if (element) {
            if (loading) {
                element.disabled = true;
                element.innerHTML = '<div class="loading-spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>Loading...';
            } else {
                element.disabled = false;
                // Restore original content based on element
                if (elementId === 'google-signin-btn') {
                    element.innerHTML = `
                        <svg class="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Sign in with Google</span>
                    `;
                }
            }
        }
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.adminApp = new AdminApp();
});

// Export for debugging
window.AdminApp = AdminApp;
