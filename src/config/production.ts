/**
 * Production Configuration for Main Website
 */

export const PRODUCTION_CONFIG = {
  // Site Configuration
  SITE: {
    NAME: 'SSMA Sacramento',
    TITLE: 'Sacramento Shia Muslim Association',
    DESCRIPTION:
      'Sacramento Shia Muslim Association - Prayer Times, Videos, and Community Information',
    URL: 'https://sacramento110.org',
  },

  // Features Configuration
  FEATURES: {
    ENABLE_PRAYER_TIMES: true,
    ENABLE_YOUTUBE: true,
    ENABLE_NEWSLETTER: false, // Disabled until email subscription facility is ready
    ENABLE_DONATIONS: true,
    ENABLE_ANALYTICS: true,
  },

  // External APIs
  APIS: {
    PRAYER_TIMES: {
      ENABLED: true,
      CITY: 'Sacramento',
      COUNTRY: 'US',
      METHOD: 2, // Islamic Society of North America (ISNA)
    },
    YOUTUBE: {
      ENABLED: true,
      API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY || '',
      CHANNEL_ID: import.meta.env.VITE_YOUTUBE_CHANNEL_ID || '',
      MAX_RESULTS: 6,
    },
  },

  // Performance
  PERFORMANCE: {
    ENABLE_SERVICE_WORKER: true,
    ENABLE_CACHING: true,
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    LAZY_LOAD_IMAGES: true,
  },

  // SEO
  SEO: {
    ENABLE_SCHEMA_ORG: true,
    ENABLE_OPEN_GRAPH: true,
    ENABLE_TWITTER_CARDS: true,
    CANONICAL_URL: 'https://sacramento110.org',
  },

  // Analytics (if needed)
  ANALYTICS: {
    ENABLED: false,
    GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GA_ID || '',
    TRACK_EVENTS: true,
    TRACK_PAGE_VIEWS: true,
  },
};

/**
 * Environment Detection
 */
export const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const hostname =
    typeof window !== 'undefined' ? window.location.hostname : '';

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
    config.FEATURES.ENABLE_ANALYTICS = false;
    config.PERFORMANCE.ENABLE_SERVICE_WORKER = false;
  } else if (env === 'staging') {
    config.SITE.URL = `https://${window.location.hostname}`;
    config.FEATURES.ENABLE_ANALYTICS = false;
  }

  return config;
};

/**
 * Default configuration export
 */
export default getConfig();
