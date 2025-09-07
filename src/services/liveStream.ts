import axios from 'axios';

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';
const YOUTUBE_CHANNEL_RSS =
  'https://www.youtube.com/feeds/videos.xml?channel_id=UCPuYa6IFOW3zcVxH1bRXa8g';

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  videoId: string;
  channelTitle: string;
  isLive: boolean;
  liveViewers?: string;
  startTime?: string;
}

/**
 * Detect if YouTube channel has a live stream
 */
export const detectLiveStream = async (): Promise<{
  liveStream: LiveStream | null;
  error?: string;
}> => {
  try {
    const response = await axios.get(RSS2JSON_API, {
      params: {
        rss_url: YOUTUBE_CHANNEL_RSS,
        count: 5, // Check last 5 videos for live streams
      },
      timeout: 8000,
    });

    if (response.data.status === 'ok') {
      const items = response.data.items || [];

      // Look for live stream indicators
      for (const item of items) {
        const title = String(item.title || '');
        const description = String(item.description || '');
        const link = String(item.link || '');

        // Check for live stream indicators
        const isLive = checkIfLiveStream(title, description, link);

        if (isLive) {
          const liveStream: LiveStream = {
            id: String(item.guid || ''),
            title: title,
            description: description,
            thumbnail:
              extractThumbnailFromDescription(description) ||
              `https://img.youtube.com/vi/${extractVideoId(link)}/maxresdefault.jpg`,
            publishedAt: String(item.pubDate || ''),
            videoId: extractVideoId(link),
            channelTitle: String(response.data.feed.title || ''),
            isLive: true,
            liveViewers: extractLiveViewers(description),
            startTime: extractStartTime(description),
          };

          return { liveStream };
        }
      }

      // No live stream found
      return { liveStream: null };
    }

    throw new Error('RSS2JSON API returned error status');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Live stream detection error:', error);
    return {
      liveStream: null,
      error: 'Unable to check for live streams at this time',
    };
  }
};

/**
 * Check if a video is currently live based on title, description, and other indicators
 */
const checkIfLiveStream = (
  title: string,
  description: string,
  _link: string
): boolean => {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();

  // Common live stream indicators
  const liveIndicators = [
    '🔴 live',
    '[live]',
    'live now',
    'streaming now',
    'live stream',
    'going live',
    'live:',
    '🔴',
    'live broadcast',
    'live event',
  ];

  // Check title for live indicators
  for (const indicator of liveIndicators) {
    if (titleLower.includes(indicator)) {
      return true;
    }
  }

  // Check description for live indicators
  for (const indicator of liveIndicators) {
    if (descLower.includes(indicator)) {
      return true;
    }
  }

  // Check if video was published very recently (within last 2 hours) and has live-like content
  const publishedDate = new Date(
    description.match(/Published on (.+?) by/)?.[1] || ''
  );
  const now = new Date();
  const timeDiff = now.getTime() - publishedDate.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  if (
    hoursDiff < 2 &&
    (titleLower.includes('prayer') ||
      titleLower.includes('lecture') ||
      titleLower.includes('event') ||
      titleLower.includes('program'))
  ) {
    return true;
  }

  return false;
};

/**
 * Extract live viewer count from description if available
 */
const extractLiveViewers = (description: string): string | undefined => {
  const viewerMatch = description.match(/(\d+)\s*watching/i);
  return viewerMatch ? `${viewerMatch[1]} watching` : undefined;
};

/**
 * Extract start time from description if available
 */
const extractStartTime = (description: string): string | undefined => {
  const timeMatch = description.match(/Started (\d+:\d+)/i);
  return timeMatch ? timeMatch[1] : undefined;
};

/**
 * Extract video ID from YouTube URL
 */
const extractVideoId = (youtubeUrl: string): string => {
  const match = youtubeUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  );
  return match ? match[1] : '';
};

/**
 * Extract thumbnail from description HTML
 */
const extractThumbnailFromDescription = (description: string): string => {
  const match = description?.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : '';
};
