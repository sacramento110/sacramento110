/**
 * Authentication Service
 * Handles Google OAuth authentication for admin portal
 */

import { eventsService } from './eventsService';

// Configuration
const AUTH_CONFIG = {
  // Replace with your Google OAuth Client ID
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_OAUTH_CLIENT_ID',
  
  // Storage keys
  STORAGE_KEYS: {
    TOKEN: 'ssma_admin_token',
    USER: 'ssma_admin_user',
    EXPIRES: 'ssma_admin_expires'
  },
  
  // Token expiration (24 hours)
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000
};

interface AdminUser {
  email: string;
  name: string;
  picture: string;
  role: string;
  permissions: string[];
}

interface AuthResult {
  success: boolean;
  user?: AdminUser;
  token?: string;
  error?: string;
}

class AuthService {
  private googleAuth: any = null;
  private currentUser: AdminUser | null = null;
  private isInitialized = false;

  /**
   * Initialize Google OAuth
   */
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      // Load Google API
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
        client_id: AUTH_CONFIG.GOOGLE_CLIENT_ID,
        scope: 'profile email'
      });

      this.isInitialized = true;

      // Check for existing authentication
      await this.checkExistingAuth();

      return true;
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
      return false;
    }
  }

  /**
   * Load Google API script
   */
  private loadGoogleAPI(): Promise<void> {
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
  private async checkExistingAuth(): Promise<void> {
    try {
      const storedToken = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER);
      const storedExpires = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.EXPIRES);

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
        this.currentUser = user;
        eventsService.setAuthToken(storedToken);
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
  async signIn(): Promise<AuthResult> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Authentication not initialized');
        }
      }

      // Perform Google sign-in
      const authUser = await this.googleAuth.signIn({
        prompt: 'select_account'
      });

      const idToken = authUser.getAuthResponse().id_token;

      // Verify with backend
      const result = await this.verifyTokenWithBackend(idToken);

      if (result.success && result.user) {
        // Store authentication
        this.storeAuth(idToken, result.user);
        
        // Set token for API calls
        eventsService.setAuthToken(idToken);
        
        this.currentUser = result.user;

        return {
          success: true,
          user: result.user,
          token: idToken
        };
      } else {
        throw new Error(result.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Sign-in failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sign-in failed'
      };
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      if (this.googleAuth) {
        await this.googleAuth.signOut();
      }
    } catch (error) {
      console.error('Google sign-out error:', error);
    }

    this.clearStoredAuth();
    eventsService.clearAuthToken();
    this.currentUser = null;
  }

  /**
   * Verify token with backend
   */
  private async verifyTokenWithBackend(idToken: string): Promise<{
    success: boolean;
    user?: AdminUser;
    error?: string;
  }> {
    try {
      const response = await fetch(`${eventsService['baseUrl']}?path=${encodeURIComponent('/api/admin/auth/verify')}`, {
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
          user: {
            email: data.user.email,
            name: data.user.name,
            picture: data.user.picture,
            role: data.role,
            permissions: data.permissions
          }
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
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  /**
   * Store authentication data
   */
  private storeAuth(token: string, user: AdminUser): void {
    const expiresAt = Date.now() + AUTH_CONFIG.TOKEN_EXPIRY;
    
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.EXPIRES, expiresAt.toString());
  }

  /**
   * Clear stored authentication
   */
  private clearStoredAuth(): void {
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.EXPIRES);
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): AdminUser | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    if (!this.currentUser || !this.currentUser.permissions) {
      return false;
    }
    return this.currentUser.permissions.includes(permission);
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN);
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.EXPIRES);
    if (!expiresAt) return true;
    
    return Date.now() > parseInt(expiresAt);
  }

  /**
   * Refresh authentication
   */
  async refreshAuth(): Promise<boolean> {
    try {
      if (!this.googleAuth) return false;

      const authUser = this.googleAuth.currentUser.get();
      if (!authUser.isSignedIn()) return false;

      const idToken = authUser.getAuthResponse().id_token;
      const result = await this.verifyTokenWithBackend(idToken);

      if (result.success && result.user) {
        this.storeAuth(idToken, result.user);
        eventsService.setAuthToken(idToken);
        this.currentUser = result.user;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Auth refresh failed:', error);
      return false;
    }
  }

  /**
   * Get authentication status
   */
  getAuthStatus(): {
    isAuthenticated: boolean;
    user: AdminUser | null;
    tokenExpired: boolean;
    configurationIssues: string[];
  } {
    const issues: string[] = [];

    if (AUTH_CONFIG.GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_OAUTH_CLIENT_ID') {
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
   * Handle authentication errors
   */
  handleAuthError(error: any): string {
    if (error.error === 'popup_closed_by_user') {
      return 'Sign-in was cancelled';
    }
    
    if (error.error === 'access_denied') {
      return 'Access denied. Please try again.';
    }
    
    if (error.error === 'popup_blocked') {
      return 'Popup blocked. Please allow popups and try again.';
    }
    
    return error.details || error.message || 'Authentication failed';
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gapi: any;
  }
}
