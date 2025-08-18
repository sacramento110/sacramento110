import { VideoModalProps } from '@/types/youtube';
import { X } from 'lucide-react';
import React from 'react';
import YouTube from 'react-youtube';
import { Modal } from './Modal';

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  videoId,
  onClose,
}) => {
  const playerOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1, // Auto-play when modal opens
      modestbranding: 1, // Minimal YouTube branding
      rel: 0, // Don't show related videos from other channels
      showinfo: 0, // Hide video title and uploader
      controls: 1, // Show player controls
      cc_load_policy: 0, // Hide captions by default
      iv_load_policy: 3, // Hide annotations
      origin: window.location.origin, // Security
    },
  };

  const handleReady = (event: { target: { playVideo: () => void } }) => {
    // Ensure video plays when modal opens
    event.target.playVideo();
  };

  const handleEnd = () => {
    // Optional: Auto-close modal when video ends
    // onClose();
  };

  const handleError = () => {
    // YouTube player error handling - silently ignore errors in production
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      fullscreen={true}
      showCloseButton={false}
    >
      <div className="w-full h-full max-w-none mx-auto px-1 xs:px-2 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center">
        <div className="relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw]">
          {/* Close Button positioned above video */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 xs:-top-4 xs:-right-4 bg-white text-black rounded-full p-2 xs:p-3 shadow-lg hover:bg-gray-100 transition-colors z-30 touch-friendly border-2 border-gray-200"
            aria-label="Close video"
          >
            <X className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Video Container */}
          <div
            className="aspect-video bg-black rounded-lg overflow-hidden w-full h-auto max-h-[85vh] xs:max-h-[90vh] sm:max-h-[92vh] md:max-h-[94vh] lg:max-h-[95vh]"
            onClick={e => e.stopPropagation()}
          >
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
        </div>
      </div>
    </Modal>
  );
};
