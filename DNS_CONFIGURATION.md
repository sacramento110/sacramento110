# 🌐 DNS Configuration Guide

## Overview
This guide will help you configure DNS records for both the main website and admin portal to use your custom domain `sacramento110.org`.

---

## 🎯 Target Configuration

After setup, you will have:
- **Main Website**: `https://sacramento110.org`
- **Admin Portal**: `https://admin.sacramento110.org`
- **Automatic HTTPS**: GitHub Pages provides SSL certificates
- **CDN**: GitHub's global CDN for fast loading

---

## 📋 DNS Records to Configure

### Required DNS Records

#### 1. Main Domain (sacramento110.org)

**A Records** - Point to GitHub Pages servers:
```
Type: A
Name: @
TTL: 3600
Values:
  185.199.108.153
  185.199.109.153  
  185.199.110.153
  185.199.111.153
```

**AAAA Records** - IPv6 support (optional but recommended):
```
Type: AAAA
Name: @
TTL: 3600
Values:
  2606:50c0:8000::153
  2606:50c0:8001::153
  2606:50c0:8002::153
  2606:50c0:8003::153
```

#### 2. WWW Subdomain

**CNAME Record** - Redirect www to main domain:
```
Type: CNAME
Name: www
TTL: 3600
Value: armanahmed.github.io
```

#### 3. Admin Subdomain

**CNAME Record** - Admin portal:
```
Type: CNAME
Name: admin
TTL: 3600
Value: armanahmed.github.io
```

---

## 🛠️ Step-by-Step Configuration

### Step 1: Access Your Domain Registrar

1. Log into your domain registrar's control panel
2. Navigate to DNS Management or DNS Settings
3. Look for options to add/edit DNS records

### Step 2: Add A Records for Main Domain

1. **Add First A Record**:
   - Type: A
   - Name: @ (or leave blank for root domain)
   - Value: `185.199.108.153`
   - TTL: 3600 (or 1 hour)

2. **Add Additional A Records**:
   - Repeat for the other three IP addresses
   - Some registrars allow multiple values in one record
   - Others require separate records for each IP

### Step 3: Add CNAME Records

1. **WWW Subdomain**:
   - Type: CNAME
   - Name: www
   - Value: `armanahmed.github.io`
   - TTL: 3600

2. **Admin Subdomain**:
   - Type: CNAME
   - Name: admin
   - Value: `armanahmed.github.io`
   - TTL: 3600

### Step 4: Verify DNS Propagation

1. **Use Online Tools** to check DNS propagation:
   - https://dnschecker.org
   - https://whatsmydns.net
   - Enter your domain and check A/CNAME records

2. **Command Line Check** (if you have dig/nslookup):
   ```bash
   # Check main domain A records
   dig sacramento110.org A
   
   # Check admin subdomain CNAME
   dig admin.sacramento110.org CNAME
   
   # Check www subdomain CNAME
   dig www.sacramento110.org CNAME
   ```

3. **Expected Results**:
   ```
   sacramento110.org → 185.199.108.153 (and other IPs)
   admin.sacramento110.org → armanahmed.github.io
   www.sacramento110.org → armanahmed.github.io
   ```

---

## ⚙️ GitHub Pages Configuration

### Step 1: Configure Main Site Domain

1. **Go to Main Repository Settings**:
   - Navigate to your GitHub repository
   - Click "Settings" tab
   - Scroll to "Pages" section

2. **Set Custom Domain**:
   - Custom domain: `sacramento110.org`
   - Check "Enforce HTTPS" (after DNS propagates)
   - GitHub will verify domain ownership

### Step 2: Configure Admin Portal Domain

1. **Switch to Admin Portal Branch**:
   ```bash
   git checkout admin-portal
   ```

2. **Go to Repository Settings > Pages**:
   - Source: Deploy from a branch
   - Branch: `admin-portal`
   - Folder: `/ (root)`
   - Custom domain: `admin.sacramento110.org`
   - Check "Enforce HTTPS"

### Step 3: Verify CNAME Files

GitHub automatically creates CNAME files, but verify they exist:

1. **Main Site CNAME** (in root):
   ```
   sacramento110.org
   ```

2. **Admin Portal CNAME** (in admin-portal branch root):
   ```
   admin.sacramento110.org
   ```

---

## 🕐 Timing & Propagation

### DNS Propagation Timeline
- **Local ISP**: 0-30 minutes
- **Regional ISPs**: 30-120 minutes  
- **Global Coverage**: 2-24 hours
- **Full Propagation**: Up to 48 hours

### What to Expect
1. **Immediate**: DNS changes saved at registrar
2. **15-30 minutes**: Changes visible from your location
3. **2-4 hours**: Most global locations see changes
4. **24-48 hours**: Complete global propagation

### GitHub Pages SSL Certificate
- **Automatic**: GitHub provides SSL certificates for custom domains
- **Timing**: Usually available within 24 hours of domain verification
- **Verification**: GitHub checks domain ownership via DNS

---

## 🧪 Testing Your Configuration

### Step 1: Basic Connectivity

```bash
# Test if domains resolve
ping sacramento110.org
ping admin.sacramento110.org
ping www.sacramento110.org
```

### Step 2: HTTP/HTTPS Testing

```bash
# Test HTTP redirect to HTTPS
curl -I http://sacramento110.org

# Test HTTPS (after SSL is active)
curl -I https://sacramento110.org
curl -I https://admin.sacramento110.org
```

### Step 3: Browser Testing

1. **Main Website**: https://sacramento110.org
   - Should load the main SSMA website
   - Should redirect HTTP to HTTPS
   - Should show valid SSL certificate

2. **Admin Portal**: https://admin.sacramento110.org
   - Should load the admin login page
   - Should redirect HTTP to HTTPS
   - Should show valid SSL certificate

3. **WWW Redirect**: https://www.sacramento110.org
   - Should redirect to main domain
   - May take longer to set up

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Domain Not Resolving
**Symptoms**: "This site can't be reached" errors

**Solutions**:
- Check DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Clear browser DNS cache
- Try different DNS server (8.8.8.8, 1.1.1.1)

#### 2. SSL Certificate Issues
**Symptoms**: "Not secure" warnings, certificate errors

**Solutions**:
- Wait 24-48 hours for GitHub to issue certificate
- Ensure domain ownership is verified
- Check that CNAME file exists in repository
- Disable and re-enable "Enforce HTTPS"

#### 3. Admin Portal Not Loading
**Symptoms**: Admin subdomain shows 404 or main site

**Solutions**:
- Verify admin-portal branch has correct files
- Check CNAME record points to correct GitHub Pages URL
- Ensure GitHub Pages is configured for admin-portal branch

#### 4. Mixed Content Errors
**Symptoms**: Some content not loading over HTTPS

**Solutions**:
- Update all HTTP links to HTTPS
- Check Google Apps Script URLs use HTTPS
- Update any hardcoded HTTP references

### Validation Tools

1. **DNS Checking**:
   - https://dnschecker.org
   - https://www.whatsmydns.net
   - https://mxtoolbox.com/DNSLookup.aspx

2. **SSL Certificate Checking**:
   - https://www.sslshopper.com/ssl-checker.html
   - https://www.ssllabs.com/ssltest/

3. **Website Performance**:
   - https://pagespeed.web.dev
   - https://www.webpagetest.org

---

## 📊 Expected Configuration Summary

| Record Type | Name | Value | Purpose |
|-------------|------|-------|---------|
| A | @ | 185.199.108.153 | Main domain to GitHub |
| A | @ | 185.199.109.153 | Main domain to GitHub |
| A | @ | 185.199.110.153 | Main domain to GitHub |
| A | @ | 185.199.111.153 | Main domain to GitHub |
| CNAME | www | armanahmed.github.io | WWW redirect |
| CNAME | admin | armanahmed.github.io | Admin portal |

### GitHub Pages Settings

| Site | Branch | Custom Domain | HTTPS |
|------|--------|---------------|-------|
| Main | main | sacramento110.org | ✅ |
| Admin | admin-portal | admin.sacramento110.org | ✅ |

---

## ✅ Verification Checklist

- [ ] A records added for main domain
- [ ] CNAME record added for www subdomain
- [ ] CNAME record added for admin subdomain
- [ ] DNS propagation completed (24-48 hours)
- [ ] GitHub Pages configured for main domain
- [ ] GitHub Pages configured for admin domain
- [ ] SSL certificates issued and active
- [ ] Main website loads at https://sacramento110.org
- [ ] Admin portal loads at https://admin.sacramento110.org
- [ ] WWW redirects to main domain
- [ ] HTTP traffic redirects to HTTPS
- [ ] No mixed content warnings
- [ ] SSL certificates show as valid

---

Your custom domain configuration is complete! 🎉