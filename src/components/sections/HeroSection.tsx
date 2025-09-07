import { Button } from '@/components/ui/Button';
import { LiveStreamIndicator } from '@/components/ui/LiveStreamIndicator';
import { VideoModal } from '@/components/ui/VideoModal';
import { useModal } from '@/hooks/useModal';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useRealTimeCountdown } from '@/hooks/useRealTimeCountdown';
import { useLiveStream } from '@/hooks/useLiveStream';
import { SSMA_INFO, getImagePath } from '@/utils/constants';
import { scrollToSection } from '@/utils/scrollUtils';
import { ChevronDown, Clock } from 'lucide-react';
import React from 'react';

export const HeroSection: React.FC = () => {
  const { nextPrayer } = usePrayerTimes();
  const countdown = useRealTimeCountdown(nextPrayer?.time || null);
  const {
    liveStream,
    loading: liveLoading,
    error: liveError,
  } = useLiveStream();
  const { isOpen, data: selectedVideoId, openModal, closeModal } = useModal();

  const scrollToNextSection = () => {
    scrollToSection('prayer-times');
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${getImagePath('images/imam-hussain-shrine.jpg')}')`,
      }}
    >
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-10"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 xs:px-6 max-w-4xl mx-auto">
        {/* Main Logo/Icon */}
        <div className="mb-6 xs:mb-8">
          <div className="w-20 h-20 xs:w-24 xs:h-24 bg-islamic-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-white font-bold text-base xs:text-lg">
              SSMA
            </span>
          </div>
        </div>

        {/* Live Stream Indicator */}
        <div className="mb-4 xs:mb-6">
          <LiveStreamIndicator
            liveStream={liveStream}
            loading={liveLoading}
            error={liveError}
            onWatchLive={openModal}
          />
        </div>

        {/* Next Prayer Panel */}
        {nextPrayer && countdown && (
          <div className="mb-6 xs:mb-8">
            <div className="bg-white/95 backdrop-blur-sm border border-islamic-green-200 rounded-full px-4 xs:px-6 py-2 xs:py-3 mx-auto inline-flex items-center space-x-2 shadow-lg">
              <Clock className="w-4 h-4 text-islamic-green-600" />
              <span className="text-sm xs:text-base font-medium text-islamic-green-700 font-mono">
                Next: {nextPrayer.name} in {countdown}
              </span>
            </div>
          </div>
        )}

        {/* Main Title */}
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 xs:mb-6 hero-text-shadow animate-fade-in leading-tight">
          <span className="block text-white">{SSMA_INFO.name}</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg xs:text-xl md:text-2xl mb-8 xs:mb-10 text-gray-200 max-w-3xl mx-auto hero-text-shadow animate-slide-up leading-relaxed">
          {SSMA_INFO.tagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center items-center mb-8 xs:mb-12">
          <Button
            onClick={() => scrollToSection('prayer-times')}
            size="lg"
            className="bg-islamic-green-600 hover:bg-islamic-green-700 text-white shadow-lg w-full xs:w-auto min-h-[48px] touch-friendly"
          >
            View Prayer Times
          </Button>
          <Button
            onClick={() => scrollToSection('videos')}
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-islamic-green-600 shadow-lg w-full xs:w-auto min-h-[48px] touch-friendly"
          >
            Watch Videos
          </Button>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToNextSection}
          className="animate-bounce text-white hover:text-islamic-gold-400 transition-colors touch-friendly"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="w-8 h-8 mx-auto" />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 xs:h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isOpen}
        videoId={typeof selectedVideoId === 'string' ? selectedVideoId : ''}
        onClose={closeModal}
      />
    </section>
  );
};
