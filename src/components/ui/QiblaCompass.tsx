import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useQiblaDirection } from '@/hooks/useQiblaDirection';
import { isMobileDevice } from '@/utils/deviceDetection';
import { Compass, MapPin, Navigation, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface QiblaCompassProps {
  className?: string;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({
  className = '',
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const {
    qiblaData,
    loading,
    error,
    hasLocationPermission,
    hasOrientationPermission,
    requestLocationPermission,
    requestOrientationPermissionHandler,
    isSupported,
  } = useQiblaDirection();

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

  // Don't render if not supported
  if (!isSupported) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      >
        <p className="text-red-600 text-sm text-center">
          Qibla compass requires location and orientation sensors
        </p>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div
        className={`bg-islamic-green-50 border border-islamic-green-200 rounded-lg p-6 ${className}`}
      >
        <div className="text-center">
          <LoadingSpinner size="md" />
          <p className="mt-2 text-islamic-green-700 text-sm">
            Setting up Qibla compass...
          </p>
        </div>
      </div>
    );
  }

  // Show error state with retry options
  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      >
        <div className="text-center">
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <div className="flex flex-col gap-2">
            {!hasLocationPermission && (
              <Button
                onClick={requestLocationPermission}
                size="sm"
                variant="outline"
                icon={MapPin}
              >
                Enable Location
              </Button>
            )}
            {!hasOrientationPermission && (
              <Button
                onClick={requestOrientationPermissionHandler}
                size="sm"
                variant="outline"
                icon={Compass}
              >
                Enable Compass
              </Button>
            )}
            <Button
              onClick={() => {
                requestLocationPermission();
                requestOrientationPermissionHandler();
              }}
              size="sm"
              icon={RefreshCw}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show compass when data is available
  if (qiblaData) {
    return (
      <div
        className={`bg-islamic-green-50 border border-islamic-green-200 rounded-lg p-4 ${className}`}
      >
        {/* Beta Notice */}
        <div className="mb-3 p-2 bg-orange-100 border border-orange-200 rounded-lg">
          <p className="text-xs text-orange-700 text-center font-medium">
            🚧 <strong>Beta Version</strong> - This feature is still in testing.
          </p>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Navigation className="w-5 h-5 text-islamic-green-600" />
            <h3 className="text-lg font-semibold text-islamic-green-800">
              Qibla Direction
            </h3>
          </div>
          <p className="text-sm text-islamic-green-600">
            {qiblaData.cardinalDirection} • {qiblaData.formattedDistance} to
            Kaaba
          </p>
        </div>

        {/* Compass Circle */}
        <div className="relative w-48 h-48 mx-auto mb-4">
          {/* Outer circle with markings */}
          <div className="absolute inset-0 rounded-full border-4 border-islamic-green-300">
            {/* Cardinal direction markers */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <span className="text-xs font-semibold text-islamic-green-700">
                N
              </span>
            </div>
            <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2">
              <span className="text-xs font-semibold text-islamic-green-700">
                E
              </span>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
              <span className="text-xs font-semibold text-islamic-green-700">
                S
              </span>
            </div>
            <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
              <span className="text-xs font-semibold text-islamic-green-700">
                W
              </span>
            </div>
          </div>

          {/* Inner compass face */}
          <div className="absolute inset-2 rounded-full bg-white shadow-inner">
            {/* Qibla direction indicator */}
            <div
              className="absolute w-1 bg-islamic-green-600 transform -translate-x-1/2 transition-transform duration-100 ease-out"
              style={{
                height: '40%',
                left: '50%',
                top: '10%',
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${qiblaData.relativeQiblaDirection}deg)`,
              }}
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                <div className="w-4 h-4 bg-islamic-green-600 rounded-full shadow-lg border-2 border-white"></div>
                {/* Arrow tip for better visibility */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-islamic-green-600"></div>
                </div>
              </div>
            </div>

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-islamic-green-600 rounded-full shadow-lg"></div>
            </div>

            {/* Kaaba icon in center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="text-lg">🕋</span>
            </div>
          </div>
        </div>

        {/* Direction Info */}
        <div className="text-center space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-2 rounded-lg">
              <span className="text-islamic-green-600 font-medium block">
                Qibla Direction
              </span>
              <span className="text-lg font-bold text-islamic-green-800">
                {Math.round(qiblaData.qiblaDirection)}°
              </span>
              <span className="text-xs text-gray-500 block">
                {qiblaData.cardinalDirection}
              </span>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <span className="text-islamic-green-600 font-medium block">
                Your Heading
              </span>
              <span className="text-lg font-bold text-islamic-green-800">
                {Math.round(qiblaData.currentHeading)}°
              </span>
              <span className="text-xs text-gray-500 block">Live compass</span>
            </div>
          </div>

          {/* Alignment indicator */}
          <div
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              qiblaData.isAligned
                ? 'bg-green-100 text-green-800 border-2 border-green-200 shadow-lg'
                : 'bg-orange-100 text-orange-700 border-2 border-orange-200'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                qiblaData.isAligned
                  ? 'bg-green-500 animate-pulse'
                  : 'bg-orange-400'
              }`}
            ></div>
            <span>
              {qiblaData.isAligned
                ? '✅ Perfect Alignment!'
                : '🧭 Keep turning...'}
            </span>
            <span className="text-xs opacity-75">
              {qiblaData.isAligned
                ? 'Ready to pray'
                : `${Math.abs(Math.round(qiblaData.relativeQiblaDirection))}° off`}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 space-y-2">
          <div className="p-3 bg-white rounded-lg">
            <p className="text-xs text-gray-600 text-center font-medium">
              📱 Hold phone flat and rotate until green arrow points to Kaaba
            </p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 text-center">
              💡 <strong>Tip:</strong> For better accuracy, calibrate your
              compass by moving your phone in a figure-8 pattern
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
