# YouTube Videos Cache System

## Overview

The SSMA website uses a smart caching system to display YouTube videos efficiently and reliably. This system fetches videos from the SSMA YouTube channel using RSS2JSON and caches them to provide fast loading and handle API failures gracefully.

## Features

### 🔄 Automatic Updates
- **Cron Schedule**: Updates 8 times per day (every 3 hours)
- **GitHub Actions**: Automated workflow handles the updates
- **Times**: 00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00 UTC

### 📦 Caching Strategy
- **Primary Source**: Cached JSON file (`/public/youtube-cache.json`)
- **Fallback**: Direct RSS2JSON API call if cache fails
- **Error Handling**: Graceful error messages with YouTube channel link

### 🎯 Video Display
- **Quantity**: 10 most recent videos
- **Layout**: Horizontal scrolling cards
- **Information**: Thumbnail, title, publication date, channel name
- **Interaction**: Click to open auto-play modal with close button

## Cache File Structure

```json
{
  "videos": [
    {
      "id": "unique-video-id",
      "title": "Video Title",
      "description": "Video description",
      "thumbnail": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
      "publishedAt": "2024-01-15T19:00:00Z",
      "videoId": "YouTube_VIDEO_ID",
      "channelTitle": "Sacramento Shia",
      "link": "https://youtube.com/watch?v=VIDEO_ID"
    }
  ],
  "lastUpdated": "2024-01-20T12:00:00Z",
  "status": "success"
}
```

## Manual Cache Update

### For Development
```bash
# Update cache manually during development
npm run update-youtube

# This runs the script: scripts/update-youtube-cache.js
```

### Configuration
Update the YouTube Channel ID in these files:
- `.github/workflows/youtube-cache.yml`
- `scripts/update-youtube-cache.js`
- `src/services/youtube.ts`

```javascript
const YOUTUBE_CHANNEL_ID = 'UCPuYa6IFOW3zcVxH1bRXa8g'; // @sacramentoshia6230
```

## Error Handling

### Cache Error States
- **Network Failure**: Shows error message with YouTube link
- **API Failure**: Falls back to direct RSS2JSON call
- **No Videos**: Shows appropriate message

### Error Message
```
"Videos are currently unavailable. The SSMA tech team is working on 
resolving the issue. Please check back later or visit our YouTube 
channel directly."
```

## How It Works

### 1. Cache Loading
1. Website attempts to load from `/sacramento110/youtube-cache.json`
2. If successful and status is "success", displays cached videos
3. If cache has error status, shows error message
4. If cache fails to load, tries direct RSS2JSON call

### 2. Fallback Process
1. Direct call to RSS2JSON API
2. Process and format video data
3. Display videos or show error message

### 3. Auto-Update Process
1. GitHub Actions cron job triggers every 3 hours
2. Fetches latest videos from RSS2JSON
3. Updates cache file in repository
4. Commits and pushes changes
5. Website automatically uses updated cache

## Video Modal Features

### Auto-Play Modal
- **Trigger**: Click on any video thumbnail
- **Behavior**: Video starts playing automatically
- **Controls**: YouTube player controls available
- **Close Options**: 
  - Click X button (top-right)
  - Click outside modal
  - Press Escape key

### Modal Configuration
```javascript
const playerOpts = {
  autoplay: 1,        // Auto-play when opened
  modestbranding: 1,  // Minimal YouTube branding
  rel: 0,             // Don't show related videos
  controls: 1,        // Show player controls
};
```

## Troubleshooting

### Cache Not Updating
1. Check GitHub Actions workflow status
2. Verify YouTube Channel ID is correct
3. Check RSS2JSON API status
4. Manually trigger workflow: Repository → Actions → "Update YouTube Videos Cache" → "Run workflow"

### Videos Not Loading
1. Check browser console for errors
2. Verify cache file exists: `/sacramento110/youtube-cache.json`
3. Check network requests in browser dev tools
4. Try manual cache update: `npm run update-youtube`

### Modal Not Working
1. Ensure `react-youtube` package is installed
2. Check for JavaScript errors in console
3. Verify video IDs are valid YouTube IDs
4. Test with a known working YouTube video ID

## Deployment Notes

### GitHub Pages Setup
1. Cache file is stored in `/public/` directory
2. GitHub Actions has write permissions to repository
3. Workflow commits cache updates automatically
4. No additional server configuration needed

### First Deployment
1. Update YouTube Channel ID in all configuration files
2. Run manual cache update: `npm run update-youtube`
3. Commit and push changes
4. Deploy to GitHub Pages
5. Verify automatic updates are working

## Performance Benefits

- **Fast Loading**: Cache eliminates API calls on every page load
- **Reliability**: Fallback ensures videos always load when possible
- **Bandwidth**: Reduces external API dependencies
- **User Experience**: Consistent loading times and error handling
