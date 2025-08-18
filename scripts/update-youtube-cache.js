import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const YOUTUBE_CHANNEL_ID = 'UCPuYa6IFOW3zcVxH1bRXa8g'; // @sacramentoshia6230
const RSS_URL = `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

async function updateYouTubeCache() {
  try {
    console.log('🔄 Fetching latest videos from RSS2JSON...');
    console.log(`📡 RSS URL: ${RSS_URL}`);
    
    const response = await axios.get(RSS_URL, {
      timeout: 15000,
      headers: {
        'User-Agent': 'SSMA-Website/1.0'
      }
    });
    
    if (response.data.status !== 'ok') {
      throw new Error(`RSS2JSON API error: ${response.data.message || 'Unknown error'}`);
    }
    
    // Function to test which thumbnail quality is available
    const getBestThumbnail = async (videoId) => {
      const thumbnailQualities = [
        'maxresdefault',
        'hqdefault', 
        'mqdefault',
        'sddefault',
        'default'
      ];
      
      for (const quality of thumbnailQualities) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
        try {
          const response = await axios.head(thumbnailUrl, { timeout: 3000 });
          if (response.status === 200) {
            console.log(`   📸 ${videoId}: Using ${quality} thumbnail`);
            return thumbnailUrl;
          }
        } catch (error) {
          // Continue to next quality
        }
      }
      
      // Final fallback if all fail
      console.log(`   ⚠️  ${videoId}: No thumbnails found, using default`);
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    };

    // Process videos with thumbnail detection
    const videos = [];
    for (const item of response.data.items.slice(0, 10)) {
      // Extract video ID from link
      const videoIdMatch = item.link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : '';
      
      console.log(`🔍 Processing: ${item.title}`);
      const bestThumbnail = await getBestThumbnail(videoId);
      
      videos.push({
        id: item.guid || videoId,
        title: item.title,
        description: item.description || '',
        thumbnail: bestThumbnail,
        publishedAt: item.pubDate,
        videoId: videoId,
        channelTitle: response.data.feed.title || 'Sacramento Shia',
        link: item.link
      });
    }
    
    const cacheData = {
      videos: videos,
      lastUpdated: new Date().toISOString(),
      status: 'success'
    };
    
    // Ensure public directory exists
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write cache file
    const cacheFile = path.join(publicDir, 'youtube-cache.json');
    fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
    
    console.log(`✅ Successfully cached ${videos.length} videos`);
    console.log(`📁 Cache file: ${cacheFile}`);
    console.log(`🕒 Last updated: ${cacheData.lastUpdated}`);
    
    // Display video titles
    videos.forEach((video, index) => {
      console.log(`   ${index + 1}. ${video.title}`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Error fetching videos:', error.message);
    
    // Create error cache
    const errorCache = {
      videos: [],
      lastUpdated: new Date().toISOString(),
      status: 'error',
      error: error.message
    };
    
    // Ensure public directory exists
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const cacheFile = path.join(publicDir, 'youtube-cache.json');
    fs.writeFileSync(cacheFile, JSON.stringify(errorCache, null, 2));
    
    console.log('📝 Created error cache file');
    return false;
  }
}

// Run the function
updateYouTubeCache().then(success => {
  process.exit(success ? 0 : 1);
});
