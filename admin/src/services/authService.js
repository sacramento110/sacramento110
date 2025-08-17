/**
 * Authentication Service for Admin Portal
 * Handles Google OAuth authentication
 */

export class AuthService {
    constructor() {
        this.config = {
            // Replace with your actual Google OAuth Client ID
            googleClientId: 'YOUR_GOOGLE_OAUTH_CLIENT_ID',
            storageKeys: {
                token: 'ssma_admin_token',
                user: 'ssma_admin_user',
                expires: 'ssma_admin_expires'
            },
            tokenExpiry: 24 * 60 * 60 * 1000 // 24 hours
        };
        
        this.googleAuth = null;
        this.currentUser = null;
        this.isInitialized = false;
    }

    /**
     * Initialize Google OAuth
     */
    async initialize() {
        try {
            if (this.isInitialized) return true;

            // Load Google API if not already loaded
            if (!window.gapi) {
                await this.loadGoogleAPI();
            }

            // Load auth2 library
            await new Promise((resolve, reject) => {
                window.gapi.load('auth2', {
                    callback: resolve,
                    onerror: reject
                });
            });

            // Initialize auth2
            this.googleAuth = await window.gapi.auth2.init({
                client_id: this.config.googleClientId,
                scope: 'profile email'
            });

            this.isInitialized = true;

            // Check for existing authentication
            await this.checkExistingAuth();

            return true;
        } catch (error) {
            console.error('Failed to initialize Google Auth:', error);
            throw new Error('Authentication initialization failed');
        }
    }

    /**
     * Load Google API script
     */
    loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Google API'));
            document.head.appendChild(script);
        });
    }

    /**
     * Check for existing authentication
     */
    async checkExistingAuth() {
        try {
            const storedToken = localStorage.getItem(this.config.storageKeys.token);
            const storedUser = localStorage.getItem(this.config.storageKeys.user);
            const storedExpires = localStorage.getItem(this.config.storageKeys.expires);

            if (!storedToken || !storedUser || !storedExpires) {
                return;
            }

            // Check if token has expired
            const expiresAt = parseInt(storedExpires);
            if (Date.now() > expiresAt) {
                this.clearStoredAuth();
                return;
            }

            // Verify token with backend
            const user = JSON.parse(storedUser);
            const verifyResult = await this.verifyTokenWithBackend(storedToken);

            if (verifyResult.success) {
                this.currentUser = {
                    ...user,
                    role: verifyResult.role,
                    permissions: verifyResult.permissions
                };
            } else {
                this.clearStoredAuth();
            }
        } catch (error) {
            console.error('Error checking existing auth:', error);
            this.clearStoredAuth();
        }
    }

    /**
     * Sign in with Google
     */
    async signIn() {
        try {
            if (!this.isInitialized) {
                throw new Error('Authentication not initialized');
            }

            // Perform Google sign-in
            const authUser = await this.googleAuth.signIn({
                prompt: 'select_account'
            });

            const idToken = authUser.getAuthResponse().id_token;
            const profile = authUser.getBasicProfile();

            // Verify with backend
            const result = await this.verifyTokenWithBackend(idToken);

            if (result.success && result.user) {
                const user = {
                    email: result.user.email,
                    name: result.user.name,
                    picture: result.user.picture,
                    role: result.role,
                    permissions: result.permissions
                };

                // Store authentication
                this.storeAuth(idToken, user);
                this.currentUser = user;

                return {
                    success: true,
                    user: user,
                    token: idToken
                };
            } else {
                throw new Error(result.error || 'Authentication failed');
            }
        } catch (error) {
            console.error('Sign-in failed:', error);
            
            let errorMessage = 'Sign-in failed';
            
            if (error.error === 'popup_closed_by_user') {
                errorMessage = 'Sign-in was cancelled';
            } else if (error.error === 'access_denied') {
                errorMessage = 'Access denied. Please try again.';
            } else if (error.error === 'popup_blocked') {
                errorMessage = 'Popup blocked. Please allow popups and try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Sign out
     */
    async signOut() {
        try {
            if (this.googleAuth) {
                await this.googleAuth.signOut();
            }
        } catch (error) {
            console.error('Google sign-out error:', error);
        }

        this.clearStoredAuth();
        this.currentUser = null;
    }

    /**
     * Verify token with backend
     */
    async verifyTokenWithBackend(idToken) {
        try {
            // Replace with your actual Google Apps Script URL
            const backendUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
            
            const response = await fetch(`${backendUrl}?path=${encodeURIComponent('/api/admin/auth/verify')}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': window.location.origin
                },
                body: JSON.stringify({ idToken })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success && data.user) {
                return {
                    success: true,
                    user: data.user,
                    role: data.role,
                    permissions: data.permissions
                };
            } else {
                return {
                    success: false,
                    error: data.error || 'Verification failed'
                };
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            return {
                success: false,
                error: 'Unable to verify credentials'
            };
        }
    }

    /**
     * Store authentication data
     */
    storeAuth(token, user) {
        const expiresAt = Date.now() + this.config.tokenExpiry;
        
        localStorage.setItem(this.config.storageKeys.token, token);
        localStorage.setItem(this.config.storageKeys.user, JSON.stringify(user));
        localStorage.setItem(this.config.storageKeys.expires, expiresAt.toString());
    }

    /**
     * Clear stored authentication
     */
    clearStoredAuth() {
        localStorage.removeItem(this.config.storageKeys.token);
        localStorage.removeItem(this.config.storageKeys.user);
        localStorage.removeItem(this.config.storageKeys.expires);
    }

    /**
     * Get current authenticated user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Check if user has specific permission
     */
    hasPermission(permission) {
        if (!this.currentUser || !this.currentUser.permissions) {
            return false;
        }
        return this.currentUser.permissions.includes(permission);
    }

    /**
     * Get current auth token
     */
    getToken() {
        return localStorage.getItem(this.config.storageKeys.token);
    }

    /**
     * Check if token is expired
     */
    isTokenExpired() {
        const expiresAt = localStorage.getItem(this.config.storageKeys.expires);
        if (!expiresAt) return true;
        
        return Date.now() > parseInt(expiresAt);
    }

    /**
     * Get authentication status
     */
    getAuthStatus() {
        const issues = [];

        if (this.config.googleClientId === 'YOUR_GOOGLE_OAUTH_CLIENT_ID') {
            issues.push('Google OAuth Client ID not configured');
        }

        return {
            isAuthenticated: this.isAuthenticated(),
            user: this.currentUser,
            tokenExpired: this.isTokenExpired(),
            configurationIssues: issues
        };
    }

    /**
     * Refresh authentication
     */
    async refreshAuth() {
        try {
            if (!this.googleAuth) return false;

            const authUser = this.googleAuth.currentUser.get();
            if (!authUser.isSignedIn()) return false;

            const idToken = authUser.getAuthResponse().id_token;
            const result = await this.verifyTokenWithBackend(idToken);

            if (result.success && result.user) {
                const user = {
                    email: result.user.email,
                    name: result.user.name,
                    picture: result.user.picture,
                    role: result.role,
                    permissions: result.permissions
                };

                this.storeAuth(idToken, user);
                this.currentUser = user;
                return true;
            }

            return false;
        } catch (error) {
            console.error('Auth refresh failed:', error);
            return false;
        }
    }
}
