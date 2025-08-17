# SSMA Admin Portal

## 🔐 Secure Admin Interface for Events Management

This is the administrative portal for the SSMA Sacramento Events Management System. It provides a secure, feature-rich interface for managing events, users, and system monitoring.

## ✨ Features

### 🎯 **Dashboard Analytics**
- Real-time event metrics and insights
- Today's and upcoming events overview
- System health monitoring
- User activity tracking
- Storage and performance metrics

### 📅 **Event Management**
- Complete CRUD operations for events
- Support for single-day and multi-day events
- Image upload with Google Drive integration
- Advanced filtering and search
- Event status tracking (Today, Tomorrow, Upcoming, Past)

### 👥 **User Management** (Super-admin only)
- Add/remove admin users
- Role-based permissions (Super-admin, Admin, Editor)
- User activity monitoring
- Login statistics

### 📊 **Activity Monitoring**
- Comprehensive audit trail
- Real-time activity timeline
- Advanced filtering by action, user, and date
- Export capabilities (Super-admin only)

### ⚙️ **System Settings**
- System health checks
- Configuration validation
- Manual cleanup operations
- Session management

## 🏗️ **Architecture**

### **Security Features**
- ✅ Google OAuth 2.0 authentication
- ✅ Role-based access control
- ✅ Session management with automatic expiration
- ✅ Activity logging and audit trails
- ✅ Protected routes and permissions

### **Technology Stack**
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: Tailwind CSS
- **Authentication**: Google OAuth 2.0
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **File Storage**: Google Drive
- **Deployment**: GitHub Pages

## 🚀 **Setup Instructions**

### **1. Configuration**

Before deploying, update these configuration values:

**In `src/services/authService.js`:**
```javascript
googleClientId: 'YOUR_GOOGLE_OAUTH_CLIENT_ID'
```

**In `src/services/eventsService.js`:**
```javascript
baseUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
```

### **2. Google Apps Script Backend**

Make sure you have completed Phase 2 setup:
1. ✅ Google Apps Script deployed as web app
2. ✅ Google OAuth credentials configured
3. ✅ Google Sheets and Drive APIs enabled
4. ✅ Super admin user configured

### **3. Domain Setup**

#### **Option A: GitHub Pages with Custom Domain**
1. Configure custom domain in repository settings
2. Set up DNS CNAME record: `admin.yourdomain.com → yourusername.github.io`
3. Enable HTTPS in GitHub Pages settings

#### **Option B: GitHub Pages Subdirectory**
- Admin portal will be available at: `yourusername.github.io/sacramento110-admin`

### **4. Deployment**

#### **Automatic Deployment (Recommended)**
```bash
# Push to admin-portal branch triggers automatic deployment
git add .
git commit -m "Deploy admin portal"
git push origin admin-portal
```

#### **Manual Deployment**
```bash
cd admin
npm install
npm run deploy
```

## 📋 **User Roles & Permissions**

### **Super-Admin**
- ✅ All permissions
- ✅ User management
- ✅ System configuration
- ✅ Export capabilities
- ✅ Manual cleanup operations

### **Admin**
- ✅ Event management
- ✅ View analytics
- ✅ Activity monitoring
- ❌ User management

### **Editor**
- ✅ Event management
- ✅ View analytics
- ❌ Activity monitoring
- ❌ User management

## 🔧 **Development**

### **Local Development**
```bash
cd admin
npm install
npm run dev
```

### **File Structure**
```
admin/
├── index.html              # Main HTML file
├── src/
│   ├── app.js              # Main application
│   ├── services/
│   │   ├── authService.js  # Authentication
│   │   └── eventsService.js # API communication
│   └── pages/
│       ├── dashboard.js    # Dashboard page
│       ├── events.js       # Events management
│       ├── users.js        # User management
│       ├── activity.js     # Activity logs
│       └── settings.js     # System settings
├── package.json
└── README.md
```

## 🔒 **Security Considerations**

### **Authentication**
- Only authorized Google accounts can access
- Session tokens expire automatically
- Failed login attempts are logged

### **Data Protection**
- All API calls are authenticated
- Input validation and sanitization
- CORS protection configured
- Activity logging for accountability

### **Access Control**
- Role-based permissions enforced
- Sensitive operations require elevated privileges
- User actions are audited

## 📱 **Browser Support**

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🐛 **Troubleshooting**

### **Common Issues**

1. **"Authentication failed"**
   - Check Google OAuth Client ID configuration
   - Verify user is in authorized users list
   - Ensure account email is verified

2. **"Unable to connect to backend"**
   - Verify Google Apps Script URL is correct
   - Check if backend is deployed and accessible
   - Confirm CORS settings allow admin domain

3. **"Permission denied"**
   - User may not have required role/permissions
   - Contact super-admin to update user permissions

### **Configuration Validation**

The admin portal includes built-in configuration validation:
- Go to Settings page
- Click "Test Connection"
- Review any configuration issues listed

## 📞 **Support**

For issues and questions:
1. Check the troubleshooting section above
2. Verify configuration in Settings page
3. Review browser console for error messages
4. Check Google Apps Script logs

## 🔄 **Updates**

To update the admin portal:
1. Pull latest changes from main repository
2. Update configuration if needed
3. Test locally with `npm run dev`
4. Deploy with `git push origin admin-portal`

## 📈 **Monitoring**

The admin portal provides comprehensive monitoring:
- **System Health**: Real-time status of all services
- **User Activity**: Complete audit trail of admin actions
- **Performance**: Storage usage and system metrics
- **Security**: Login attempts and session management

---

**🔐 Secure • 🚀 Fast • 📊 Comprehensive**

*This admin portal provides enterprise-level events management with security, scalability, and comprehensive feature set - all running on free Google services!*
