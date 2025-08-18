import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { VideoModal } from '@/components/ui/VideoModal';
import { useModal } from '@/hooks/useModal';
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos';
import { SSMA_INFO } from '@/utils/constants';
import { Calendar, ExternalLink, Play, Youtube } from 'lucide-react';
import React from 'react';

export const YouTubeSection: React.FC = () => {
  const { videos, loading, error } = useYouTubeVideos();
  const { isOpen, data: selectedVideoId, openModal, closeModal } = useModal();

  const handleVideoClick = (videoId: string) => {
    openModal(videoId);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section id="videos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Youtube className="w-8 h-8 text-red-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Latest Videos
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-3 md:mb-6">
            Watch our latest lectures, events, and community activities
          </p>
          <Button
            onClick={() => window.open(SSMA_INFO.youtube, '_blank')}
            variant="secondary"
            icon={ExternalLink}
          >
            Visit Our Channel
          </Button>
        </div>

        {loading && (
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading videos...</p>
          </div>
        )}

        {error && (
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <Youtube className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Videos Temporarily Unavailable
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && videos.length > 0 && (
          <>
            {/* Mobile Scroll Hint */}
            <div className="mb-2 xs:mb-4 text-center md:hidden">
              <p className="text-sm text-gray-500">
                Swipe horizontally to see more videos
              </p>
            </div>

            {/* Videos Horizontal Scroll */}
            <div className="scroll-container mobile-scroll">
              {videos.map(video => (
                <Card
                  key={video.id}
                  className="flex-shrink-0 w-72 xs:w-80 hover:shadow-xl cursor-pointer group transition-all duration-300 touch-friendly"
                  onClick={() => handleVideoClick(video.videoId)}
                  hover
                >
                  {/* Video Thumbnail */}
                  <div className="relative bg-gray-200 rounded-t-lg overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-40 xs:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-12 h-12 xs:w-16 xs:h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 touch-friendly">
                        <Play
                          className="w-6 h-6 xs:w-8 xs:h-8 text-white ml-1"
                          fill="white"
                        />
                      </div>
                    </div>

                    {/* YouTube Logo Badge */}
                    <div className="absolute top-2 xs:top-3 right-2 xs:right-3 bg-red-600 text-white px-1.5 xs:px-2 py-0.5 xs:py-1 rounded text-xs font-semibold">
                      ▶ YOUTUBE
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-3 xs:p-4">
                    <h3 className="font-semibold text-base xs:text-lg mb-2 xs:mb-3 line-clamp-2 text-gray-800 group-hover:text-islamic-green-600 transition-colors leading-tight">
                      {video.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs xs:text-sm text-gray-500 mb-2 xs:mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
                        {formatDate(video.publishedAt)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                      {video.channelTitle}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* No Videos Fallback */}
        {!loading && !error && videos.length === 0 && (
          <div className="text-center">
            <Youtube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              No videos available at the moment
            </p>
            <Button
              onClick={() => window.open(SSMA_INFO.youtube, '_blank')}
              variant="outline"
              icon={ExternalLink}
            >
              Visit Our YouTube Channel
            </Button>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isOpen}
        videoId={selectedVideoId || ''}
        onClose={closeModal}
      />
    </section>
  );
};
