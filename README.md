# 🕌 Sacramento Shia Muslim Association (SSMA) Website

A modern, mobile-first website for the Sacramento Shia Muslim Association featuring real-time prayer times, YouTube integration, and community information. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- 🕌 **Real-time Prayer Times** - Jafari method with live countdown and DST handling
- 📺 **YouTube Integration** - Latest videos with smart caching and modal viewing
- 💰 **Digital Donations** - QR codes for Venmo and Zelle payments
- 📧 **Newsletter Signup** - Community updates and notifications
- 📱 **Mobile-First Design** - Touch-friendly interface optimized for mobile devices
- 🎨 **Islamic Theme** - Traditional green, gold, and navy color palette

## 🚀 Quick Start

**Prerequisites:** Node.js 18+ and npm

```bash
# Clone and setup
git clone https://github.com/sacramento110/sacramento110.git
cd sacramento110
npm install

# Start development server
npm run dev
# Visit http://localhost:3000
```

**Optional:** Create `.env.local` for YouTube API integration (falls back to cached RSS data)

## 🏗️ Project Structure

```
src/
├── components/         # React components (layout, sections, ui)
├── hooks/             # Custom React hooks
├── services/          # Prayer times & YouTube integration
├── types/             # TypeScript definitions
├── utils/             # Constants and helpers
└── config/            # Production settings

.github/workflows/     # Auto-deployment & YouTube caching
public/                # Static assets and cached data
```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript checks

# Deployment
npm run deploy       # Deploy to GitHub Pages
```

## ⚙️ Configuration

**Prayer Times:** Update coordinates in `src/utils/constants.ts`
**Colors:** Modify Islamic theme in `tailwind.config.js`
**Content:** Edit site content in `src/utils/constants.ts`
**Features:** Toggle features in `src/config/production.ts`

## 🚀 Deployment

**Automatic:** Pushes to `main` branch auto-deploy via GitHub Actions
**Manual:** Run `npm run deploy` to build and deploy to GitHub Pages
**Compatible with:** Netlify, Vercel, Firebase Hosting, AWS S3

## 🔄 Automated Features

- **YouTube Caching:** Updates every 3 hours via GitHub Actions
- **Deployment:** Automatic on push to main branch
- **Browser Support:** Modern browsers and mobile devices
- **Security:** HTTPS-only, XSS protection, no sensitive data exposure

## 📄 License

Creative Commons Attribution 3.0 Unported License - Free to use with attribution required.

## 🆘 Support

- **Email:** [ssmatechshias@gmail.com](mailto:ssmatechshias@gmail.com)
- **Issues:** [GitHub Issues](https://github.com/sacramento110/sacramento110/issues)

## 🙏 Built With

React 18, TypeScript, Tailwind CSS, Vite, PrayTime, Lucide React

---

**Built with ❤️ for the Sacramento Shia Muslim community**
