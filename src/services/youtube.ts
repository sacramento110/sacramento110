import { YouTubeVideo } from '@/types/youtube';
import axios from 'axios';

// Use relative path - will be resolved by getImagePath utility
const CACHE_URL = 'youtube-cache.json';
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';
const YOUTUBE_CHANNEL_RSS =
  'https://www.youtube.com/feeds/videos.xml?channel_id=UCPuYa6IFOW3zcVxH1bRXa8g';

interface CacheData {
  videos: YouTubeVideo[];
  lastUpdated: string;
  status: 'success' | 'error' | 'pending';
  error?: string;
  message?: string;
}

// Utility function to get the correct base path for cache
const getCacheUrl = (): string => {
  // Always use root path for both development and production
  return `/${CACHE_URL}`;
};

export const fetchYouTubeVideos = async (): Promise<{
  videos: YouTubeVideo[];
  error?: string;
}> => {
  try {
    // First, try to fetch from cache
    const cacheResponse = await axios.get(getCacheUrl(), {
      timeout: 5000,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    const cacheData: CacheData = cacheResponse.data;

    if (cacheData.status === 'success' && cacheData.videos.length > 0) {
      return { videos: cacheData.videos };
    } else if (cacheData.status === 'error') {
      return {
        videos: [],
        error:
          'Videos are currently unavailable. The SSMA tech team is working on resolving the issue. Please check back later or visit our YouTube channel directly.',
      };
    } else if (cacheData.status === 'pending') {
      return {
        videos: [],
        error:
          'YouTube videos are being updated. Please check back in a few minutes.',
      };
    }
  } catch (cacheError) {
    // Cache doesn't exist or failed to load, fallback to direct RSS2JSON call
  }

  // If we reach here, either cache failed or cache had no valid videos
  // Try direct RSS2JSON call
  try {
    const response = await axios.get(RSS2JSON_API, {
      params: {
        rss_url: YOUTUBE_CHANNEL_RSS,
        count: 10,
      },
      timeout: 8000,
    });

    if (response.data.status === 'ok') {
      const videos = response.data.items.map(
        (item: Record<string, unknown>) => ({
          id: String(item.guid || ''),
          title: String(item.title || ''),
          description: String(item.description || item.content || ''),
          thumbnail:
            extractThumbnailFromDescription(String(item.description || '')) ||
            `https://img.youtube.com/vi/${extractVideoId(String(item.link || ''))}/hqdefault.jpg`,
          publishedAt: String(item.pubDate || ''),
          videoId: extractVideoId(String(item.link || '')),
          channelTitle: String(response.data.feed.title || ''),
          duration: '',
          viewCount: '',
        })
      );

      return { videos };
    }

    throw new Error('RSS2JSON API returned error status');
  } catch (directError) {
    // Return error message
    return {
      videos: [],
      error:
        'Videos are currently unavailable. The SSMA tech team is working on resolving the issue. Please check back later or visit our YouTube channel directly.',
    };
  }
};

const extractVideoId = (youtubeUrl: string): string => {
  const match = youtubeUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  );
  return match ? match[1] : '';
};

const extractThumbnailFromDescription = (description: string): string => {
  // Try to extract thumbnail from description HTML
  const match = description?.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : '';
};

// Mock data for development/fallback
export const getVideoThumbnail = (
  videoId: string,
  quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'
): string => {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
};
