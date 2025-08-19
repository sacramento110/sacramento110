import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useQiblaDirection } from '@/hooks/useQiblaDirection';
import { isMobileDevice } from '@/utils/deviceDetection';
import {
  AlertTriangle,
  Compass,
  MapPin,
  Navigation,
  RefreshCw,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface QiblaCompassProps {
  className?: string;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({
  className = '',
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showAlignmentPopup, setShowAlignmentPopup] = useState(false);
  const [prevAligned, setPrevAligned] = useState(false);
  const {
    qiblaData,
    loading,
    error,
    hasLocationPermission,
    hasOrientationPermission,
    requestLocationPermission,
    requestOrientationPermissionHandler,
    isSupported,
    calibrationRecommended,
    dismissCalibrationWarning,
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

  // Auto-request permissions when component mounts
  useEffect(() => {
    if (isSupported && !hasInitialized) {
      setHasInitialized(true);
      requestLocationPermission();
      requestOrientationPermissionHandler();
    }
  }, [
    isSupported,
    hasInitialized,
    requestLocationPermission,
    requestOrientationPermissionHandler,
  ]);

  // Handle alignment popup
  useEffect(() => {
    if (qiblaData?.isAligned && !prevAligned) {
      // User just aligned with Qibla
      setShowAlignmentPopup(true);
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setShowAlignmentPopup(false);
      }, 3000);
    }
    setPrevAligned(qiblaData?.isAligned || false);
  }, [qiblaData?.isAligned, prevAligned]);
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
        {/* Calibration Warning */}
        {calibrationRecommended && (
          <div className="mb-4 p-3 bg-orange-100 border border-orange-200 rounded-lg relative">
            <button
              onClick={dismissCalibrationWarning}
              className="absolute top-2 right-2 text-orange-600 hover:text-orange-800"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-orange-800 font-medium text-sm">
                  Calibration Recommended
                </p>
                <p className="text-orange-700 text-xs mt-1">
                  For better accuracy, calibrate your compass by moving your
                  phone in a figure-8 pattern.
                </p>
              </div>
            </div>
          </div>
        )}
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
          {/* Outer circle with fixed markings */}
          <div className="absolute inset-0 rounded-full border-4 border-islamic-green-300">
            {/* Fixed North marker at top */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <span className="text-xs font-semibold text-red-600 bg-white px-1 rounded">
                N
              </span>
            </div>
          </div>

          {/* Rotating compass face that moves with device orientation */}
          <div
            className="absolute inset-2 rounded-full bg-white shadow-inner transition-transform duration-200 ease-out"
            style={{
              transform: `rotate(${-qiblaData.currentHeading}deg)`,
            }}
          >
            {/* Compass rose markings that rotate with device */}
            <div className="absolute inset-0">
              {/* Cardinal direction markers */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                <span className="text-xs font-semibold text-gray-700">N</span>
              </div>
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2">
                <span className="text-xs font-semibold text-gray-700">E</span>
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
                <span className="text-xs font-semibold text-gray-700">S</span>
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2">
                <span className="text-xs font-semibold text-gray-700">W</span>
              </div>
            </div>

            {/* Fixed Qibla direction indicator (always points to actual Qibla direction) */}
            <div
              className="absolute w-1 bg-islamic-green-600 transform -translate-x-1/2 transition-colors duration-300"
              style={{
                height: '40%',
                left: '50%',
                top: '10%',
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${qiblaData.qiblaDirection}deg)`,
              }}
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                <div
                  className={`w-4 h-4 rounded-full shadow-lg border-2 border-white transition-colors duration-300 ${
                    qiblaData.isAligned
                      ? 'bg-green-500 animate-pulse'
                      : 'bg-islamic-green-600'
                  }`}
                ></div>
                {/* Arrow tip pointing to Kaaba */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent transition-colors duration-300 ${
                      qiblaData.isAligned
                        ? 'border-b-green-500'
                        : 'border-b-islamic-green-600'
                    }`}
                  ></div>
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

          {/* Red needle that shows user direction (fixed to compass container, not rotating face) */}
          <div
            className="absolute top-2 left-1/2 transform -translate-x-1/2 transition-transform duration-200 ease-out z-10"
            style={{
              transform: `translateX(-50%) rotate(0deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            <div className="w-1 h-16 bg-red-500 rounded-full shadow-lg relative">
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-3 bg-red-600 rounded-full border border-white"></div>
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              </div>
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
              <div className="flex items-center justify-center mt-1">
                <div
                  className={`w-2 h-2 rounded-full mr-1 transition-colors duration-300 ${
                    calibrationRecommended ? 'bg-orange-400' : 'bg-green-500'
                  }`}
                ></div>
                <span className="text-xs text-gray-500">
                  {calibrationRecommended ? 'Calibrate' : 'Live'}
                </span>
              </div>
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
          <div className="p-3 bg-white rounded-lg border-l-4 border-islamic-green-500">
            <p className="text-xs text-gray-700 text-center font-medium mb-1">
              🧭 How to use this compass:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>
                • 🔴 <strong>Red needle:</strong> Always points North (fixed
                reference)
              </li>
              <li>
                • 🟢 <strong>Green arrow:</strong> Always points toward Kaaba
              </li>
              <li>
                • 🕋 <strong>Compass face:</strong> Rotates as you turn your
                phone
              </li>
              <li>
                • 📱 <strong>Hold flat and rotate</strong> until green arrow
                aligns with red needle (both pointing North)
              </li>
            </ul>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 text-center">
              💡 <strong>Calibration Tip:</strong> Move your phone in a figure-8
              pattern for better accuracy
            </p>
          </div>
        </div>
        {/* Alignment Success Popup */}
        {showAlignmentPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm mx-4 text-center transform animate-bounce">
              <div className="text-6xl mb-4">🕋</div>
              <h3 className="text-xl font-bold text-islamic-green-600 mb-2">
                Perfect Alignment!
              </h3>
              <p className="text-gray-700 mb-4">
                You are now facing the Kaaba direction
              </p>
              <div className="text-2xl">🙏</div>
              <p className="text-sm text-gray-500 mt-2">Ready for prayer</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
