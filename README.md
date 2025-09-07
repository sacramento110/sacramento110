# 🕌 Sacramento Shia Muslim Association (SSMA) Website

A modern, mobile-first website for the Sacramento Shia Muslim Association featuring real-time prayer times, live event streaming, Shia Islamic calendar, Qibla direction finder, and community information. Built with React, TypeScript, and Tailwind CSS.

**Live Website:** [sacramentoshia.org](https://sacramentoshia.org/)

## ✨ Features

### 🕐 **Real-time Prayer Times**
- **Jafari Method**: Accurate prayer calculations following Shia jurisprudence
- **Live Countdown**: Real-time countdown to next prayer with automatic updates
- **Sacramento Coordinates**: Precise location-based calculations (38.5816°N, 121.4944°W)
- **DST Handling**: Automatic daylight saving time adjustments
- **Mobile-Optimized**: Horizontal scroll interface for easy mobile viewing

### 📅 **Live Islamic Calendar**
- **IMAM-US Integration**: Direct connection to IMAM-US.org calendar
- **Ayatollah Sistani Guidelines**: Follows official rulings and religious observances
- **Real-time Sync**: Auto-updates with Shia events, commemorations, and community programs
- **Responsive Design**: Full calendar view on desktop, agenda view on mobile
- **Sacramento Time Zone**: All events displayed in Pacific Time (America/Los_Angeles)

### 📺 **Live Event Streaming**
- **Automatic Detection**: Monitors YouTube channel every 30 seconds for live streams
- **Smart Recognition**: Identifies live events through title patterns and recent uploads
- **Real-time Notifications**: Prominent "LIVE" indicator with pulsing animation
- **One-Click Access**: Instant full-screen modal viewing
- **Live Viewer Count**: Shows current audience size
- **Fallback Support**: Graceful handling when detection is unavailable

### 🧭 **Qibla Direction Finder**
- **GPS-Based Compass**: Accurate direction calculation using device location
- **Mobile-Only Feature**: Collapsible interface optimized for mobile devices
- **Beta Status**: Active development with user feedback collection
- **Touch-Friendly**: Large buttons and intuitive mobile interface

### 🎥 **Video Library**
- **Latest Content**: Automatically displays newest videos from SSMA YouTube channel
- **Smart Caching**: Hourly updates via GitHub Actions for fast loading
- **Modal Viewing**: Full-screen video player with YouTube integration
- **Mobile-Optimized**: Horizontal scroll for easy browsing
- **Thumbnail Fallbacks**: Graceful handling of missing thumbnails

### 💰 **Digital Donations**
- **QR Code Integration**: Venmo (@ssma786) and Zelle payment options
- **Mobile-First**: Optimized for quick mobile donations
- **Secure Processing**: No sensitive data stored on website

### 📱 **Mobile-First Design**
- **99% Mobile Users**: Optimized for smartphone usage
- **Touch-Friendly**: Large buttons and intuitive gestures
- **Responsive Layout**: Adapts perfectly to all screen sizes
- **Fast Loading**: Optimized images and efficient code splitting

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **VS Code** (recommended) or any modern IDE
- **Git**

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/sacramento110/sacramento110.git
cd sacramento110

# Install dependencies
npm install

# Start development server
npm run dev
# Visit http://localhost:5173
```

## 👨‍💻 Developer Setup & Getting Started

### 🛠️ **Development Environment Setup**

#### **Option 1: VS Code (Recommended)**

1. **Install VS Code** with the following extensions:
   - ESLint
   - Prettier
   - TypeScript Importer
   - Tailwind CSS IntelliSense
   - Auto Rename Tag
   - Bracket Pair Colorizer

2. **Open the project** in VS Code - all settings are pre-configured!

3. **Automatic features you'll get:**
   - ✅ Format on save with Prettier
   - ✅ ESLint error highlighting
   - ✅ Auto-fix ESLint issues on save
   - ✅ Import organization on save
   - ✅ Tailwind CSS IntelliSense

#### **Option 2: Other IDEs**

1. **Install recommended extensions** for your IDE:
   - ESLint extension
   - Prettier extension
   - TypeScript support

2. **Configure extensions** to run on save

3. **Manual commands** for formatting:
   ```bash
   npm run format        # Format all files
   npm run lint:fix      # Fix linting issues
   npm run type-check    # Check TypeScript types
   ```

### 🔧 **Development Workflow**

1. **Make changes** to code files
2. **Save files** → Auto-formatting happens automatically
3. **Check terminal** for any linting errors
4. **Commit changes** → Pre-commit hooks run automatically
5. **Push to GitHub** → Auto-deployment happens

### 🏗️ **Project Structure**

```
src/
├── components/         # React components
│   ├── layout/        # Header, Footer, Layout
│   ├── sections/      # Page sections (Hero, Prayer Times, Calendar, etc.)
│   └── ui/            # Reusable UI components (Button, Card, Modal, etc.)
├── hooks/             # Custom React hooks
│   ├── usePrayerTimes.ts      # Prayer time calculations
│   ├── useLiveStream.ts       # Live stream detection
│   ├── useQiblaDirection.ts   # Qibla compass functionality
│   └── useYouTubeVideos.ts    # YouTube video management
├── services/          # API calls and external services
│   ├── prayerTimes.ts         # Prayer time calculations
│   ├── liveStream.ts          # Live stream detection logic
│   └── youtube.ts             # YouTube API integration
├── types/             # TypeScript type definitions
│   ├── prayer.ts              # Prayer time types
│   └── youtube.ts             # YouTube API types
├── utils/             # Helper functions and constants
│   ├── constants.ts           # Site configuration
│   ├── qiblaCalculations.ts   # Qibla direction math
│   └── dateHelpers.ts         # Date utility functions
└── main.tsx           # Application entry point

.github/workflows/     # GitHub Actions for deployment & caching
public/                # Static assets and cached data
scripts/               # Build and utility scripts
```

### 🧪 **Available Scripts**

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build           # Build for production
npm run preview         # Preview production build locally

# Code Quality
npm run lint            # Check for linting errors
npm run lint:fix        # Auto-fix linting issues
npm run format          # Format all files with Prettier
npm run format:check    # Check if files are formatted
npm run type-check      # Check TypeScript types

# Deployment & Maintenance
npm run deploy          # Deploy to GitHub Pages
npm run update-youtube  # Update YouTube cache manually
npm run clean           # Clean build artifacts
```

### 🛡️ **Code Quality & Git Hooks**

#### **Pre-commit Hook (Automatic)**

Every time you commit, the following runs automatically:

1. **ESLint** fixes all auto-fixable issues
2. **Prettier** formats all modified files
3. **Commit blocked** if there are unfixable errors

#### **Benefits:**
- 🚫 **No broken code** gets committed
- 🎨 **Consistent formatting** across all developers
- ⚡ **Zero configuration** needed by new developers

### 🎨 **Styling Guidelines**

- **Tailwind CSS** for all styling
- **Mobile-first** approach (99% mobile users)
- **Islamic theme** colors (green, gold, navy)
- **Consistent spacing** using Tailwind utilities
- **Touch-friendly** interface design

### ⚙️ **Configuration Files**

#### **Key Configuration Files:**

- **`src/utils/constants.ts`** - Site content, coordinates, contact info
- **`tailwind.config.js`** - Islamic theme colors and custom utilities
- **`vite.config.ts`** - Build configuration and plugins
- **`tsconfig.json`** - TypeScript configuration
- **`.eslintrc.js`** - ESLint rules and configuration
- **`.prettierrc`** - Code formatting rules

#### **Customization:**

```typescript
// src/utils/constants.ts
export const SACRAMENTO_COORDS = {
  latitude: 38.5816,    // Update for different location
  longitude: -121.4944,  // Update for different location
  timezone: 'America/Los_Angeles',
};

export const SSMA_INFO = {
  name: 'Sacramento Shia Muslim Association',
  // Update contact info, social links, etc.
};
```

### 🔄 **Development Workflow**

1. **Clone and setup** the repository
2. **Make changes** to code files
3. **Save files** → Auto-formatting happens
4. **Check terminal** for any linting errors
5. **Commit changes** → Pre-commit hooks run
6. **Push to GitHub** → Auto-deployment happens

### 🚀 **Deployment & Automation**

#### **Automatic Deployment**
- **Trigger:** Pushes to `main` branch auto-deploy via GitHub Actions
- **Target:** GitHub Pages with custom domain (sacramento110.com)
- **Frequency:** Immediate on code changes

#### **Automated Features**
- **YouTube Caching:** Updates every hour (24x/day) via GitHub Actions
- **Calendar Sync:** Real-time updates from IMAM-US calendar
- **Build Process:** TypeScript compilation, Vite bundling, asset optimization
- **Security:** HTTPS-only, XSS protection, no sensitive data exposure

#### **Manual Deployment**
```bash
npm run deploy  # Build and deploy to GitHub Pages
```

**Compatible with:** Netlify, Vercel, Firebase Hosting, AWS S3

## 🆘 Troubleshooting

### **Common Issues & Solutions**

#### **ESLint/Prettier Issues**
```bash
npm run lint:fix        # Fix most issues automatically
npm run format          # Reformat all files
npm run format:check    # Check formatting without fixing
```

#### **TypeScript Errors**
```bash
npm run type-check      # See all type errors
```

#### **Development Server Issues**
```bash
npm run clean           # Clean build artifacts
npm install             # Reinstall dependencies
npm run dev             # Restart dev server
```

#### **YouTube Cache Issues**
```bash
npm run update-youtube  # Manually update YouTube cache
```

#### **Qibla Compass Issues**
- **Email:** [ssmatechshias@gmail.com](mailto:ssmatechshias@gmail.com)
- **Subject:** "Qibla Compass Issue"
- **Include:** Device type, browser, and description of issue

#### **Live Stream Detection Issues**
- Check YouTube channel RSS feed manually
- Verify channel ID in `src/services/liveStream.ts`
- Check network connectivity and API limits

### **Performance Optimization**

- **Image Optimization:** All images are optimized for web
- **Code Splitting:** Automatic code splitting with Vite
- **Caching:** YouTube videos cached hourly for fast loading
- **Mobile Performance:** Optimized for mobile devices

## 🛠️ Technical Stack

**Frontend:** React 18, TypeScript, Tailwind CSS
**Build Tool:** Vite
**Prayer Times:** PrayTime library (Jafari method)
**Calendar:** IMAM-US Google Calendar integration
**Live Streaming:** YouTube RSS API with smart detection
**Qibla:** GPS-based compass calculations
**Icons:** Lucide React
**Deployment:** GitHub Pages with GitHub Actions
**Code Quality:** ESLint, Prettier, Husky
**Caching:** GitHub Actions for YouTube data

## 📧 Support & Contact

- **Website:** [sacramentoshia.org](https://sacramentoshia.org/)
- **Email:** [ssmatechshias@gmail.com](mailto:ssmatechshias@gmail.com)
- **Issues:** [GitHub Issues](https://github.com/sacramento110/sacramento110/issues)
- **Repository:** [GitHub](https://github.com/sacramento110/sacramento110)

## 📄 License

Creative Commons Attribution 3.0 Unported License - Free to use with attribution required.

## 🙏 Acknowledgments

- **IMAM-US.org** for the official Shia Islamic calendar following Ayatollah Sistani's guidelines
- **Sacramento Shia Muslim Association** for community support
- **PrayTime** library for accurate prayer time calculations
- **All contributors** who help maintain and improve this project

---

**Built with ❤️ for the Sacramento Shia Muslim community**

_Need help getting started? Check the troubleshooting section above or open an issue on GitHub._