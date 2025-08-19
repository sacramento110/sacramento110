import { Button } from '@/components/ui/Button';
import { QiblaCompass } from '@/components/ui/QiblaCompass';
import { isMobileDevice } from '@/utils/deviceDetection';
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
    setIsExpanded(!isExpanded);
  };

  return (
    <div
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
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-islamic-green-100 text-islamic-green-700 px-2 py-1 rounded-full font-medium">
            Mobile Only
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </Button>

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[1000px] opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4">
          <div className="border-t border-gray-100 pt-4">
            {/* Beta Notice */}
            <div className="mb-3 p-2 bg-orange-100 border border-orange-200 rounded-lg">
              <p className="text-xs text-orange-700 text-center font-medium">
                🚧 <strong>Beta Version</strong> - This feature is currently in
                testing.
              </p>
            </div>

            {/* Info Banner */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Navigation className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 font-medium text-sm">
                    Accurate Qibla Direction
                  </p>
                  <p className="text-blue-700 text-xs mt-1">
                    This compass uses your device's GPS and orientation sensors
                    to show the precise direction to the Kaaba in Mecca.
                  </p>
                </div>
              </div>
            </div>

            {/* Qibla Compass Component */}
            <QiblaCompass className="w-full" />

            {/* Additional Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-800 mb-2">
                📱 How to Use:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>
                  • Allow location and orientation permissions when prompted
                </li>
                <li>• Hold your phone flat (parallel to the ground)</li>
                <li>• Rotate until the green arrow points to the Kaaba icon</li>
                <li>• The compass shows live updates as you move</li>
                <li>• Green "Perfect Alignment!" means you're facing Qibla</li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 text-center">
                <strong>Note:</strong> This is a digital compass tool. For
                important prayers, consider verifying with traditional methods
                or consulting your local mosque.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
