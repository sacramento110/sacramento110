/**
 * Production Configuration
 * Update these values for your production deployment
 */

export const PRODUCTION_CONFIG = {
  // Google Apps Script Configuration
  BACKEND: {
    // Replace with your deployed Google Apps Script URL
    API_URL: 'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec',
    TIMEOUT: 30000,
    MAX_RETRIES: 3
  },

  // Google OAuth Configuration
  AUTH: {
    // Replace with your Google OAuth Client ID
    CLIENT_ID: 'YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com',
    
    // Authorized domains for OAuth
    AUTHORIZED_DOMAINS: [
      'https://sacramento110.org',
      'https://admin.sacramento110.org'
    ]
  },

  // Domain Configuration
  DOMAINS: {
    MAIN_SITE: 'https://sacramento110.org',
    ADMIN_PORTAL: 'https://admin.sacramento110.org',
    
    // Development URLs (for testing)
    DEV_MAIN: 'http://localhost:5173/sacramento110/',
    DEV_ADMIN: 'http://localhost:3001'
  },

  // Feature Flags
  FEATURES: {
    ENABLE_ANALYTICS: true,
    ENABLE_ERROR_REPORTING: true,
    ENABLE_PERFORMANCE_MONITORING: true,
    ENABLE_OFFLINE_SUPPORT: false
  },

  // Security Configuration
  SECURITY: {
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    REQUIRE_HTTPS: true
  },

  // File Upload Configuration
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    COMPRESSION_QUALITY: 0.8
  },

  // API Rate Limiting
  RATE_LIMITING: {
    REQUESTS_PER_MINUTE: 100,
    REQUESTS_PER_HOUR: 1000
  }
};

/**
 * Environment Detection
 */
export const getEnvironment = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  } else if (hostname.includes('github.io')) {
    return 'staging';
  } else {
    return 'production';
  }
};

/**
 * Get configuration for current environment
 */
export const getConfig = () => {
  const env = getEnvironment();
  const config = { ...PRODUCTION_CONFIG };
  
  // Override URLs based on environment
  if (env === 'development') {
    config.DOMAINS.CURRENT_MAIN = config.DOMAINS.DEV_MAIN;
    config.DOMAINS.CURRENT_ADMIN = config.DOMAINS.DEV_ADMIN;
    config.SECURITY.REQUIRE_HTTPS = false;
  } else {
    config.DOMAINS.CURRENT_MAIN = config.DOMAINS.MAIN_SITE;
    config.DOMAINS.CURRENT_ADMIN = config.DOMAINS.ADMIN_PORTAL;
  }
  
  return config;
};
