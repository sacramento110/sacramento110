# 🕌 Sacramento Shia Muslim Association (SSMA) Website

A modern, responsive website for the Sacramento Shia Muslim Association featuring real-time prayer times, YouTube integration, and community information. Built with React, TypeScript, and Tailwind CSS for optimal performance and accessibility.

## ✨ Features

### 🕌 **Prayer Times**

- **Real-time calculations** for Sacramento using Jafari (Shia) method
- **8 daily prayers**: Fajr, Sunrise, Dhuhr, Asr, Maghrib, Sunset, Isha, Midnight
- **Live countdown** to next prayer with automatic updates
- **Accurate timing** with automatic Daylight Saving Time handling
- **Responsive prayer cards** with Islamic icons

### 📺 **YouTube Integration**

- **Latest videos** from Sacramento Shia community channel
- **Smart caching** system updated every 3 hours via GitHub Actions
- **Thumbnail optimization** with multiple quality fallbacks
- **Video modal** for seamless viewing experience
- **Responsive grid** layout adapting to all screen sizes

### 📧 **Newsletter & Community**

- **Newsletter signup** for community updates
- **Social media links** (YouTube channel)
- **Email validation** with error handling
- **Success confirmation** with visual feedback

### 💰 **Donations**

- **Secure QR codes** for Venmo and Zelle payments
- **Mobile-optimized** for quick scanning
- **No sensitive data exposure** - QR code based only
- **Clear donation process** with visual guides

### ℹ️ **About Section**

- **Community mission** and values
- **Urdu-speaking Shia community** focus
- **Educational content** about SSMA

### 🎨 **Design & Performance**

- **Islamic theme** with green, gold, and navy color palette
- **Mobile-first responsive** design
- **Fast loading** with optimized assets
- **Accessible** components with proper ARIA labels
- **Modern animations** and smooth transitions

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sacramento110/sacramento110.git
   cd sacramento110
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)

   ```bash
   # Create .env.local for optional features
   echo "VITE_YOUTUBE_API_KEY=your_api_key_here" > .env.local
   echo "VITE_YOUTUBE_CHANNEL_ID=UCPuYa6IFOW3zcVxH1bRXa8g" >> .env.local
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Visit [http://localhost:3000](http://localhost:3000)
   - The site will automatically open in your default browser

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Layout components (Header, Footer, Layout)
│   ├── sections/       # Page sections
│   │   ├── AboutSection.tsx
│   │   ├── DonationSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── NewsletterSection.tsx
│   │   ├── PrayerTimesSection.tsx
│   │   └── YouTubeSection.tsx
│   └── ui/            # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── LoadingSpinner.tsx
│       ├── Modal.tsx
│       └── VideoModal.tsx
├── hooks/              # Custom React hooks
│   ├── useModal.ts
│   ├── usePrayerTimes.ts
│   ├── useRealTimeCountdown.ts
│   └── useYouTubeVideos.ts
├── services/           # API and external services
│   ├── prayerTimes.ts  # Prayer time calculations (Jafari method)
│   └── youtube.ts      # YouTube RSS feed integration
├── types/              # TypeScript type definitions
│   ├── prayer.ts
│   ├── praytime.d.ts
│   └── youtube.ts
├── utils/              # Utility functions and constants
│   ├── constants.ts    # Site configuration and constants
│   └── dateHelpers.ts  # Date/time formatting utilities
├── config/             # Environment-specific configuration
│   └── production.ts   # Production settings and feature flags
├── index.css           # Global styles and Tailwind imports
├── main.tsx            # Application entry point
└── App.tsx             # Main app component and routing

public/
├── images/            # Static images (logos, QR codes)
├── youtube-cache.json # Auto-generated YouTube videos cache
└── favicon.ico        # Site icon

scripts/
└── update-youtube-cache.js  # YouTube cache update script

.github/workflows/     # GitHub Actions CI/CD
├── deploy-main.yml    # Main site deployment
└── youtube-cache.yml  # Automated YouTube cache updates
```

## 📜 Available Scripts

### Development

```bash
npm run dev          # Start development server (localhost:3000)
npm run dev:local    # Start with development mode explicitly
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run clean        # Clean build artifacts
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript checks
```

### Deployment & Maintenance

```bash
npm run deploy          # Build and deploy to GitHub Pages
npm run update-youtube  # Manually update YouTube cache
```

## 🎨 Customization

### 🎯 **Prayer Times Configuration**

Located in `src/utils/constants.ts`:

```typescript
export const SACRAMENTO_COORDS = {
  latitude: 38.5816, // Sacramento City Hall coordinates
  longitude: -121.4944,
  timezone: 'America/Los_Angeles',
};
```

### 🌈 **Color Theme**

Customizable in `tailwind.config.js`:

```javascript
colors: {
  islamic: {
    green: { /* Islamic green palette */ },
    gold: { /* Islamic gold palette */ },
    navy: { /* Deep navy palette */ }
  }
}
```

### 📺 **YouTube Channel**

Update in `src/utils/constants.ts`:

```typescript
export const SSMA_INFO = {
  youtube: 'https://www.youtube.com/@sacramentoshia6230',
  channelId: 'UCsacramentoshia6230',
  // ... other settings
};
```

### 🎨 **Site Content**

- **About section**: Modify `ABOUT_CONTENT` in `src/utils/constants.ts`
- **Contact information**: Update `SSMA_INFO` object
- **Donation details**: Modify `DONATION_INFO` object

### 🔧 **Feature Toggles**

Configure features in `src/config/production.ts`:

```typescript
FEATURES: {
  ENABLE_PRAYER_TIMES: true,
  ENABLE_YOUTUBE: true,
  ENABLE_NEWSLETTER: true,
  ENABLE_DONATIONS: true,
  ENABLE_ANALYTICS: false,
}
```

## 🚀 Deployment

### GitHub Pages (Recommended)

1. **Enable GitHub Pages** in repository settings
2. **Automatic deployment** on push to main branch
3. **Custom domain** supported via `CNAME` file

### Manual Deployment

```bash
npm run deploy  # Builds and deploys to gh-pages branch
```

### Other Platforms

Compatible with:

- **Netlify**: Connect GitHub repo
- **Vercel**: Import from GitHub
- **Firebase Hosting**: Use Firebase CLI
- **AWS S3**: Static website hosting

## ⚙️ Environment Variables

Create `.env.local` for optional features:

```env
# YouTube Integration (optional - falls back to cached data)
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_YOUTUBE_CHANNEL_ID=UCPuYa6IFOW3zcVxH1bRXa8g

# Google Analytics (optional)
VITE_GA_ID=your_google_analytics_id
```

> **Note**: YouTube features work without API keys using RSS feeds and caching

## 🔄 Automated Systems

### YouTube Video Caching

- **Frequency**: Every 3 hours (8 times daily)
- **Source**: YouTube RSS feeds via RSS2JSON
- **Storage**: `public/youtube-cache.json`
- **Fallback**: Manual script available
- **Thumbnail optimization**: Multiple quality detection

### Continuous Deployment

- **Trigger**: Push to main branch
- **Build**: Node.js 18, npm ci, TypeScript compilation
- **Deploy**: Automatic GitHub Pages deployment
- **Cache**: npm dependencies cached for faster builds

## 📱 Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile devices**: iOS Safari, Chrome Mobile
- **Progressive enhancement**: Graceful degradation for older browsers
- **Accessibility**: WCAG 2.1 AA compliance

## 🔒 Security Features

- **No sensitive data**: All secrets properly masked
- **CSP ready**: Content Security Policy compatible
- **HTTPS only**: Secure connections enforced
- **XSS protection**: Input sanitization and validation
- **Clean production**: No debug statements or console logs

## 📄 License

This project is licensed under the **Creative Commons Attribution 3.0 Unported License**.

- ✅ **Free to use**: For any purpose, including commercial
- ✅ **Modify freely**: Adapt and build upon the work
- ✅ **Share widely**: Distribute copies and adaptations
- ⚠️ **Attribution required**: Credit the original creators

See the [LICENSE.txt](LICENSE.txt) file for complete details.

## 🆘 Support

For questions, issues, or support:

- **📧 Email**: [ssmatechshias@gmail.com](mailto:ssmatechshias@gmail.com)
- **🐛 Issues**: [Create a GitHub issue](https://github.com/sacramento110/sacramento110/issues)
- **💬 Community**: Contact through the website

### 🔧 Common Issues

1. **Prayer times not loading**: Check internet connection and try refreshing
2. **Videos not displaying**: Cache will update automatically every 3 hours
3. **Development server issues**: Ensure Node.js 18+ and run `npm clean-install`

## 🙏 Acknowledgments

### Open Source Libraries

- **⚛️ React 18** - UI framework
- **🎨 Tailwind CSS** - Styling framework
- **⚡ Vite** - Build tool and development server
- **📱 TypeScript** - Type safety and developer experience
- **🕌 PrayTime** - Islamic prayer time calculations
- **📺 React YouTube** - YouTube video integration
- **🎯 Lucide React** - Beautiful icon system

### Community

- **Sacramento Shia Muslim Association** community members
- **Open source contributors** and maintainers
- **Islamic design inspiration** from traditional patterns

### Special Thanks

- Community volunteers who provided feedback and testing
- Technical reviewers who helped improve code quality
- Islamic scholars who validated prayer time calculations

---

**Built with ❤️ for the Sacramento Shia Muslim community**
