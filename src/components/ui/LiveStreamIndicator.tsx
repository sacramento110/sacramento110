import React from 'react';
import { LiveStream } from '@/services/liveStream';
import { Play } from 'lucide-react';

interface LiveStreamIndicatorProps {
  liveStream: LiveStream | null;
  loading: boolean;
  error: string | null;
  onWatchLive?: (videoId: string) => void;
}

export const LiveStreamIndicator: React.FC<LiveStreamIndicatorProps> = ({
  liveStream,
  loading,
  error,
  onWatchLive,
}) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            Checking for live stream...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show error state for live stream detection
  }

  if (!liveStream) {
    return null; // No live stream, don't show anything
  }

  return (
    <button
      onClick={() => onWatchLive?.(liveStream.videoId)}
      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full shadow-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 animate-pulse border-2 border-white/30 backdrop-blur-sm"
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg"></div>
          <span className="text-base font-bold tracking-wide">LIVE</span>
        </div>
        <div className="h-6 w-px bg-white/40"></div>
        <span className="text-base font-semibold truncate max-w-xs">
          {liveStream.title}
        </span>
        <Play className="w-5 h-5 ml-2" />
      </div>
    </button>
  );
};
