# SSMA Events Management System - Backend Setup Guide

## 📋 Overview

This Google Apps Script backend provides a complete events management system with:
- ✅ Google OAuth authentication
- ✅ CRUD operations for events
- ✅ Google Drive image storage
- ✅ Auto-cleanup system
- ✅ Activity logging and audit trails
- ✅ Analytics dashboard
- ✅ User management

## 🚀 Quick Setup

### 1. Create Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Name it "SSMA Events Management"

### 2. Copy Script Files

Copy all `.gs` files from this directory to your Google Apps Script project:

- `Code.gs` - Main entry point and routing
- `SheetsService.gs` - Google Sheets operations
- `AuthService.gs` - OAuth authentication
- `EventsService.gs` - Events CRUD operations
- `DriveService.gs` - Google Drive file management
- `ActivityLogger.gs` - Activity logging
- `CleanupService.gs` - Auto-cleanup system
- `UserService.gs` - Admin user management
- `AnalyticsService.gs` - Dashboard analytics

### 3. Create Google Sheets

1. Create a new Google Sheets
2. Copy the Spreadsheet ID from the URL
3. Replace `YOUR_EVENTS_SPREADSHEET_ID` in `Code.gs`

### 4. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Sheets API and Google Drive API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized origins: Your domains
   - Authorized redirect URIs: Your domains
5. Copy the Client ID and replace `YOUR_GOOGLE_OAUTH_CLIENT_ID` in `Code.gs`

### 5. Configure Super Admin

Replace `your-email@gmail.com` in `Code.gs` with your actual Gmail address.

### 6. Deploy the Script

1. Click "Deploy" → "New deployment"
2. Type: Web app
3. Execute as: Me
4. Who has access: Anyone
5. Click "Deploy"
6. Copy the Web app URL

### 7. Initialize the System

1. Run the `initializeSystem()` function in Apps Script editor
2. Authorize the required permissions
3. Verify all sheets and folders are created

## 🔧 Configuration

### Required Configuration Changes

Before deployment, update these values in `Code.gs`:

```javascript
const CONFIG = {
  // Replace with your actual spreadsheet ID
  EVENTS_SHEET_ID: 'YOUR_EVENTS_SPREADSHEET_ID',
  
  ADMIN_CONFIG: {
    // Replace with your Gmail address
    SUPER_ADMIN: 'your-email@gmail.com',
    
    // Replace with your OAuth client ID
    OAUTH_CLIENT_ID: 'YOUR_GOOGLE_OAUTH_CLIENT_ID'
  }
};
```

### Frontend Configuration

Update these files in your frontend:

1. **src/services/eventsService.ts**:
   ```typescript
   const API_CONFIG = {
     BASE_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
   };
   ```

2. **src/services/authService.ts**:
   ```typescript
   const AUTH_CONFIG = {
     GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_OAUTH_CLIENT_ID'
   };
   ```

## 📊 Google Sheets Structure

The system automatically creates these sheets:

### Events Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | event_id | Unique identifier |
| B | title | Event title |
| C | description | Event description |
| D | date_start | Start date (YYYY-MM-DD) |
| E | date_end | End date (optional) |
| F | time | Event time |
| G | speaker_name | Speaker name |
| H | hosted_by | Host organization |
| I | location | Event location |
| J | image_drive_id | Google Drive file ID |
| K | image_url | Public image URL |
| L | status | active/inactive/past |
| M | is_multi_day | TRUE/FALSE |
| N | created_at | Creation timestamp |
| O | updated_at | Last update timestamp |
| P | created_by | Creator email |
| Q | last_modified_by | Last modifier email |

### Admin Activity Log Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | log_id | Unique log identifier |
| B | admin_email | Admin who performed action |
| C | action | Type of action |
| D | event_id | Related event (if applicable) |
| E | timestamp | When action occurred |
| F | ip_address | Client IP |
| G | details | JSON details |
| H | session_id | Session identifier |

### Admin Users Sheet
| Column | Field | Description |
|--------|-------|-------------|
| A | email | Admin email address |
| B | name | Admin full name |
| C | role | super-admin/admin/editor |
| D | status | active/suspended |
| E | added_by | Who added this admin |
| F | added_at | When admin was added |
| G | last_login | Last login timestamp |
| H | login_count | Total login count |

## 🗂️ Google Drive Structure

The system creates this folder structure:

```
SSMA Events/
├── 2025/
│   ├── January/
│   ├── February/
│   └── ...
├── 2026/
└── Archive/
    └── deleted-events/
```

## 🔐 Security Features

### Authentication
- Google OAuth 2.0 integration
- Role-based permissions (super-admin/admin/editor)
- Session management with expiration
- IP address logging

### Authorization
- Permission-based access control
- User management by super-admin
- Activity audit trail
- Failed login attempt tracking

### Data Protection
- Input validation and sanitization
- CORS configuration
- Secure file handling
- Automatic cleanup of sensitive data

## 🔄 Auto-Cleanup System

The system automatically:
- ✅ Removes events the day after they end
- ✅ Archives event data to separate sheet
- ✅ Moves images to archive folder
- ✅ Cleans up old activity logs (365 days)
- ✅ Removes old archived files (90 days)

### Cleanup Schedule
- **Frequency**: Daily at 2:00 AM
- **Trigger**: Automatic time-based trigger
- **Manual**: Available through admin portal

## 📈 Analytics & Monitoring

### Dashboard Metrics
- Today's and tomorrow's events
- Weekly event overview
- Event trends and statistics
- User activity summaries
- Storage usage statistics
- System health indicators

### Activity Logging
- All admin actions logged
- Event creation, updates, deletions
- User management activities
- System maintenance events
- Failed authentication attempts

## 🛠️ Maintenance

### Regular Tasks
1. **Monthly**: Review activity logs
2. **Quarterly**: Check storage usage
3. **Annually**: Update OAuth credentials
4. **As needed**: Add/remove admin users

### Troubleshooting

#### Common Issues

1. **"Unauthorized user" error**
   - Check if user email is in Admin Users sheet
   - Verify user status is "active"
   - Ensure OAuth client ID is correct

2. **"Event not found" error**
   - Check Events sheet for event ID
   - Verify event status is "active"
   - Check if event was auto-cleaned

3. **Image upload fails**
   - Verify Google Drive API is enabled
   - Check file size (max 10MB)
   - Ensure valid image format

4. **API timeout errors**
   - Check Google Apps Script execution time limits
   - Verify CORS configuration
   - Check internet connectivity

### Monitoring

Use the health check function to verify system status:

```javascript
// Run in Apps Script editor
healthCheck();
```

This returns the status of:
- Google Sheets connection
- Google Drive connection
- Authentication configuration
- Required configuration values

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/events` - Get all active events
- `GET /api/events/:id` - Get specific event

### Admin Endpoints (OAuth required)
- `POST /api/admin/auth/verify` - Verify OAuth token
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- `POST /api/admin/events/upload` - Upload image
- `GET /api/admin/analytics` - Dashboard metrics
- `GET /api/admin/activity` - Activity log
- `POST /api/admin/cleanup` - Manual cleanup
- `GET /api/admin/users` - Admin users
- `POST /api/admin/users` - Add admin user
- `DELETE /api/admin/users/:email` - Remove admin user

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review Google Apps Script logs
3. Verify configuration settings
4. Test with health check function

## 🔒 Security Best Practices

1. **Keep OAuth credentials secure**
2. **Regularly review admin users**
3. **Monitor activity logs**
4. **Use strong permissions**
5. **Keep backups of data**
6. **Update dependencies regularly**

---

**Note**: This backend system is designed to work seamlessly with the SSMA Events frontend. Ensure both are properly configured and deployed for full functionality.
