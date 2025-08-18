import {
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
}

const QIBLA_TOLERANCE = 3; // Degrees tolerance for "aligned" state (more precise)
const SMOOTHING_FACTOR = 0.8; // For heading smoothing (0 = no smoothing, 1 = max smoothing)

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
    if (!hasOrientationPermission || !supportsDeviceOrientation()) return;

    let lastUpdateTime = 0;
    const UPDATE_THROTTLE = 50; // Update every 50ms for smooth animation

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const now = Date.now();
      if (now - lastUpdateTime < UPDATE_THROTTLE) return;
      lastUpdateTime = now;

      if (event.alpha !== null) {
        let heading = event.alpha;

        // Handle different browser implementations
        // Some browsers provide compass heading, others provide arbitrary rotation
        if ((event as any).webkitCompassHeading !== undefined) {
          // iOS Safari provides webkitCompassHeading which is more accurate
          heading = (event as any).webkitCompassHeading;
        } else if (event.alpha !== null) {
          // Standard implementation
          heading = 360 - event.alpha; // Invert for proper compass direction
        }

        // Normalize to 0-360 degrees
        heading = ((heading % 360) + 360) % 360;

        // Apply smoothing for more stable readings
        const smoothedHeading = smoothHeading(heading, currentHeading);
        setCurrentHeading(smoothedHeading);
      }
    };

    // Use higher frequency updates for better responsiveness
    window.addEventListener('deviceorientation', handleOrientation, {
      passive: true,
    });

    // Also listen for deviceorientationabsolute for better accuracy on some devices
    const handleAbsoluteOrientation = (event: DeviceOrientationEvent) => {
      const now = Date.now();
      if (now - lastUpdateTime < UPDATE_THROTTLE) return;
      lastUpdateTime = now;

      if (event.alpha !== null) {
        let heading = event.alpha;
        // Absolute orientation is usually more accurate
        heading = ((heading % 360) + 360) % 360;

        // Apply smoothing for absolute orientation too
        const smoothedHeading = smoothHeading(heading, currentHeading);
        setCurrentHeading(smoothedHeading);
      }
    };

    window.addEventListener(
      'deviceorientationabsolute' as any,
      handleAbsoluteOrientation as any,
      { passive: true }
    );

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener(
        'deviceorientationabsolute' as any,
        handleAbsoluteOrientation as any
      );
    };
  }, [hasOrientationPermission, smoothHeading, currentHeading]);

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

    // Auto-request permissions on mount for better UX
    requestLocationPermission();
    requestOrientationPermissionHandler();
  }, [
    isSupported,
    requestLocationPermission,
    requestOrientationPermissionHandler,
  ]);

  return {
    qiblaData,
    loading,
    error,
    hasLocationPermission,
    hasOrientationPermission,
    requestLocationPermission,
    requestOrientationPermissionHandler,
    isSupported,
  };
};
