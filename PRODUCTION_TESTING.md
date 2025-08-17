# 🧪 Production Testing Guide

## Overview
This comprehensive testing guide ensures your SSMA Sacramento Events Management System is fully functional in production.

---

## 🎯 Testing Phases

### Phase 1: Infrastructure Testing
### Phase 2: Main Website Testing  
### Phase 3: Admin Portal Testing
### Phase 4: Integration Testing
### Phase 5: Performance Testing
### Phase 6: Security Testing

---

## 📋 Phase 1: Infrastructure Testing

### ✅ DNS & Domain Configuration

**Test DNS Resolution**:
```bash
# Check main domain
nslookup sacramento110.org
dig sacramento110.org A

# Check admin subdomain  
nslookup admin.sacramento110.org
dig admin.sacramento110.org CNAME

# Check www subdomain
nslookup www.sacramento110.org
dig www.sacramento110.org CNAME
```

**Expected Results**:
- Main domain resolves to GitHub Pages IPs (185.199.108.x)
- Admin subdomain resolves to GitHub Pages
- WWW subdomain resolves to GitHub Pages

### ✅ SSL Certificate Validation

**Test SSL Certificates**:
```bash
# Check main site SSL
curl -I https://sacramento110.org

# Check admin portal SSL
curl -I https://admin.sacramento110.org

# Check certificate details
openssl s_client -connect sacramento110.org:443 -servername sacramento110.org
```

**Validation Checklist**:
- [ ] SSL certificate is valid and not expired
- [ ] Certificate matches domain name
- [ ] Certificate chain is complete
- [ ] HTTPS redirects work properly
- [ ] No mixed content warnings

### ✅ GitHub Pages Deployment

**Check Deployment Status**:
1. Go to GitHub repository > Actions tab
2. Verify latest deployments succeeded
3. Check both main and admin-portal branches deployed

**Validation Checklist**:
- [ ] Main site deployment successful
- [ ] Admin portal deployment successful
- [ ] No build errors in Actions
- [ ] Custom domains configured correctly

---

## 🌐 Phase 2: Main Website Testing

### ✅ Core Functionality

**Homepage Loading**:
```
Test URL: https://sacramento110.org
Expected: Site loads within 3 seconds
```

**Navigation & Sections**:
- [ ] Hero section displays correctly
- [ ] Prayer times section (may show placeholder if API not configured)
- [ ] Events section shows "No upcoming events" message
- [ ] YouTube section (may show placeholder if API not configured)  
- [ ] About section displays correctly
- [ ] Donation section displays correctly
- [ ] Newsletter section displays correctly
- [ ] Footer displays correctly

### ✅ Responsive Design

**Mobile Testing** (375px width):
- [ ] All sections stack vertically
- [ ] Text remains readable
- [ ] Buttons are touchable
- [ ] Images scale appropriately
- [ ] Navigation works on mobile

**Tablet Testing** (768px width):
- [ ] Layout adapts appropriately
- [ ] Grid systems work correctly
- [ ] Content remains accessible

**Desktop Testing** (1200px+ width):
- [ ] Full layout displays correctly
- [ ] All columns and grids align
- [ ] Images and content properly sized

### ✅ Performance Testing

**Speed Metrics**:
```
Tool: https://pagespeed.web.dev
Target Scores:
- Performance: >90
- Accessibility: >95  
- Best Practices: >90
- SEO: >90
```

**Load Time Testing**:
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.0s
- [ ] No layout shifts

### ✅ SEO & Metadata

**Meta Tags Check**:
```html
<!-- Verify these are present -->
<title>Sacramento Shia Muslim Association</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
```

**SEO Validation**:
- [ ] Page title is descriptive
- [ ] Meta description under 160 characters
- [ ] Open Graph tags present
- [ ] Canonical URL set correctly
- [ ] No broken links

---

## 🔐 Phase 3: Admin Portal Testing

### ✅ Access & Authentication

**Admin Portal Access**:
```
Test URL: https://admin.sacramento110.org
Expected: Login page loads with Google OAuth button
```

**Authentication Flow**:
1. **Click "Sign in with Google"**
   - [ ] Redirects to Google OAuth
   - [ ] Shows correct app name
   - [ ] Lists required permissions

2. **Complete OAuth Flow**
   - [ ] Successfully redirects back to admin portal
   - [ ] User is logged in
   - [ ] Dashboard loads correctly

3. **Unauthorized Access Test**
   - [ ] Non-admin users are blocked
   - [ ] Proper error messages shown
   - [ ] Redirect to login page

### ✅ Dashboard Functionality

**Dashboard Loading**:
- [ ] Dashboard loads within 5 seconds
- [ ] All widgets display correctly
- [ ] Charts and analytics render
- [ ] No JavaScript errors in console

**Dashboard Components**:
- [ ] Overview statistics display
- [ ] System health indicators work
- [ ] Interactive charts render (Phase 4 features)
- [ ] Recent activity shows
- [ ] Quick actions function

### ✅ Event Management

**Create Event Test**:
1. **Navigate to Events page**
   - [ ] Events list loads
   - [ ] "Add Event" button visible

2. **Fill out event form**:
   ```
   Title: Test Event
   Description: This is a test event
   Date: [Future date]
   Time: 7:00 PM
   Speaker: Test Speaker
   Location: Test Location
   Hosted By: SSMA Sacramento
   ```

3. **Upload test image**:
   - [ ] File upload works
   - [ ] Progress indicator shows
   - [ ] Image uploads to Google Drive
   - [ ] Preview displays correctly

4. **Save event**:
   - [ ] Form submits successfully
   - [ ] Success notification appears
   - [ ] Event appears in list
   - [ ] Data saved to Google Sheets

**Edit Event Test**:
1. **Select existing event**
   - [ ] Event details load in form
   - [ ] All fields populated correctly

2. **Modify event details**
   - [ ] Changes save successfully
   - [ ] Updated data reflects immediately
   - [ ] Audit log captures changes

**Delete Event Test**:
1. **Delete event**
   - [ ] Confirmation dialog appears
   - [ ] Event removed from list
   - [ ] Image removed from Google Drive
   - [ ] Data removed from Google Sheets

### ✅ User Management (Super-Admin Only)

**Add User Test**:
1. **Access user management**
   - [ ] User list loads
   - [ ] "Add User" option available

2. **Add new admin user**:
   ```
   Email: test@example.com
   Role: Admin
   Permissions: [Select appropriate permissions]
   ```

3. **Verify user creation**:
   - [ ] User appears in list
   - [ ] Correct role assigned
   - [ ] Permissions set correctly

**Role Management Test**:
1. **Modify user roles**
   - [ ] Role changes save
   - [ ] Permissions update accordingly
   - [ ] Changes reflected immediately

### ✅ Analytics & Reporting (Phase 4 Features)

**Analytics Dashboard**:
- [ ] Charts render correctly
- [ ] Data displays accurately
- [ ] Interactive elements work
- [ ] Real-time updates function

**Report Generation**:
1. **Generate events report**
   - [ ] Report generates successfully
   - [ ] Multiple formats available (CSV, JSON, HTML)
   - [ ] Data accuracy verified
   - [ ] Download functions properly

2. **Export functionality**
   - [ ] Bulk export works
   - [ ] File downloads correctly
   - [ ] Data integrity maintained

---

## 🔗 Phase 4: Integration Testing

### ✅ End-to-End Event Workflow

**Complete Event Lifecycle**:
1. **Admin creates event**
   - Event data → Google Sheets
   - Event image → Google Drive
   - Activity logged

2. **Event appears on main site**
   - [ ] Event visible in events section
   - [ ] Event details display correctly
   - [ ] Event image loads from Google Drive
   - [ ] Event sharing works

3. **Event interaction**
   - [ ] Click event opens modal
   - [ ] Share button generates correct link
   - [ ] Deep linking works (shared links open correct modal)

4. **Event cleanup**
   - [ ] Past events auto-removed (test with past date)
   - [ ] Images cleaned from Google Drive
   - [ ] Data removed from Google Sheets

### ✅ Google Services Integration

**Google Sheets Integration**:
```bash
# Test direct Google Sheets access
# Verify data appears in your sheets
```
- [ ] Events data writes correctly
- [ ] User data manages properly
- [ ] Activity logging functions
- [ ] Data format is consistent

**Google Drive Integration**:
- [ ] Images upload successfully
- [ ] Public URLs generated
- [ ] Images accessible from main site
- [ ] Cleanup removes old images

**Google Apps Script**:
```bash
# Test backend health endpoint
curl https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=health
```
- [ ] Health check responds
- [ ] All endpoints functional
- [ ] Error handling works
- [ ] Logging captures issues

### ✅ Authentication Integration

**OAuth Flow Testing**:
1. **First-time user login**
   - [ ] OAuth consent screen shows
   - [ ] Permissions requested correctly
   - [ ] User data saves to Google Sheets

2. **Returning user login**
   - [ ] Login bypasses consent (if previously approved)
   - [ ] User session restores
   - [ ] Permissions persist

3. **Session management**
   - [ ] Sessions timeout appropriately
   - [ ] Logout clears session
   - [ ] Token refresh works

---

## ⚡ Phase 5: Performance Testing

### ✅ Load Testing

**Main Website Performance**:
```
Tools:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
```

**Performance Targets**:
- [ ] Initial page load < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] First Contentful Paint < 2 seconds
- [ ] Core Web Vitals pass

**Admin Portal Performance**:
- [ ] Dashboard loads < 5 seconds
- [ ] Form submissions < 3 seconds
- [ ] Chart rendering < 2 seconds
- [ ] Image uploads progress smoothly

### ✅ Stress Testing

**Concurrent Users** (if applicable):
- [ ] Multiple admin users can work simultaneously
- [ ] No data conflicts occur
- [ ] System remains responsive

**Data Volume Testing**:
- [ ] System handles 100+ events
- [ ] Large image uploads work
- [ ] Bulk operations complete successfully

---

## 🛡️ Phase 6: Security Testing

### ✅ Authentication Security

**Access Control**:
- [ ] Unauthenticated users blocked from admin
- [ ] Role-based permissions enforced
- [ ] Session hijacking prevented
- [ ] CSRF protection active

**OAuth Security**:
- [ ] Secure OAuth implementation
- [ ] Token storage secure
- [ ] Proper scope limitations
- [ ] Secure redirect URLs

### ✅ Data Security

**Input Validation**:
- [ ] Form inputs sanitized
- [ ] File upload restrictions enforced
- [ ] XSS prevention active
- [ ] SQL injection not possible (using Sheets API)

**Data Protection**:
- [ ] Sensitive data encrypted in transit (HTTPS)
- [ ] Google Sheets access restricted
- [ ] Google Drive permissions proper
- [ ] Audit logging captures all actions

### ✅ Infrastructure Security

**HTTPS Security**:
- [ ] All traffic encrypted
- [ ] HTTP redirects to HTTPS
- [ ] Secure headers present
- [ ] Certificate properly configured

**Content Security**:
- [ ] Content Security Policy headers
- [ ] No mixed content warnings
- [ ] External resources over HTTPS
- [ ] Secure cookie settings

---

## 📊 Testing Results Template

### Infrastructure ✅/❌
- [ ] DNS Resolution: ✅
- [ ] SSL Certificates: ✅  
- [ ] GitHub Pages: ✅
- [ ] Domain Configuration: ✅

### Main Website ✅/❌
- [ ] Core Functionality: ✅
- [ ] Responsive Design: ✅
- [ ] Performance: ✅
- [ ] SEO: ✅

### Admin Portal ✅/❌
- [ ] Authentication: ✅
- [ ] Dashboard: ✅
- [ ] Event Management: ✅
- [ ] User Management: ✅
- [ ] Analytics: ✅

### Integration ✅/❌
- [ ] End-to-End Workflow: ✅
- [ ] Google Services: ✅
- [ ] Authentication: ✅

### Performance ✅/❌
- [ ] Load Testing: ✅
- [ ] Stress Testing: ✅

### Security ✅/❌
- [ ] Authentication Security: ✅
- [ ] Data Security: ✅
- [ ] Infrastructure Security: ✅

---

## 🚨 Issue Tracking

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| Example: Slow image loading | Medium | Open | Investigating CDN options |

### Severity Levels:
- **Critical**: System unusable, security vulnerability
- **High**: Major functionality broken
- **Medium**: Minor functionality issues
- **Low**: Cosmetic or enhancement

---

## ✅ Sign-off Checklist

**Technical Sign-off**:
- [ ] All critical tests pass
- [ ] Performance meets requirements
- [ ] Security validation complete
- [ ] Integration tests successful

**Business Sign-off**:
- [ ] Core functionality works as expected
- [ ] Admin portal enables event management
- [ ] Main site displays events correctly  
- [ ] System ready for production use

**Deployment Sign-off**:
- [ ] Production environment stable
- [ ] Monitoring and alerting configured
- [ ] Backup procedures tested
- [ ] Documentation complete

---

**System Testing Complete! 🎉**

Your SSMA Sacramento Events Management System is production-ready!
