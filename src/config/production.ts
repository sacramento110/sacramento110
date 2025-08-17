/**
 * Production Configuration for Main Website
 */

export const PRODUCTION_CONFIG = {
  // Google Apps Script Backend
  BACKEND: {
    API_URL: import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec',
    TIMEOUT: 30000,
    MAX_RETRIES: 3
  },

  // Site Configuration
  SITE: {
    NAME: 'SSMA Sacramento',
    TITLE: 'Sacramento Shia Muslim Association',
    DESCRIPTION: 'Sacramento Shia Muslim Association - Events, Prayer Times, and Community Information',
    URL: 'https://sacramento110.org',
    ADMIN_URL: 'https://admin.sacramento110.org'
  },

  // Features Configuration
  FEATURES: {
    ENABLE_EVENTS: true,
    ENABLE_PRAYER_TIMES: true,
    ENABLE_YOUTUBE: true,
    ENABLE_NEWSLETTER: true,
    ENABLE_DONATIONS: true,
    ENABLE_EVENT_SHARING: true,
    ENABLE_ANALYTICS: true
  },

  // External APIs
  APIS: {
    PRAYER_TIMES: {
      ENABLED: true,
      CITY: 'Sacramento',
      COUNTRY: 'US',
      METHOD: 2 // Islamic Society of North America (ISNA)
    },
    YOUTUBE: {
      ENABLED: true,
      API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY || '',
      CHANNEL_ID: import.meta.env.VITE_YOUTUBE_CHANNEL_ID || '',
      MAX_RESULTS: 6
    }
  },

  // Performance
  PERFORMANCE: {
    ENABLE_SERVICE_WORKER: true,
    ENABLE_CACHING: true,
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    LAZY_LOAD_IMAGES: true
  },

  // SEO
  SEO: {
    ENABLE_SCHEMA_ORG: true,
    ENABLE_OPEN_GRAPH: true,
    ENABLE_TWITTER_CARDS: true,
    CANONICAL_URL: 'https://sacramento110.org'
  },

  // Analytics (if needed)
  ANALYTICS: {
    ENABLED: false,
    GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GA_ID || '',
    TRACK_EVENTS: true,
    TRACK_PAGE_VIEWS: true
  }
};

/**
 * Environment Detection
 */
export const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
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
  
  // Override settings based on environment
  if (env === 'development') {
    config.BACKEND.API_URL = 'http://localhost:3000/api'; // Local development server
    config.FEATURES.ENABLE_ANALYTICS = false;
    config.PERFORMANCE.ENABLE_SERVICE_WORKER = false;
  } else if (env === 'staging') {
    config.SITE.URL = `https://${window.location.hostname}`;
    config.FEATURES.ENABLE_ANALYTICS = false;
  }
  
  return config;
};

/**
 * API Endpoints
 */
export const getAPIEndpoints = () => {
  const config = getConfig();
  const baseURL = config.BACKEND.API_URL;
  
  return {
    // Events
    EVENTS: `${baseURL}?action=getActiveEvents`,
    EVENT_DETAIL: (id: string) => `${baseURL}?action=getEvent&id=${id}`,
    
    // Health Check
    HEALTH: `${baseURL}?action=health`,
    
    // Analytics (if needed)
    ANALYTICS: `${baseURL}?action=getAnalytics`
  };
};

/**
 * Default configuration export
 */
export default getConfig();
