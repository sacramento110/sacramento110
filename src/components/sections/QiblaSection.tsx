import { Button } from '@/components/ui/Button';
import { QiblaCompass } from '@/components/ui/QiblaCompass';
import { isMobileDevice } from '@/utils/deviceDetection';
import { scrollToSection } from '@/utils/scrollUtils';
import { ChevronDown, ChevronUp, Navigation } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface QiblaSectionProps {
  className?: string;
}

export const QiblaSection: React.FC<QiblaSectionProps> = ({
  className = '',
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldInitializeQibla, setShouldInitializeQibla] = useState(false);

  // Check if device is mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Don't render on non-mobile devices
  if (!isMobile) {
    return null;
  }

  const toggleExpansion = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);

    // Only initialize Qibla when user expands the section for the first time
    if (newExpandedState && !shouldInitializeQibla) {
      setShouldInitializeQibla(true);
    }

    // If expanding, scroll to the Qibla section after a short delay to allow expansion
    if (newExpandedState) {
      setTimeout(() => {
        scrollToSection('qibla-finder');
      }, 100);
    }
  };

  return (
    <div
      id="qibla-finder"
      className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
    >
      {/* Collapsible Header */}
      <Button
        onClick={toggleExpansion}
        variant="ghost"
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-islamic-green-100 rounded-full flex items-center justify-center">
            <Navigation className="w-5 h-5 text-islamic-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Qibla Direction Finder
            </h3>
            <p className="text-sm text-gray-500">
              Find accurate prayer direction with compass
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </Button>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'max-h-[1000px] opacity-100 pb-8 overflow-visible'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4">
          <div className="border-t border-gray-100 pt-4">
            {/* Beta Notice */}
            <div className="mb-3 p-2 bg-orange-100 border border-orange-200 rounded-lg">
              <p className="text-xs text-orange-700 text-center">
                🚧 <strong>Beta</strong> - Compass issues? Email{' '}
                <a
                  href="mailto:ssmatechshias@gmail.com?subject=Qibla Compass Issue&body=Please describe the compass issue you encountered:"
                  className="underline hover:text-orange-800"
                >
                  ssmatechshias@gmail.com
                </a>
              </p>
            </div>

            {/* Qibla Compass Component */}
            {shouldInitializeQibla ? (
              <QiblaCompass className="w-full" />
            ) : (
              <div className="w-full p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Qibla Compass Ready</p>
                <p className="text-sm text-gray-500 mt-1">
                  The compass will initialize when you first expand this section
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
