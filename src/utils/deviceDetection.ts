/**
 * Utility functions for detecting device type and capabilities
 */

/**
 * Check if the current device is a mobile device
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check user agent for mobile devices
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(navigator.userAgent);

  // Check for touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Check screen size (mobile typically < 768px width)
  const isSmallScreen = window.innerWidth < 768;

  return isMobileUA || (hasTouch && isSmallScreen);
};

/**
 * Check if the device supports orientation sensors
 */
export const supportsDeviceOrientation = (): boolean => {
  if (typeof window === 'undefined') return false;

  return 'DeviceOrientationEvent' in window;
};

/**
 * Check if the device supports geolocation
 */
export const supportsGeolocation = (): boolean => {
  if (typeof window === 'undefined') return false;

  return 'geolocation' in navigator;
};

/**
 * Request permission for device orientation (iOS 13+)
 */
export const requestOrientationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  // Check if page is served over HTTPS (required for device orientation)
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    return false;
  }

  // Check if DeviceOrientationEvent.requestPermission exists (iOS 13+)
  if (
    typeof (
      DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      }
    ).requestPermission === 'function'
  ) {
    try {
      const permission = await (
        DeviceOrientationEvent as unknown as {
          requestPermission: () => Promise<string>;
        }
      ).requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  // For Android and other devices, test if orientation events actually work
  if (supportsDeviceOrientation()) {
    // Test if we can actually receive orientation events
    return new Promise(resolve => {
      const timeout = setTimeout(() => {
        window.removeEventListener('deviceorientation', testHandler);
        resolve(false);
      }, 2000);

      const testHandler = (event: DeviceOrientationEvent) => {
        if (
          event.alpha !== null ||
          event.beta !== null ||
          event.gamma !== null
        ) {
          window.removeEventListener('deviceorientation', testHandler);
          clearTimeout(timeout);
          resolve(true);
        }
      };

      window.addEventListener('deviceorientation', testHandler, {
        passive: true,
      });
    });
  }

  return false;
};

/**
 * Check if device is iOS
 */
export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Check if device is Android
 */
export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
};

/**
 * Get iOS version number
 */
export const getIOSVersion = (): number | null => {
  if (!isIOS()) return null;

  const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
};

/**
 * Check if device requires device orientation permission (iOS 13+)
 */
export const requiresOrientationPermission = (): boolean => {
  const iosVersion = getIOSVersion();
  return isIOS() && iosVersion !== null && iosVersion >= 13;
};

/**
 * Get device type string for display
 */
export const getDeviceType = (): string => {
  if (typeof window === 'undefined') return 'Unknown';

  const userAgent = navigator.userAgent;

  if (/iPad/.test(userAgent)) return 'iPad';
  if (/iPhone/.test(userAgent)) return 'iPhone';
  if (/Android/.test(userAgent)) return 'Android';
  if (/BlackBerry/.test(userAgent)) return 'BlackBerry';
  if (/Windows Phone/.test(userAgent)) return 'Windows Phone';

  return 'Mobile Device';
};

/**
 * Check if compass calibration is needed based on heading stability
 */
export const needsCalibration = (headingReadings: number[]): boolean => {
  if (headingReadings.length < 10) return false;

  // Calculate variance in readings
  const avg =
    headingReadings.reduce((a, b) => a + b, 0) / headingReadings.length;
  const variance =
    headingReadings.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) /
    headingReadings.length;

  // If variance is high, calibration might be needed
  return variance > 50;
};
