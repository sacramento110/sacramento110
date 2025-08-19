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
  if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
    try {
      const permission = await (
        DeviceOrientationEvent as any
      ).requestPermission();
      return permission === 'granted';
    } catch (error) {
      // Silently fail if permission request fails
      return false;
    }
  }

  // For other devices, assume permission is granted if the API exists
  return supportsDeviceOrientation();
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
