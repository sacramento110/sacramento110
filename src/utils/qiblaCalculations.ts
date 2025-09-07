// Kaaba coordinates in Mecca, Saudi Arabia
export const KAABA_COORDINATES = {
  latitude: 21.4225,
  longitude: 39.8262,
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Convert radians to degrees
 */
const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

/**
 * Calculate the Qibla direction (bearing) from a given location to the Kaaba
 * Uses the great circle bearing calculation
 */
export const calculateQiblaDirection = (
  userLatitude: number,
  userLongitude: number
): number => {
  const lat1 = toRadians(userLatitude);
  const lat2 = toRadians(KAABA_COORDINATES.latitude);
  const deltaLon = toRadians(KAABA_COORDINATES.longitude - userLongitude);

  const x = Math.sin(deltaLon) * Math.cos(lat2);
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

  let bearing = Math.atan2(x, y);
  bearing = toDegrees(bearing);

  // Normalize to 0-360 degrees
  return (bearing + 360) % 360;
};

/**
 * Calculate the distance from a location to the Kaaba (in kilometers)
 * Uses the Haversine formula
 */
export const calculateDistanceToKaaba = (
  userLatitude: number,
  userLongitude: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const lat1 = toRadians(userLatitude);
  const lat2 = toRadians(KAABA_COORDINATES.latitude);
  const deltaLat = toRadians(KAABA_COORDINATES.latitude - userLatitude);
  const deltaLon = toRadians(KAABA_COORDINATES.longitude - userLongitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Format distance for display in miles
 */
export const formatDistance = (distance: number): string => {
  // Convert kilometers to miles (1 km = 0.621371 miles)
  const miles = distance * 0.621371;

  if (miles < 1) {
    // For very short distances, show in feet (1 mile = 5280 feet)
    return `${Math.round(miles * 5280)} ft`;
  }

  // Round to nearest whole mile for distances over 1 mile
  return `${Math.round(miles).toLocaleString()} miles`;
};

/**
 * Get cardinal direction from bearing angle
 */
export const getCardinalDirection = (bearing: number): string => {
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

  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
};
