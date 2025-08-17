/**
 * User Service
 * Handles admin user management and authentication
 */

const UserService = {
  
  /**
   * Initialize super admin user
   */
  initializeSuperAdmin() {
    try {
      const usersSheet = SheetsService.getAdminUsersSheet();
      
      // Check if super admin already exists
      const data = usersSheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === CONFIG.ADMIN_CONFIG.SUPER_ADMIN) {
          Logger.log('Super admin already exists');
          return true;
        }
      }
      
      // Add super admin
      const superAdminRow = [
        CONFIG.ADMIN_CONFIG.SUPER_ADMIN,    // email
        'Super Administrator',               // name (will be updated on first login)
        'super-admin',                      // role
        'active',                           // status
        'system',                           // added_by
        new Date(),                         // added_at
        null,                               // last_login
        0                                   // login_count
      ];
      
      usersSheet.appendRow(superAdminRow);
      
      Logger.log(`Super admin initialized: ${CONFIG.ADMIN_CONFIG.SUPER_ADMIN}`);
      return true;
      
    } catch (error) {
      Logger.log(`Error initializing super admin: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Get all admin users
   */
  getAdminUsers(authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'manage-users')) {
        throw new Error('Insufficient permissions to view admin users');
      }
      
      const usersSheet = SheetsService.getAdminUsersSheet();
      const data = usersSheet.getDataRange().getValues();
      
      const users = [];
      
      // Skip header row
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        users.push({
          email: row[0],
          name: row[1],
          role: row[2],
          status: row[3],
          addedBy: row[4],
          addedAt: row[5],
          lastLogin: row[6],
          loginCount: row[7] || 0
        });
      }
      
      // Sort by role (super-admin first, then by email)
      users.sort((a, b) => {
        if (a.role === 'super-admin' && b.role !== 'super-admin') return -1;
        if (b.role === 'super-admin' && a.role !== 'super-admin') return 1;
        return a.email.localeCompare(b.email);
      });
      
      return {
        success: true,
        users: users,
        count: users.length
      };
      
    } catch (error) {
      Logger.log(`Error getting admin users: ${error.message}`);
      return {
        success: false,
        error: error.message,
        users: [],
        count: 0
      };
    }
  },
  
  /**
   * Add new admin user
   */
  addAdminUser(e, authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'manage-users')) {
        throw new Error('Insufficient permissions to add admin users');
      }
      
      const postData = JSON.parse(e.postData.getDataAsString());
      const { email, name, role } = postData;
      
      // Validate input
      if (!email || !email.includes('@')) {
        throw new Error('Valid email address is required');
      }
      
      if (!name || name.trim() === '') {
        throw new Error('Name is required');
      }
      
      if (!['admin', 'editor'].includes(role)) {
        throw new Error('Invalid role. Must be admin or editor');
      }
      
      // Check if user already exists
      const existingUser = this.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Add user to sheet
      const usersSheet = SheetsService.getAdminUsersSheet();
      const newUserRow = [
        email.toLowerCase().trim(),         // email
        name.trim(),                        // name
        role,                               // role
        'active',                           // status
        authResult.user.email,              // added_by
        new Date(),                         // added_at
        null,                               // last_login
        0                                   // login_count
      ];
      
      usersSheet.appendRow(newUserRow);
      
      // Log activity
      ActivityLogger.logActivity('user_added', authResult.user.email, null, {
        newUserEmail: email,
        newUserName: name,
        newUserRole: role
      });
      
      Logger.log(`Admin user added: ${email} (${role})`);
      
      return {
        success: true,
        user: {
          email: email,
          name: name,
          role: role,
          status: 'active',
          addedBy: authResult.user.email,
          addedAt: new Date().toISOString()
        },
        message: 'Admin user added successfully'
      };
      
    } catch (error) {
      Logger.log(`Error adding admin user: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Remove admin user
   */
  removeAdminUser(email, authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'manage-users')) {
        throw new Error('Insufficient permissions to remove admin users');
      }
      
      // Prevent removing super admin
      if (email === CONFIG.ADMIN_CONFIG.SUPER_ADMIN) {
        throw new Error('Cannot remove super administrator');
      }
      
      // Prevent removing self
      if (email === authResult.user.email) {
        throw new Error('Cannot remove yourself');
      }
      
      // Find and remove user
      const usersSheet = SheetsService.getAdminUsersSheet();
      const data = usersSheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === email) {
          const userData = {
            email: data[i][0],
            name: data[i][1],
            role: data[i][2]
          };
          
          usersSheet.deleteRow(i + 1);
          
          // Log activity
          ActivityLogger.logActivity('user_removed', authResult.user.email, null, {
            removedUserEmail: email,
            removedUserName: userData.name,
            removedUserRole: userData.role
          });
          
          Logger.log(`Admin user removed: ${email}`);
          
          return {
            success: true,
            message: 'Admin user removed successfully'
          };
        }
      }
      
      throw new Error('User not found');
      
    } catch (error) {
      Logger.log(`Error removing admin user: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Update admin user role
   */
  updateAdminUserRole(email, newRole, authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'manage-users')) {
        throw new Error('Insufficient permissions to update admin users');
      }
      
      // Prevent changing super admin role
      if (email === CONFIG.ADMIN_CONFIG.SUPER_ADMIN) {
        throw new Error('Cannot change super administrator role');
      }
      
      // Validate role
      if (!['admin', 'editor'].includes(newRole)) {
        throw new Error('Invalid role. Must be admin or editor');
      }
      
      // Find and update user
      const usersSheet = SheetsService.getAdminUsersSheet();
      const data = usersSheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === email) {
          const oldRole = data[i][2];
          
          if (oldRole === newRole) {
            return {
              success: true,
              message: 'No changes made - role is already set'
            };
          }
          
          // Update role
          usersSheet.getRange(i + 1, 3).setValue(newRole);
          
          // Log activity
          ActivityLogger.logActivity('user_role_updated', authResult.user.email, null, {
            userEmail: email,
            oldRole: oldRole,
            newRole: newRole
          });
          
          Logger.log(`Admin user role updated: ${email} (${oldRole} -> ${newRole})`);
          
          return {
            success: true,
            message: 'Admin user role updated successfully'
          };
        }
      }
      
      throw new Error('User not found');
      
    } catch (error) {
      Logger.log(`Error updating admin user role: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Suspend/activate admin user
   */
  toggleAdminUserStatus(email, authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'manage-users')) {
        throw new Error('Insufficient permissions to modify admin users');
      }
      
      // Prevent suspending super admin
      if (email === CONFIG.ADMIN_CONFIG.SUPER_ADMIN) {
        throw new Error('Cannot suspend super administrator');
      }
      
      // Prevent suspending self
      if (email === authResult.user.email) {
        throw new Error('Cannot suspend yourself');
      }
      
      // Find and update user
      const usersSheet = SheetsService.getAdminUsersSheet();
      const data = usersSheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === email) {
          const currentStatus = data[i][3];
          const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
          
          // Update status
          usersSheet.getRange(i + 1, 4).setValue(newStatus);
          
          // Log activity
          ActivityLogger.logActivity('user_status_changed', authResult.user.email, null, {
            userEmail: email,
            oldStatus: currentStatus,
            newStatus: newStatus
          });
          
          Logger.log(`Admin user status changed: ${email} (${currentStatus} -> ${newStatus})`);
          
          return {
            success: true,
            newStatus: newStatus,
            message: `Admin user ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`
          };
        }
      }
      
      throw new Error('User not found');
      
    } catch (error) {
      Logger.log(`Error toggling admin user status: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * Get user by email
   */
  getUserByEmail(email) {
    try {
      const usersSheet = SheetsService.getAdminUsersSheet();
      const data = usersSheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === email) {
          return {
            email: data[i][0],
            name: data[i][1],
            role: data[i][2],
            status: data[i][3],
            addedBy: data[i][4],
            addedAt: data[i][5],
            lastLogin: data[i][6],
            loginCount: data[i][7] || 0
          };
        }
      }
      
      return null;
      
    } catch (error) {
      Logger.log(`Error getting user by email: ${error.message}`);
      return null;
    }
  },
  
  /**
   * Get user statistics
   */
  getUserStats(authResult) {
    try {
      // Check permissions
      if (!AuthService.hasPermission(authResult, 'view-analytics')) {
        throw new Error('Insufficient permissions to view user statistics');
      }
      
      const usersSheet = SheetsService.getAdminUsersSheet();
      const data = usersSheet.getDataRange().getValues();
      
      const stats = {
        totalUsers: Math.max(0, data.length - 1), // exclude header
        activeUsers: 0,
        suspendedUsers: 0,
        roleDistribution: {
          'super-admin': 0,
          'admin': 0,
          'editor': 0
        },
        recentLogins: []
      };
      
      // Process user data
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const status = row[3];
        const role = row[2];
        const lastLogin = row[6];
        
        // Count by status
        if (status === 'active') {
          stats.activeUsers++;
        } else if (status === 'suspended') {
          stats.suspendedUsers++;
        }
        
        // Count by role
        if (stats.roleDistribution.hasOwnProperty(role)) {
          stats.roleDistribution[role]++;
        }
        
        // Collect recent logins
        if (lastLogin) {
          stats.recentLogins.push({
            email: row[0],
            name: row[1],
            lastLogin: lastLogin,
            loginCount: row[7] || 0
          });
        }
      }
      
      // Sort recent logins by date
      stats.recentLogins.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));
      stats.recentLogins = stats.recentLogins.slice(0, 10); // Top 10
      
      return {
        success: true,
        stats: stats
      };
      
    } catch (error) {
      Logger.log(`Error getting user stats: ${error.message}`);
      return {
        success: false,
        error: error.message,
        stats: null
      };
    }
  }
};
