# Sacramento Shia Muslim Association (SSMA) Website

A modern, responsive website for the Sacramento Shia Muslim Association featuring prayer times, YouTube integration, and community information.

## 🌟 Features

- **🕌 Prayer Times**: Real-time prayer times for Sacramento
- **📺 YouTube Integration**: Latest videos from the community channel
- **📧 Newsletter Signup**: Community newsletter subscription
- **💰 Donations**: Support the community through secure donations
- **📱 Responsive Design**: Optimized for all devices
- **⚡ Fast Performance**: Modern React with Vite for optimal speed

## 🏗️ Architecture

This project uses a **simplified static architecture** for easy maintenance:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   YouTube API   │    │   Cache Script   │    │   Static JSON   │
│   (Videos)      │───▶│  (Every 3hrs)    │───▶│(youtube-cache.json)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
┌─────────────────┐                                     │
│  Prayer Times   │                                     ▼
│    (API)        │                              ┌─────────────────┐
└─────────────────┘                              │  React Website  │
                                                 │   (Frontend)    │
                                                 └─────────────────┘
```

### Key Benefits:

- ✅ **Simple Architecture**: Static content with API integrations
- ✅ **No Complex Auth**: No login systems or admin portals to maintain
- ✅ **Fast Website**: Cached content means instant loading
- ✅ **Automated Updates**: Content updates automatically every 3 hours
- ✅ **Cost Effective**: Minimal hosting and maintenance costs
- ✅ **Reliable**: Fewer moving parts means fewer things can break

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Sheets for event management
- Google Drive for image storage

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/sacramento110.git
   cd sacramento110
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   # YouTube API (optional)
   VITE_YOUTUBE_API_KEY=your_youtube_api_key
   VITE_YOUTUBE_CHANNEL_ID=your_channel_id

   # Google Analytics (optional)
   VITE_GA_ID=your_ga_id
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) (or the port shown in terminal)

## 📊 Events Management

### Google Sheets Setup

1. **Create a Google Sheets spreadsheet** with these columns:

   ```
   ID | Title | Description | Date | StartTime | EndTime | Location | Address | Speaker | Category | Status | ImageURL | RegistrationRequired | MaxAttendees | ContactEmail | ContactPhone
   ```

2. **Sample data format**:

   ```
   event-1 | Weekly Majlis | Community gathering | 2025-08-24 | 19:30 | 21:00 | SSMA Center | 123 Main St | Maulana Ali | religious | published | https://... | false | | events@sacramento110.org |
   ```

3. **Set up Google Service Account**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google Sheets API and Google Drive API
   - Create a Service Account and download the JSON credentials
   - Share your spreadsheet with the service account email

### Image Management

1. **Create a Google Drive folder** for event images
2. **Upload images** to the folder
3. **Get shareable links** and use them in the ImageURL column
4. **Format**: Use the direct download format: `https://drive.google.com/uc?id=FILE_ID`

### Automated Sync

The system automatically syncs events every 3 hours using GitHub Actions:

- **Schedule**: Every 3 hours (configurable)
- **Manual Trigger**: Available in GitHub Actions tab
- **Output**: Updates `public/events.json`
- **Deployment**: Automatically triggers website rebuild

## 🔧 Development

### Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Layout components
│   ├── sections/       # Page sections
│   └── ui/            # Reusable UI components
├── services/          # API and data services
├── hooks/             # Custom React hooks
├── types/             # TypeScript definitions
├── utils/             # Utility functions
└── config/           # Configuration files

scripts/
├── sync-events.js     # Google Sheets sync script
└── update-youtube-cache.js  # YouTube cache update

public/
├── events.json        # Generated events data
└── images/           # Static images
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Events Management
npm run sync-events     # Manually sync events from Google Sheets

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier
npm run type-check      # Run TypeScript checks

# Deployment
npm run deploy          # Deploy to GitHub Pages
```

### Environment Variables

Create `.env.local` for local development:

```env
# Google Sheets Sync (for development only)
GOOGLE_SHEETS_ID=your_spreadsheet_id
GOOGLE_DRIVE_FOLDER_ID=your_drive_folder_id
GOOGLE_CREDENTIALS_PATH=./google-credentials.json

# YouTube Integration (optional)
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_YOUTUBE_CHANNEL_ID=your_channel_id

# Analytics (optional)
VITE_GA_ID=your_google_analytics_id
```

## 🚀 Deployment

### GitHub Pages (Recommended)

1. **Enable GitHub Pages** in repository settings
2. **Set up GitHub Secrets** for automated sync:
   ```
   GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
   GOOGLE_SHEETS_ID=your_spreadsheet_id
   GOOGLE_DRIVE_FOLDER_ID=your_drive_folder_id
   ```
3. **Deploy**:
   ```bash
   npm run deploy
   ```

### Other Platforms

The site can be deployed to any static hosting platform:

- **Netlify**: Connect GitHub repo and deploy automatically
- **Vercel**: Import GitHub repo and deploy
- **Firebase Hosting**: Use Firebase CLI
- **AWS S3**: Static website hosting

## 🔄 Events Sync Setup

### 1. Google Cloud Setup

1. **Create a project** in [Google Cloud Console](https://console.cloud.google.com)
2. **Enable APIs**:
   - Google Sheets API
   - Google Drive API
3. **Create Service Account**:
   - Go to IAM & Admin → Service Accounts
   - Create new service account
   - Download JSON credentials

### 2. Google Sheets Setup

1. **Create spreadsheet** with the required columns (see above)
2. **Share with service account**: Use the email from the JSON credentials
3. **Get spreadsheet ID**: From the URL `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

### 3. GitHub Secrets

Add these secrets to your GitHub repository:

```
GOOGLE_SERVICE_ACCOUNT_JSON   # Full JSON credentials from step 1
GOOGLE_SHEETS_ID             # Spreadsheet ID from step 2
GOOGLE_DRIVE_FOLDER_ID       # Drive folder ID for images
```

### 4. Test Sync

```bash
# Manual test
npm run sync-events

# GitHub Actions
# Go to Actions tab → Sync Events → Run workflow
```

## 🎨 Customization

### Styling

- **Framework**: Tailwind CSS with custom Islamic/community theme
- **Colors**: Defined in `tailwind.config.js`
- **Components**: Modular component system
- **Responsive**: Mobile-first design

### Content

- **Events**: Managed via Google Sheets
- **Prayer Times**: Auto-fetched for Sacramento
- **YouTube**: Configure channel in environment variables
- **Contact Info**: Update in component files

## 📱 Features Detail

### Events System

- **Static JSON**: Fast loading, cached events
- **Auto-sync**: Updates every 3 hours from Google Sheets
- **Categories**: Religious, Educational, Community, Social
- **Registration**: Optional with capacity limits
- **Sharing**: Social media integration

### Prayer Times

- **Real-time**: Calculated for Sacramento location
- **Islamic Calendar**: Hijri dates and Islamic events
- **Timezone**: Automatic Sacramento timezone handling

### YouTube Integration

- **Latest Videos**: Displays recent community videos
- **Caching**: Reduces API calls with smart caching
- **Responsive**: Video player adapts to screen size

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style (ESLint + Prettier)
- Write TypeScript for type safety
- Test on multiple devices/browsers
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.

## 🆘 Support

For questions or support:

- **Email**: admin@sacramento110.org
- **Issues**: Create a GitHub issue
- **Community**: Contact through the website

## 🙏 Acknowledgments

- Sacramento Shia Muslim Association community
- Open source libraries and contributors
- Islamic design inspiration and resources

---

**Built with ❤️ for the Sacramento Shia Muslim community**
