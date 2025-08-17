export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  videoId: string;
  channelTitle: string;
  duration?: string;
  viewCount?: string;
}

export interface YouTubeChannel {
  channelId: string;
  channelTitle: string;
  channelUrl: string;
  videos: YouTubeVideo[];
}

export interface VideoModalProps {
  isOpen: boolean;
  videoId: string;
  onClose: () => void;
}
