import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useQiblaDirection } from '@/hooks/useQiblaDirection';
import {
  getDeviceType,
  isAndroid,
  isIOS,
  isMobileDevice,
  requiresOrientationPermission,
} from '@/utils/deviceDetection';
import {
  ChevronDown,
  ChevronUp,
  Compass,
  MapPin,
  Navigation,
  RefreshCw,
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
  const [showInstructions, setShowInstructions] = useState(false);

  // Calculate turn direction and message
  const getTurnDirection = (relativeQiblaDirection: number) => {
    const degrees = Math.abs(Math.round(relativeQiblaDirection));

    // Determine if should turn left or right
    // If relative direction is between 0-180°, turn right (clockwise)
    // If relative direction is between 180-360°, turn left (counter-clockwise)
    const shouldTurnRight =
      relativeQiblaDirection > 0 && relativeQiblaDirection <= 180;
    const direction = shouldTurnRight ? 'right' : 'left';
    const arrow = shouldTurnRight ? '→' : '←';

    // Choose appropriate message based on how far off
    if (degrees <= 5) {
      return { message: '🎯 Almost there!', detail: 'Fine-tune alignment' };
    } else if (degrees <= 15) {
      return {
        message: `${arrow} Turn ${direction} slightly`,
        detail: `${degrees}° to go`,
      };
    } else if (degrees <= 45) {
      return {
        message: `${arrow} Turn ${direction}`,
        detail: `${degrees}° to go`,
      };
    } else if (degrees <= 90) {
      return {
        message: `${arrow} Turn ${direction} more`,
        detail: `${degrees}° to go`,
      };
    } else {
      return {
        message: `${arrow} Keep turning ${direction}`,
        detail: `${degrees}° to go`,
      };
    }
  };

  // Convert degrees to cardinal direction
  const getCardinalDirection = (degrees: number) => {
    const normalizedDegrees = ((degrees % 360) + 360) % 360;

    const directions = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];

    const index = Math.round(normalizedDegrees / 22.5) % 16;
    return directions[index];
  };

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
    const deviceType = getDeviceType();
    const isIOSDevice = isIOS();
    const isAndroidDevice = isAndroid();

    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      >
        <div className="text-center">
          <p className="text-red-600 text-sm mb-2">
            Qibla compass is not supported on this device
          </p>
          <p className="text-red-500 text-xs">
            {isIOSDevice &&
              "iOS device detected: Please ensure you're using Safari browser"}
            {isAndroidDevice &&
              'Android device detected: Please ensure location and sensor permissions are enabled'}
            {!isIOSDevice &&
              !isAndroidDevice &&
              `${deviceType}: This feature requires a mobile device with orientation sensors`}
          </p>
        </div>
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
    const isIOSDevice = isIOS();
    const isAndroidDevice = isAndroid();
    const needsPermission = requiresOrientationPermission();

    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      >
        <div className="text-center">
          <p className="text-red-600 text-sm mb-3">{error}</p>

          {/* Device-specific help text */}
          <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-xs">
              {isIOSDevice && needsPermission && (
                <>
                  <strong>iPhone/iPad:</strong> Tap &quot;Enable Compass&quot;
                  below and allow motion &amp; orientation access in the popup.
                </>
              )}
              {isIOSDevice && !needsPermission && (
                <>
                  <strong>iPhone/iPad:</strong> Make sure you&apos;re using
                  Safari browser for best compatibility.
                </>
              )}
              {isAndroidDevice && (
                <>
                  <strong>Android:</strong> Enable location permission and
                  ensure your device has a magnetometer sensor.
                </>
              )}
            </p>
          </div>

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
              Retry Setup
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
        className={`bg-islamic-green-50 border border-islamic-green-200 rounded-lg p-3 sm:p-4 w-full max-w-sm sm:max-w-md mx-auto overflow-visible ${className}`}
      >
        {/* Header */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Navigation className="w-5 h-5 text-islamic-green-600" />
            <h3 className="text-lg font-semibold text-islamic-green-800">
              Qibla Direction
            </h3>
          </div>
          <p className="text-sm text-islamic-green-600">
            {qiblaData.formattedDistance} to Kaaba
          </p>
        </div>

        {/* Turn Direction Indicator (above compass) */}
        <div className="text-center mb-3">
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
                : getTurnDirection(qiblaData.relativeQiblaDirection).message}
            </span>
            <span className="text-xs opacity-75">
              {qiblaData.isAligned
                ? 'Ready to pray'
                : getTurnDirection(qiblaData.relativeQiblaDirection).detail}
            </span>
          </div>
        </div>
        {/* Compass Circle */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 mx-auto mb-3">
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
              {/* Green arrow pointing to Kaaba */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div
                  className={`w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent transition-colors duration-300 shadow-lg ${
                    qiblaData.isAligned
                      ? 'border-b-green-500 drop-shadow-lg'
                      : 'border-b-islamic-green-600'
                  }`}
                  style={{
                    filter: qiblaData.isAligned
                      ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))'
                      : '',
                  }}
                ></div>
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

          {/* Fixed red arrow pointing up (shows phone direction relative to North) */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-16 bg-red-500 rounded-full shadow-lg relative">
              {/* Red arrow pointing up */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div
                  className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-600 shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                  }}
                ></div>
              </div>
              {/* Red arrow pointing down */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div
                  className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-red-400 shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Direction Info (below compass) - Compact & Responsive */}
        <div className="text-center mb-3">
          <div className="inline-flex flex-wrap justify-center items-center gap-3 sm:gap-4 bg-white px-3 sm:px-4 py-2 rounded-full border border-gray-200 text-sm max-w-full">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-xs text-islamic-green-600 font-medium">
                Qibla:
              </span>
              <span className="font-bold text-islamic-green-800">
                {Math.round(qiblaData.qiblaDirection)}° (
                {qiblaData.cardinalDirection})
              </span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-xs text-islamic-green-600 font-medium">
                You:
              </span>
              <span className="font-bold text-islamic-green-800">
                {Math.round(qiblaData.currentHeading)}° (
                {getCardinalDirection(qiblaData.currentHeading)})
              </span>
              <div
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  calibrationRecommended ? 'bg-orange-400' : 'bg-green-500'
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Collapsible Instructions */}
        <div className="mt-4 space-y-2">
          {/* Instructions Header (Clickable) */}
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full p-3 bg-white rounded-lg border-l-4 border-islamic-green-500 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
          >
            <p className="text-xs text-gray-700 font-medium">
              🧭 How to use this compass
            </p>
            {showInstructions ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {/* Collapsible Instructions Content */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showInstructions ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>
                    • 🔴 <strong>Red arrow:</strong> Fixed, always points North
                  </li>
                  <li>
                    • 🟢 <strong>Green arrow:</strong> Points to Kaaba, rotates
                    with compass
                  </li>
                  <li>
                    • 🕋 <strong>Compass face:</strong> Rotates as you turn your
                    phone
                  </li>
                  <li>
                    • 📱 <strong>Follow the turn directions</strong>
                    (left/right) until you see &quot;Perfect Alignment!&quot;
                  </li>
                </ul>
              </div>

              {/* Compact Info Banner */}
              <div className="p-2 bg-islamic-green-50 rounded-lg border border-islamic-green-200">
                <p className="text-xs text-islamic-green-700 text-center">
                  🧭 <strong>GPS + Compass:</strong> Precise Kaaba direction
                </p>
              </div>
            </div>
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
