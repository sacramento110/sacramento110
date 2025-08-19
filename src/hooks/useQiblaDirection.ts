import {
  needsCalibration,
  requestOrientationPermission,
  supportsDeviceOrientation,
  supportsGeolocation,
} from '@/utils/deviceDetection';
import {
  calculateDistanceToKaaba,
  calculateQiblaDirection,
  formatDistance,
  getCardinalDirection,
} from '@/utils/qiblaCalculations';
import { useCallback, useEffect, useState } from 'react';

export interface QiblaData {
  qiblaDirection: number; // Bearing to Qibla in degrees
  currentHeading: number; // Current device heading in degrees
  relativeQiblaDirection: number; // Relative direction to Qibla from current heading
  distance: number; // Distance to Kaaba in km
  formattedDistance: string; // Formatted distance string
  cardinalDirection: string; // Cardinal direction (N, NE, etc.)
  isAligned: boolean; // If device is pointing toward Qibla (within tolerance)
}

export interface QiblaHookReturn {
  qiblaData: QiblaData | null;
  loading: boolean;
  error: string | null;
  hasLocationPermission: boolean;
  hasOrientationPermission: boolean;
  requestLocationPermission: () => Promise<void>;
  requestOrientationPermissionHandler: () => Promise<void>;
  isSupported: boolean;
  calibrationRecommended: boolean;
  dismissCalibrationWarning: () => void;
}

const QIBLA_TOLERANCE = 5; // Degrees tolerance for "aligned" state (more precise)
const SMOOTHING_FACTOR = 0.7; // For heading smoothing (0 = no smoothing, 1 = max smoothing)
const UPDATE_THROTTLE = 50; // Update every 50ms for smooth animation
const MIN_COMPASS_ACCURACY = 15; // Minimum accuracy threshold in degrees

// Type for extended DeviceOrientationEvent
interface ExtendedDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
  webkitCompassAccuracy?: number;
  accuracy?: number;
}

export const useQiblaDirection = (): QiblaHookReturn => {
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [hasOrientationPermission, setHasOrientationPermission] =
    useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [currentHeading, setCurrentHeading] = useState<number>(0);
  const [, setHeadingReadings] = useState<number[]>([]);
  const [calibrationRecommended, setCalibrationRecommended] = useState(false);
  const [, setCompassAccuracy] = useState<number | null>(null);
  const [lastOrientationUpdate, setLastOrientationUpdate] = useState(0);

  // Check if the device supports required features
  const isSupported = supportsGeolocation() && supportsDeviceOrientation();

  // Smooth heading changes to reduce jitter
  const smoothHeading = useCallback(
    (newHeading: number, oldHeading: number): number => {
      // Handle the 360/0 degree boundary
      let diff = newHeading - oldHeading;
      if (diff > 180) {
        diff -= 360;
      } else if (diff < -180) {
        diff += 360;
      }

      // Apply smoothing
      const smoothedDiff = diff * (1 - SMOOTHING_FACTOR);
      let result = oldHeading + smoothedDiff;

      // Normalize to 0-360
      result = ((result % 360) + 360) % 360;

      return result;
    },
    []
  );

  // Request location permission and get user location
  const requestLocationPermission = useCallback(async () => {
    if (!supportsGeolocation()) {
      setError('Geolocation is not supported on this device');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          });
        }
      );

      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setHasLocationPermission(true);
    } catch (err) {
      const error = err as GeolocationPositionError;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError(
            'Location permission denied. Please enable location access to use Qibla finder.'
          );
          break;
        case error.POSITION_UNAVAILABLE:
          setError('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          setError('Location request timed out. Please try again.');
          break;
        default:
          setError('An error occurred while retrieving location.');
          break;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Request orientation permission
  const requestOrientationPermissionHandler = useCallback(async () => {
    try {
      const granted = await requestOrientationPermission();
      setHasOrientationPermission(granted);

      if (!granted) {
        setError(
          'Device orientation permission denied. Please enable to use compass features.'
        );
      }
    } catch (err) {
      setError('Failed to request orientation permission.');
    }
  }, []);

  // Handle device orientation changes with enhanced accuracy
  useEffect(() => {
    if (!hasOrientationPermission || !supportsDeviceOrientation()) {
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const now = Date.now();
      if (now - lastOrientationUpdate < UPDATE_THROTTLE) return;

      setLastOrientationUpdate(now);

      if (event.alpha !== null) {
        let heading = event.alpha;
        let accuracy: number | null = null;

        // Handle different browser implementations and device types
        const eventWithCompass = event as ExtendedDeviceOrientationEvent;

        if (eventWithCompass.webkitCompassHeading !== undefined) {
          // iOS Safari provides webkitCompassHeading which is more accurate
          heading = eventWithCompass.webkitCompassHeading;
          accuracy = eventWithCompass.webkitCompassAccuracy ?? null;
        } else if (event.alpha !== null) {
          // Standard implementation for Android and other devices
          heading = event.alpha;

          // For Android devices, we might need to invert the alpha value
          // depending on browser implementation
          const userAgent = navigator.userAgent.toLowerCase();
          if (userAgent.includes('android')) {
            // Some Android browsers need alpha inversion for proper compass behavior
            if (!eventWithCompass.absolute) {
              heading = 360 - heading;
            }
          }

          // Try to get accuracy from Android-specific properties
          if (eventWithCompass.absolute && eventWithCompass.accuracy) {
            accuracy = eventWithCompass.accuracy;
          }
        }

        // Normalize to 0-360 degrees
        heading = ((heading % 360) + 360) % 360;

        // Store compass accuracy if available
        if (accuracy !== null) {
          setCompassAccuracy(accuracy);
        }

        // Apply smoothing for more stable readings
        const smoothedHeading = smoothHeading(heading, currentHeading);
        setCurrentHeading(smoothedHeading);

        // Track readings for calibration detection
        setHeadingReadings(prev => {
          const newReadings = [...prev, smoothedHeading].slice(-20); // Keep last 20 readings

          // Check if calibration is needed based on accuracy and stability
          if (newReadings.length >= 15 && !calibrationRecommended) {
            const needsCalib =
              needsCalibration(newReadings) ||
              (accuracy !== null && Math.abs(accuracy) > MIN_COMPASS_ACCURACY);
            if (needsCalib) {
              setCalibrationRecommended(true);
            }
          }

          return newReadings;
        });
      }
    };

    // Use higher frequency updates for better responsiveness
    window.addEventListener('deviceorientation', handleOrientation, {
      passive: true,
    });

    // Also try deviceorientationabsolute for some Android devices
    window.addEventListener(
      'deviceorientationabsolute' as keyof WindowEventMap,
      handleOrientation as EventListener,
      { passive: true }
    );

    // Also listen for deviceorientationabsolute for better accuracy on some devices
    const handleAbsoluteOrientation = (event: DeviceOrientationEvent) => {
      const now = Date.now();
      if (now - lastOrientationUpdate < UPDATE_THROTTLE) return;
      setLastOrientationUpdate(now);

      const eventWithCompass = event as ExtendedDeviceOrientationEvent;
      if (event.alpha !== null && eventWithCompass.absolute) {
        let heading = event.alpha;

        // Absolute orientation is usually more accurate and doesn't need inversion
        heading = ((heading % 360) + 360) % 360;

        // Apply smoothing for absolute orientation too
        const smoothedHeading = smoothHeading(heading, currentHeading);
        setCurrentHeading(smoothedHeading);

        // Set high accuracy for absolute orientation
        setCompassAccuracy(5); // Assume good accuracy for absolute readings
      }
    };

    // Try to use absolute orientation if available (more accurate)
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener(
        'deviceorientationabsolute' as keyof WindowEventMap,
        handleAbsoluteOrientation as EventListener,
        { passive: true }
      );
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener(
        'deviceorientationabsolute' as keyof WindowEventMap,
        handleOrientation as EventListener
      );
      if ('ondeviceorientationabsolute' in window) {
        window.removeEventListener(
          'deviceorientationabsolute' as keyof WindowEventMap,
          handleAbsoluteOrientation as EventListener
        );
      }
    };
  }, [
    hasOrientationPermission,
    smoothHeading,
    currentHeading,
    lastOrientationUpdate,
    calibrationRecommended,
  ]);

  // Calculate Qibla data when location or heading changes
  useEffect(() => {
    if (!userLocation) return;

    try {
      const qiblaDirection = calculateQiblaDirection(
        userLocation.latitude,
        userLocation.longitude
      );

      const distance = calculateDistanceToKaaba(
        userLocation.latitude,
        userLocation.longitude
      );

      // Calculate relative direction from current heading
      let relativeDirection = qiblaDirection - currentHeading;
      if (relativeDirection < 0) relativeDirection += 360;
      if (relativeDirection > 360) relativeDirection -= 360;

      // Check if aligned (within tolerance)
      const isAligned =
        Math.abs(relativeDirection) <= QIBLA_TOLERANCE ||
        Math.abs(relativeDirection - 360) <= QIBLA_TOLERANCE;

      setQiblaData({
        qiblaDirection,
        currentHeading,
        relativeQiblaDirection: relativeDirection,
        distance,
        formattedDistance: formatDistance(distance),
        cardinalDirection: getCardinalDirection(qiblaDirection),
        isAligned,
      });

      setError(null);
    } catch (err) {
      setError('Failed to calculate Qibla direction');
    }
  }, [userLocation, currentHeading]);

  // Initial setup
  useEffect(() => {
    if (!isSupported) {
      setError(
        'Your device does not support the required features for Qibla direction'
      );
      setLoading(false);
      return;
    }

    // Don't auto-request permissions on mount
    // Let the component decide when to request permissions
    setLoading(false);
  }, [isSupported]);

  const dismissCalibrationWarning = useCallback(() => {
    setCalibrationRecommended(false);
  }, []);

  return {
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
  };
};
