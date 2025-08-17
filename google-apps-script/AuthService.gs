/**
 * Authentication Service
 * Handles Google OAuth authentication and authorization
 */

const AuthService = {
  
  /**
   * Verify Google OAuth token and authenticate user
   */
  verifyGoogleToken(e) {
    try {
      const postData = JSON.parse(e.postData.getDataAsString());
      const idToken = postData.idToken;
      
      if (!idToken) {
        throw new Error('ID token is required');
      }
      
      // Decode JWT token (simplified - in production, verify signature)
      const payload = this.decodeJWT(idToken);
      
      if (!payload) {
        throw new Error('Invalid token format');
      }
      
      // Verify token audience (client ID)
      if (payload.aud !== CONFIG.ADMIN_CONFIG.OAUTH_CLIENT_ID) {
        throw new Error('Invalid token audience');
      }
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        throw new Error('Token has expired');
      }
      
      // Check if user is authorized
      const userInfo = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        emailVerified: payload.email_verified
      };
      
      if (!userInfo.emailVerified) {
        throw new Error('Email not verified');
      }
      
      const authResult = this.checkUserAuthorization(userInfo);
      
      if (!authResult.authorized) {
        // Log unauthorized attempt
        ActivityLogger.logActivity('login_failed', userInfo.email, null, {
          reason: 'Unauthorized user',
          timestamp: new Date().toISOString()
        });
        
        throw new Error(`Unauthorized user: ${userInfo.email}`);
      }
      
      // Update user login stats
      this.updateUserLoginStats(userInfo.email);
      
      // Log successful login
      ActivityLogger.logActivity('login', userInfo.email, null, {
        name: userInfo.name,
        loginTime: new Date().toISOString()
      });
      
      return {
        success: true,
        user: userInfo,
        role: authResult.role,
        permissions: this.getPermissions(authResult.role),
        sessionToken: this.generateSessionToken(userInfo.email)
      };
      
    } catch (error) {
      Logger.log(`Authentication failed: ${error.message}`);
      
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },
  
  /**
   * Decode JWT token (simplified version)
   * In production, should verify signature with Google's public keys
   */
  decodeJWT(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }
      
      // Decode payload (base64url)
      const payload = parts[1];
      const decoded = Utilities.base64Decode(payload, Utilities.Charset.UTF_8);
      const payloadStr = Utilities.newBlob(decoded).getDataAsString();
      
      return JSON.parse(payloadStr);
      
    } catch (error) {
      Logger.log(`Error decoding JWT: ${error.message}`);
      return null;
    }
  },
  
  /**
   * Check if user is authorized to access admin panel
   */
  checkUserAuthorization(userInfo) {
    try {
      const usersSheet = SheetsService.getAdminUsersSheet();
      const data = usersSheet.getDataRange().getValues();
      
      // Check in admin users sheet
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const email = row[0];
        const role = row[2];
        const status = row[3];
        
        if (email === userInfo.email) {
          if (status === 'suspended') {
            return { authorized: false, reason: 'Account suspended' };
          }
          
          return { 
            authorized: true, 
            role: role,
            isExistingUser: true 
          };
        }
      }
      
      // Check if this is the super admin (for initial setup)
      if (userInfo.email === CONFIG.ADMIN_CONFIG.SUPER_ADMIN) {
        return { 
          authorized: true, 
          role: 'super-admin',
          isExistingUser: false 
        };
      }
      
      return { authorized: false, reason: 'User not found in authorized list' };
      
    } catch (error) {
      Logger.log(`Error checking user authorization: ${error.message}`);
      return { authorized: false, reason: 'Authorization check failed' };
    }
  },
  
  /**
   * Get permissions for a role
   */
  getPermissions(role) {
    const permissions = {
      'super-admin': [
        'manage-users',
        'manage-events',
        'view-analytics',
        'delete-events',
        'manage-settings',
        'view-logs',
        'manual-cleanup'
      ],
      'admin': [
        'manage-events',
        'view-analytics',
        'view-logs'
      ],
      'editor': [
        'manage-events',
        'view-analytics'
      ]
    };
    
    return permissions[role] || [];
  },
  
  /**
   * Generate session token
   */
  generateSessionToken(email) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const tokenData = {
      email: email,
      timestamp: timestamp,
      expires: timestamp + CONFIG.ADMIN_CONFIG.SESSION_TIMEOUT
    };
    
    // Simple token generation (in production, use proper encryption)
    const tokenString = JSON.stringify(tokenData);
    const encoded = Utilities.base64Encode(tokenString);
    
    return encoded;
  },
  
  /**
   * Verify session token
   */
  verifySessionToken(token) {
    try {
      if (!token) {
        throw new Error('No session token provided');
      }
      
      const decoded = Utilities.base64Decode(token);
      const tokenString = Utilities.newBlob(decoded).getDataAsString();
      const tokenData = JSON.parse(tokenString);
      
      // Check if token has expired
      if (Date.now() > tokenData.expires) {
        throw new Error('Session token has expired');
      }
      
      return {
        valid: true,
        email: tokenData.email,
        timestamp: tokenData.timestamp
      };
      
    } catch (error) {
      Logger.log(`Session token verification failed: ${error.message}`);
      return {
        valid: false,
        error: error.message
      };
    }
  },
  
  /**
   * Require authentication for protected endpoints
   */
  requireAuth(e) {
    try {
      // Get auth token from headers or post data
      let authToken = null;
      
      if (e.parameter && e.parameter.authorization) {
        authToken = e.parameter.authorization.replace('Bearer ', '');
      } else if (e.postData) {
        const postData = JSON.parse(e.postData.getDataAsString());
        if (postData.authorization) {
          authToken = postData.authorization.replace('Bearer ', '');
        }
      }
      
      if (!authToken) {
        throw new Error('Authorization token required');
      }
      
      // For OAuth tokens, verify with Google
      if (authToken.length > 100) { // OAuth tokens are much longer
        const verifyResult = this.verifyGoogleToken({
          postData: {
            getDataAsString: () => JSON.stringify({ idToken: authToken })
          }
        });
        
        if (!verifyResult.success) {
          throw new Error(verifyResult.error || 'Authentication failed');
        }
        
        return verifyResult;
      }
      
      // For session tokens, verify locally
      const sessionResult = this.verifySessionToken(authToken);
      if (!sessionResult.valid) {
        throw new Error(sessionResult.error || 'Invalid session token');
      }
      
      // Get user info from session
      const userInfo = this.getUserInfo(sessionResult.email);
      if (!userInfo) {
        throw new Error('User not found');
      }
      
      return {
        success: true,
        user: userInfo,
        role: userInfo.role,
        permissions: this.getPermissions(userInfo.role)
      };
      
    } catch (error) {
      Logger.log(`Authentication required failed: ${error.message}`);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  },
  
  /**
   * Get user info by email
   */
  getUserInfo(email) {
    try {
      const usersSheet = SheetsService.getAdminUsersSheet();
      const data = usersSheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0] === email) {
          return {
            email: row[0],
            name: row[1],
            role: row[2],
            status: row[3],
            addedBy: row[4],
            addedAt: row[5],
            lastLogin: row[6],
            loginCount: row[7]
          };
        }
      }
      
      return null;
      
    } catch (error) {
      Logger.log(`Error getting user info: ${error.message}`);
      return null;
    }
  },
  
  /**
   * Update user login statistics
   */
  updateUserLoginStats(email) {
    try {
      const usersSheet = SheetsService.getAdminUsersSheet();
      const data = usersSheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0] === email) {
          // Update last login and increment login count
          const loginCount = (row[7] || 0) + 1;
          const lastLogin = new Date();
          
          usersSheet.getRange(i + 1, 7, 1, 2).setValues([[lastLogin, loginCount]]);
          break;
        }
      }
      
    } catch (error) {
      Logger.log(`Error updating login stats: ${error.message}`);
    }
  },
  
  /**
   * Check if user has specific permission
   */
  hasPermission(authResult, permission) {
    if (!authResult || !authResult.permissions) {
      return false;
    }
    
    return authResult.permissions.includes(permission);
  },
  
  /**
   * Test authentication configuration
   */
  testConfiguration() {
    return {
      hasOAuthClientId: !!CONFIG.ADMIN_CONFIG.OAUTH_CLIENT_ID && 
                       CONFIG.ADMIN_CONFIG.OAUTH_CLIENT_ID !== 'YOUR_GOOGLE_OAUTH_CLIENT_ID',
      hasSuperAdmin: !!CONFIG.ADMIN_CONFIG.SUPER_ADMIN && 
                     CONFIG.ADMIN_CONFIG.SUPER_ADMIN !== 'your-email@gmail.com',
      sessionTimeout: CONFIG.ADMIN_CONFIG.SESSION_TIMEOUT
    };
  }
};
