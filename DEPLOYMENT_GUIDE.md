# 🚀 SSMA Sacramento Events Management System - Deployment Guide

## 📋 Overview

This guide will walk you through deploying the complete SSMA Sacramento Events Management System, including:
- **Main Website** (sacramento110.org)
- **Admin Portal** (admin.sacramento110.org)  
- **Google Apps Script Backend**
- **Google Sheets & Drive Integration**

---

## 🎯 Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Main Website  │    │   Admin Portal  │    │ Google Backend  │
│ sacramento110.org │    │admin.sacramento110│    │  Apps Script   │
│                 │    │      .org       │    │                 │
│  GitHub Pages   │    │  GitHub Pages   │    │ Google Cloud    │
│   (main branch) │    │(admin-portal br)│    │   Platform      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Google Services │
                    │                 │
                    │ • Sheets API    │
                    │ • Drive API     │
                    │ • OAuth 2.0     │
                    └─────────────────┘
```

---

## 🔧 Prerequisites

### Required Accounts & Services
- ✅ **GitHub Account** (already have)
- ✅ **Google Cloud Platform Account**
- ✅ **Domain Name** (sacramento110.org)
- ✅ **DNS Management Access**

### Required Tools
- ✅ **Git** (installed)
- ✅ **Node.js & npm** (installed)
- ✅ **Code Editor** (VS Code/Cursor)

---

## 📦 Phase 1: Google Apps Script Backend Deployment

### Step 1.1: Set Up Google Cloud Project

1. **Create New Google Cloud Project**
   ```
   Project Name: SSMA Sacramento Events
   Project ID: ssma-sacramento-events-2024
   ```

2. **Enable Required APIs**
   - Google Sheets API
   - Google Drive API
   - Google Apps Script API

3. **Create OAuth 2.0 Credentials**
   ```
   Application Type: Web Application
   Name: SSMA Admin Portal
   Authorized JavaScript Origins:
   - https://sacramento110.org
   - https://admin.sacramento110.org
   - http://localhost:3000 (for development)
   ```

### Step 1.2: Deploy Google Apps Script

1. **Access Google Apps Script**
   - Go to: https://script.google.com
   - Create new project: "SSMA Events Backend"

2. **Upload Backend Files**
   Copy contents from `google-apps-script/` directory:
   - `Code.gs` (main entry point)
   - `SheetsService.gs` (sheets management)
   - `AuthService.gs` (authentication)
   - `EventsService.gs` (events CRUD)
   - `DriveService.gs` (file management)
   - `ActivityLogger.gs` (audit logging)
   - `CleanupService.gs` (automated cleanup)
   - `UserService.gs` (user management)
   - `AnalyticsService.gs` (analytics)

3. **Configure Script Properties**
   ```javascript
   // In Google Apps Script > Project Settings > Script Properties
   OAUTH_CLIENT_ID: "your-google-oauth-client-id"
   EVENTS_SHEET_ID: "your-google-sheets-id"
   DRIVE_FOLDER_ID: "your-google-drive-folder-id"
   SUPER_ADMIN_EMAIL: "your-email@gmail.com"
   ```

4. **Deploy as Web App**
   ```
   Execute as: Me (your-email@gmail.com)
   Who has access: Anyone with the link
   ```

5. **Note the Deployment URL**
   ```
   Format: https://script.google.com/macros/s/SCRIPT_ID/exec
   ```

### Step 1.3: Set Up Google Sheets

1. **Create Events Sheet**
   ```
   Sheet Name: "SSMA Events"
   Columns: id, title, description, dateStart, dateEnd, time, speaker, location, hostedBy, imageDriveId, status, isMultiDay, createdAt, createdBy, lastModifiedBy
   ```

2. **Create Users Sheet**
   ```
   Sheet Name: "SSMA Users"
   Columns: email, name, role, status, permissions, lastLogin, totalLogins, createdAt, lastModified
   ```

3. **Create Activity Logs Sheet**
   ```
   Sheet Name: "SSMA Activity"
   Columns: timestamp, adminEmail, action, details, ipAddress, userAgent
   ```

4. **Share Sheets with Script**
   - Share with your Google account (Editor access)
   - Note the Sheet ID from the URL

### Step 1.4: Set Up Google Drive

1. **Create Events Images Folder**
   ```
   Folder Name: "SSMA Event Images"
   Location: Your Google Drive root
   Permissions: Private (script will manage access)
   ```

2. **Note Folder ID**
   - Get folder ID from Drive URL
   - Add to script properties

---

## 🌐 Phase 2: GitHub Pages Deployment

### Step 2.1: Configure Main Website Deployment

1. **Update Production URLs**
   ```bash
   # Update vite.config.ts if needed
   base: '/sacramento110/' # for GitHub Pages
   ```

2. **Configure GitHub Repository**
   ```
   Repository: sacramento110
   Default Branch: main
   GitHub Pages Source: GitHub Actions
   ```

3. **Deploy Main Website**
   ```bash
   # Push to main branch triggers deployment
   git checkout main
   git merge phase-5-final-deployment
   git push origin main
   ```

### Step 2.2: Configure Admin Portal Deployment

1. **Set Up Admin Portal Branch**
   ```bash
   # Ensure admin-portal branch exists with admin files
   git checkout admin-portal
   git merge phase-5-final-deployment
   git push origin admin-portal
   ```

2. **Configure Admin GitHub Pages**
   ```
   Repository Settings > Pages
   Source: Deploy from a branch
   Branch: admin-portal
   Folder: / (root)
   ```

### Step 2.3: Update Production Configuration

1. **Update Admin Portal Config**
   ```javascript
   // admin/src/config/production.js
   BACKEND: {
     API_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
   },
   AUTH: {
     CLIENT_ID: 'YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com'
   }
   ```

2. **Test Deployments**
   ```
   Main Site: https://username.github.io/sacramento110/
   Admin Portal: https://username.github.io/sacramento110/ (from admin-portal branch)
   ```

---

## 🌍 Phase 3: Custom Domain Configuration

### Step 3.1: DNS Configuration

1. **Main Domain (sacramento110.org)**
   ```
   Type: A Record
   Name: @
   Value: 185.199.108.153
          185.199.109.153
          185.199.110.153
          185.199.111.153
   
   Type: CNAME
   Name: www
   Value: username.github.io
   ```

2. **Admin Subdomain (admin.sacramento110.org)**
   ```
   Type: CNAME
   Name: admin
   Value: username.github.io
   ```

### Step 3.2: GitHub Pages Custom Domain

1. **Configure Main Site Domain**
   ```
   Repository Settings > Pages > Custom Domain
   Domain: sacramento110.org
   Enforce HTTPS: ✅ (after SSL setup)
   ```

2. **Configure Admin Portal Domain**
   ```
   Repository Settings > Pages > Custom Domain  
   Domain: admin.sacramento110.org
   Enforce HTTPS: ✅ (after SSL setup)
   ```

### Step 3.3: SSL Certificate Setup

GitHub Pages automatically provides SSL certificates for custom domains.

1. **Verify SSL Setup**
   ```bash
   # Check SSL certificate status
   curl -I https://sacramento110.org
   curl -I https://admin.sacramento110.org
   ```

2. **Update OAuth Settings**
   ```
   Google Cloud Console > APIs & Services > Credentials
   Authorized JavaScript Origins:
   - https://sacramento110.org
   - https://admin.sacramento110.org
   ```

---

## 🧪 Phase 4: Production Testing

### Step 4.1: Main Website Testing

1. **Core Functionality**
   - ✅ Hero section loads correctly
   - ✅ Prayer times display (if API configured)
   - ✅ Events section shows "No upcoming events" message
   - ✅ YouTube videos load (if API configured)
   - ✅ Donation section displays correctly
   - ✅ Newsletter signup works

2. **Performance Testing**
   - ✅ Page load speed < 3 seconds
   - ✅ Mobile responsiveness
   - ✅ SEO meta tags present

### Step 4.2: Admin Portal Testing

1. **Authentication**
   - ✅ Google OAuth login works
   - ✅ User roles and permissions enforced
   - ✅ Session management functions

2. **Event Management**
   - ✅ Create, edit, delete events
   - ✅ Image upload to Google Drive
   - ✅ Event data saves to Google Sheets
   - ✅ Real-time updates on main site

3. **User Management**
   - ✅ Add/remove admin users
   - ✅ Role assignment works
   - ✅ Permission changes take effect

4. **Analytics & Reporting**
   - ✅ Dashboard loads with charts
   - ✅ Export functionality works
   - ✅ Activity logging captures actions

### Step 4.3: Integration Testing

1. **End-to-End Workflow**
   - ✅ Admin creates event → appears on main site
   - ✅ Event image uploads → displays correctly
   - ✅ Event sharing → deep links work
   - ✅ Past events → auto-cleanup works

2. **Security Testing**
   - ✅ Unauthorized access blocked
   - ✅ Data validation prevents injection
   - ✅ Audit logging captures all actions

---

## 📊 Phase 5: Monitoring & Maintenance

### Step 5.1: Set Up Monitoring

1. **Google Apps Script Monitoring**
   - Enable execution transcript
   - Set up email notifications for errors
   - Monitor quota usage

2. **GitHub Pages Monitoring**
   - Check build status in Actions tab
   - Monitor deployment logs
   - Set up status page if needed

### Step 5.2: Backup Strategy

1. **Google Sheets Backup**
   - Weekly automated exports
   - Version control for critical data
   - Recovery procedures documented

2. **Code Backup**
   - GitHub repository (primary)
   - Local development backups
   - Documentation versioning

### Step 5.3: Update Procedures

1. **Content Updates**
   - Admin portal for events/users
   - Direct sheet editing for emergencies
   - Approval workflow for major changes

2. **Code Updates**
   - Development → Testing → Production
   - Staged deployments
   - Rollback procedures

---

## 🔧 Configuration Reference

### Environment Variables
```javascript
// Production Configuration
const PRODUCTION_CONFIG = {
  BACKEND: {
    API_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
  },
  AUTH: {
    CLIENT_ID: 'YOUR_CLIENT_ID.apps.googleusercontent.com'
  },
  DOMAINS: {
    MAIN_SITE: 'https://sacramento110.org',
    ADMIN_PORTAL: 'https://admin.sacramento110.org'
  }
};
```

### Google Apps Script Properties
```
OAUTH_CLIENT_ID: Your Google OAuth Client ID
EVENTS_SHEET_ID: Google Sheets ID for events data
DRIVE_FOLDER_ID: Google Drive folder ID for images
SUPER_ADMIN_EMAIL: Primary admin email address
```

### DNS Records Summary
```
A Records (sacramento110.org):
185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153

CNAME Records:
www.sacramento110.org → username.github.io
admin.sacramento110.org → username.github.io
```

---

## 🚨 Troubleshooting

### Common Issues

1. **OAuth Errors**
   - Check authorized domains in Google Cloud Console
   - Verify Client ID matches in all configs
   - Ensure HTTPS is enabled

2. **GitHub Pages Not Updating**
   - Check Actions tab for build errors
   - Verify branch configuration
   - Clear browser cache

3. **Google Apps Script Errors**
   - Check execution transcript
   - Verify API permissions
   - Check quota limits

4. **Domain Not Resolving**
   - Verify DNS propagation (24-48 hours)
   - Check domain registrar settings
   - Test with DNS lookup tools

### Support Resources

- **GitHub Pages Documentation**: https://docs.github.com/en/pages
- **Google Apps Script Documentation**: https://developers.google.com/apps-script
- **Google Cloud Console**: https://console.cloud.google.com

---

## ✅ Post-Deployment Checklist

- [ ] Main website loads at sacramento110.org
- [ ] Admin portal loads at admin.sacramento110.org
- [ ] Google OAuth authentication works
- [ ] Event creation/editing functions
- [ ] Image upload to Google Drive works
- [ ] Data saves to Google Sheets correctly
- [ ] Analytics dashboard displays data
- [ ] Email notifications work (if configured)
- [ ] Auto-cleanup runs daily
- [ ] Mobile responsiveness verified
- [ ] SSL certificates active
- [ ] DNS records propagated
- [ ] Backup procedures tested

---

*This deployment guide ensures a complete, production-ready SSMA Sacramento Events Management System.*
