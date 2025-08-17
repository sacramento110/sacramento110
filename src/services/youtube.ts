import axios from 'axios';
import { YouTubeVideo } from '@/types/youtube';
import { YOUTUBE_CONFIG } from '@/utils/constants';

const CACHE_URL = '/sacramento110/youtube-cache.json';
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';
const YOUTUBE_CHANNEL_RSS = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCPuYa6IFOW3zcVxH1bRXa8g';

interface CacheData {
  videos: YouTubeVideo[];
  lastUpdated: string;
  status: 'success' | 'error';
  error?: string;
}

export const fetchYouTubeVideos = async (): Promise<{ videos: YouTubeVideo[]; error?: string }> => {
  try {
    // First, try to fetch from cache
    console.log('Fetching videos from cache...');
    const cacheResponse = await axios.get(CACHE_URL, {
      timeout: 5000,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    const cacheData: CacheData = cacheResponse.data;
    
    if (cacheData.status === 'success' && cacheData.videos.length > 0) {
      console.log(`Successfully loaded ${cacheData.videos.length} videos from cache`);
      console.log(`Cache last updated: ${cacheData.lastUpdated}`);
      return { videos: cacheData.videos };
    } else if (cacheData.status === 'error') {
      console.warn('Cache contains error status:', cacheData.error);
      return { 
        videos: [], 
        error: 'Videos are currently unavailable. The SSMA tech team is working on resolving the issue. Please check back later or visit our YouTube channel directly.' 
      };
    }
    
    throw new Error('Cache data invalid');
    
  } catch (cacheError) {
    console.warn('Cache fetch failed, trying direct RSS2JSON:', cacheError);
    
    // Fallback to direct RSS2JSON call
    try {
      const response = await axios.get(RSS2JSON_API, {
        params: {
          rss_url: YOUTUBE_CHANNEL_RSS,
          count: 10
        },
        timeout: 8000
      });
      
      if (response.data.status === 'ok') {
        const videos = response.data.items.map((item: any) => {
          const videoId = extractVideoId(item.link);
          const extractedThumbnail = extractThumbnailFromDescription(item.description);
          
          return {
            id: item.guid,
            title: item.title,
            description: item.description || item.content || '',
            thumbnail: extractedThumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/${YOUTUBE_CONFIG.defaultThumbnailQuality}.jpg` : YOUTUBE_CONFIG.placeholderThumbnail),
            publishedAt: item.pubDate,
            videoId: videoId,
            channelTitle: response.data.feed.title,
            duration: '',
            viewCount: ''
          };
        });
        
        console.log(`Fallback: Successfully fetched ${videos.length} videos from RSS2JSON`);
        return { videos };
      }
      
      throw new Error('RSS2JSON API returned error status');
      
    } catch (directError) {
      console.error('Direct RSS2JSON fetch also failed:', directError);
      
      // Return error message
      return { 
        videos: [], 
        error: 'Videos are currently unavailable. The SSMA tech team is working on resolving the issue. Please check back later or visit our YouTube channel directly.' 
      };
    }
  }
};

const extractVideoId = (youtubeUrl: string): string => {
  const match = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : '';
};

const extractThumbnailFromDescription = (description: string): string => {
  // Try to extract thumbnail from description HTML
  const match = description?.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : '';
};

// Mock data for development/fallback


export const getVideoThumbnail = (videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string => {
  if (!videoId || videoId.trim() === '') {
    return YOUTUBE_CONFIG.placeholderThumbnail; // Return placeholder for invalid video IDs
  }
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
};
