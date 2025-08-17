/**
 * SSMA Sacramento Events Management System
 * Google Apps Script Backend
 * 
 * Main entry point for all API requests
 * Handles routing, CORS, and request processing
 */

// Configuration
const CONFIG = {
  // Spreadsheet IDs (replace with your actual IDs)
  EVENTS_SHEET_ID: 'YOUR_EVENTS_SPREADSHEET_ID', // Replace this
  
  // Allowed origins for CORS
  ALLOWED_ORIGINS: [
    'https://sacramento110.org',
    'https://admin.sacramento110.org',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173'
  ],
  
  // Admin configuration
  ADMIN_CONFIG: {
    // Initial super admin - replace with your Gmail address
    SUPER_ADMIN: 'your-email@gmail.com', // REPLACE THIS WITH YOUR EMAIL
    
    // OAuth client configuration
    OAUTH_CLIENT_ID: 'YOUR_GOOGLE_OAUTH_CLIENT_ID', // Replace this
    
    // Session timeout (24 hours)
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000
  },
  
  // Drive folder configuration
  DRIVE_CONFIG: {
    EVENTS_FOLDER_NAME: 'SSMA Events',
    ARCHIVE_FOLDER_NAME: 'Archive'
  }
};

/**
 * Main GET request handler
 */
function doGet(e) {
  return handleRequest(e, 'GET');
}

/**
 * Main POST request handler
 */
function doPost(e) {
  return handleRequest(e, 'POST');
}

/**
 * Main request handler with routing and CORS
 */
function handleRequest(e, method) {
  try {
    // Get request origin
    const origin = e.parameter.origin || getOriginFromHeaders(e);
    
    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return createCORSResponse('', origin);
    }
    
    // Get path and parameters
    const path = e.parameter.path || '/';
    const endpoint = `${method} ${path}`;
    
    Logger.log(`Incoming request: ${endpoint} from origin: ${origin}`);
    
    // Route to appropriate handler
    let response;
    
    switch (endpoint) {
      // Public endpoints (no auth required)
      case 'GET /api/events':
        response = EventsService.getActiveEvents();
        break;
      
      case 'GET /api/events/':
        const eventId = e.parameter.id;
        if (!eventId) {
          throw new Error('Event ID is required');
        }
        response = EventsService.getEventById(eventId);
        break;
      
      // Admin endpoints (OAuth required)
      case 'POST /api/admin/auth/verify':
        response = AuthService.verifyGoogleToken(e);
        break;
      
      case 'POST /api/admin/events':
        const authResult = AuthService.requireAuth(e);
        response = EventsService.createEvent(e, authResult);
        break;
      
      case 'PUT /api/admin/events/':
        const authResult2 = AuthService.requireAuth(e);
        const eventId2 = e.parameter.id;
        response = EventsService.updateEvent(eventId2, e, authResult2);
        break;
      
      case 'DELETE /api/admin/events/':
        const authResult3 = AuthService.requireAuth(e);
        const eventId3 = e.parameter.id;
        response = EventsService.deleteEvent(eventId3, authResult3);
        break;
      
      case 'POST /api/admin/events/upload':
        const authResult4 = AuthService.requireAuth(e);
        response = DriveService.uploadEventImage(e, authResult4);
        break;
      
      case 'GET /api/admin/analytics':
        const authResult5 = AuthService.requireAuth(e);
        response = AnalyticsService.getDashboardMetrics(authResult5);
        break;
      
      case 'GET /api/admin/activity':
        const authResult6 = AuthService.requireAuth(e);
        response = ActivityLogger.getActivityLog(authResult6);
        break;
      
      case 'POST /api/admin/cleanup':
        const authResult7 = AuthService.requireAuth(e);
        response = CleanupService.runManualCleanup(authResult7);
        break;
      
      case 'GET /api/admin/users':
        const authResult8 = AuthService.requireAuth(e);
        response = UserService.getAdminUsers(authResult8);
        break;
      
      case 'POST /api/admin/users':
        const authResult9 = AuthService.requireAuth(e);
        response = UserService.addAdminUser(e, authResult9);
        break;
      
      case 'DELETE /api/admin/users/':
        const authResult10 = AuthService.requireAuth(e);
        const userEmail = e.parameter.email;
        response = UserService.removeAdminUser(userEmail, authResult10);
        break;
      
      default:
        response = {
          error: 'Endpoint not found',
          status: 404,
          endpoint: endpoint
        };
    }
    
    return createCORSResponse(JSON.stringify(response), origin);
    
  } catch (error) {
    Logger.log(`Error handling request: ${error.message}`);
    Logger.log(`Stack trace: ${error.stack}`);
    
    const errorResponse = {
      error: error.message,
      status: 500,
      timestamp: new Date().toISOString()
    };
    
    return createCORSResponse(JSON.stringify(errorResponse), origin);
  }
}

/**
 * Create CORS-enabled response
 */
function createCORSResponse(content, origin) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, X-Requested-With',
    'Access-Control-Max-Age': '86400' // 24 hours
  };
  
  // Set origin if it's in allowed list
  if (CONFIG.ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else {
    headers['Access-Control-Allow-Origin'] = CONFIG.ALLOWED_ORIGINS[0]; // fallback to main domain
  }
  
  return ContentService
    .createTextOutput(content)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}

/**
 * Extract origin from headers (fallback method)
 */
function getOriginFromHeaders(e) {
  // Try to get origin from various sources
  if (e.parameter && e.parameter.origin) {
    return e.parameter.origin;
  }
  
  // Default to main domain
  return CONFIG.ALLOWED_ORIGINS[0];
}

/**
 * Initialize the system on first deployment
 */
function initializeSystem() {
  try {
    Logger.log('Initializing SSMA Events Management System...');
    
    // Initialize Google Sheets
    SheetsService.initializeSheets();
    
    // Initialize Google Drive folders
    DriveService.initializeFolders();
    
    // Set up cleanup trigger
    CleanupService.setupCleanupTrigger();
    
    // Initialize admin user
    UserService.initializeSuperAdmin();
    
    Logger.log('System initialization completed successfully!');
    
    return {
      success: true,
      message: 'System initialized successfully',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log(`System initialization failed: ${error.message}`);
    throw error;
  }
}

/**
 * Manual cleanup trigger for testing
 */
function testCleanup() {
  return CleanupService.autoCleanupPastEvents();
}

/**
 * Test function to verify system health
 */
function healthCheck() {
  try {
    const health = {
      timestamp: new Date().toISOString(),
      services: {
        sheets: SheetsService.testConnection(),
        drive: DriveService.testConnection(),
        auth: AuthService.testConfiguration()
      },
      config: {
        hasEventsSheetId: !!CONFIG.EVENTS_SHEET_ID && CONFIG.EVENTS_SHEET_ID !== 'YOUR_EVENTS_SPREADSHEET_ID',
        hasOAuthClientId: !!CONFIG.ADMIN_CONFIG.OAUTH_CLIENT_ID && CONFIG.ADMIN_CONFIG.OAUTH_CLIENT_ID !== 'YOUR_GOOGLE_OAUTH_CLIENT_ID',
        hasSuperAdmin: !!CONFIG.ADMIN_CONFIG.SUPER_ADMIN && CONFIG.ADMIN_CONFIG.SUPER_ADMIN !== 'your-email@gmail.com'
      }
    };
    
    Logger.log('Health check results:', JSON.stringify(health));
    return health;
    
  } catch (error) {
    Logger.log(`Health check failed: ${error.message}`);
    return {
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
