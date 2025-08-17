# Sacramento Shia Muslim Association (SSMA) Website

A modern, mobile-first website for the Sacramento Shia Muslim Association built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Prayer Times**: Real-time prayer times using Shia Jafaria method for Sacramento, CA
- **Upcoming Events**: Dynamic events section with Google Sheets integration
- **YouTube Videos**: Latest videos from SSMA YouTube channel with modal playback
- **About & Donation**: Community information and donation options (Venmo/Zelle)
- **Newsletter Signup**: Community newsletter subscription
- **Islamic Theme**: Beautiful Islamic-inspired design with green and gold colors

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sacramento110.git
cd sacramento110
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 📱 Sections

### 1. Hero Section
- Welcome banner with SSMA branding
- Next prayer time countdown
- Call-to-action buttons

### 2. Prayer Times
- 8 daily prayer times including sunset
- Shia Jafaria calculation method
- Next prayer highlighting
- Sacramento, CA location

### 3. Events
- Upcoming community events
- Horizontal scrolling cards
- Google Sheets integration (planned)

### 4. YouTube Videos
- Latest 10 videos from SSMA channel
- Auto-play modal functionality
- RSS2JSON API integration

### 5. About Us
- Community information
- Mission statement
- Features and services

### 6. Donation
- Venmo and Zelle QR codes
- Multiple donation methods
- Impact information

### 7. Newsletter & Social
- Email newsletter signup
- Social media links
- Community engagement

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **YouTube**: React YouTube component
- **Prayer Times**: PrayTime library
- **Deployment**: GitHub Pages

## 📦 Build & Deploy

### Build for production:
```bash
npm run build
```

### Deploy to GitHub Pages:
```bash
npm run deploy
```

## 🔧 Configuration

### Prayer Times
- Location: Sacramento, CA (38.5816°N, 121.4944°W)
- Method: Shia Jafaria
- Timezone: America/Los_Angeles

### YouTube Integration
- Channel: @sacramentoshia6230
- API: RSS2JSON (free alternative to YouTube API v3)

### Google Sheets (Future)
- Events management through Google Sheets
- Admin portal for event creation
- Google Drive for image storage

## 🌐 Deployment

The website is configured for GitHub Pages deployment:

1. Push to `main` branch
2. GitHub Actions automatically builds and deploys
3. Visit your GitHub Pages URL

### Manual Deployment
1. Run `npm run build`
2. Deploy the `dist` folder to your hosting provider

## 📱 Mobile Optimization

- Mobile-first responsive design
- Touch-friendly interfaces
- Optimized loading for mobile networks
- Horizontal scrolling sections for mobile

## 🎨 Customization

### Colors
The Islamic theme uses:
- **Primary Green**: #3ba33b (islamic-green-600)
- **Gold Accent**: #ecac51 (islamic-gold-500)
- **Navy Blue**: #434d5c (islamic-navy-900)

### Fonts
- **Primary**: Inter (sans-serif)
- **Arabic**: Amiri (serif)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- SSMA community for support and feedback
- Open source libraries and tools used
- Islamic design inspiration

## 📞 Support

For technical support or questions:
- Create an issue on GitHub
- Contact the development team

---

Built with ❤️ for the Sacramento Shia Muslim Association community.
