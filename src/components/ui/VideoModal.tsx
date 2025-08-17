import React from 'react';
import YouTube from 'react-youtube';
import { Modal } from './Modal';
import { VideoModalProps } from '@/types/youtube';

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, videoId, onClose }) => {
  const playerOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,        // Auto-play when modal opens
      modestbranding: 1,  // Minimal YouTube branding
      rel: 0,             // Don't show related videos from other channels
      showinfo: 0,        // Hide video title and uploader
      controls: 1,        // Show player controls
      cc_load_policy: 0,  // Hide captions by default
      iv_load_policy: 3,  // Hide annotations
      origin: window.location.origin, // Security
    },
  };

  const handleReady = (event: any) => {
    // Ensure video plays when modal opens
    event.target.playVideo();
  };

  const handleEnd = () => {
    // Optional: Auto-close modal when video ends
    // onClose();
  };

  const handleError = (event: any) => {
    console.error('YouTube player error:', event.data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        {isOpen && videoId && (
          <YouTube
            videoId={videoId}
            opts={playerOpts}
            onReady={handleReady}
            onEnd={handleEnd}
            onError={handleError}
            className="w-full h-full"
            iframeClassName="w-full h-full"
          />
        )}
      </div>
    </Modal>
  );
};
