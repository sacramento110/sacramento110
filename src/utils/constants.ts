// Sacramento coordinates for prayer times (City Hall coordinates for accuracy)
export const SACRAMENTO_COORDS = {
  latitude: 38.5816, // Sacramento, CA latitude
  longitude: -121.4944, // Sacramento, CA longitude
  timezone: 'America/Los_Angeles',
};

// Utility function to get the correct base path for images
export const getImagePath = (imagePath: string): string => {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  // Check if we're in development mode (localhost)
  if (
    typeof window !== 'undefined' &&
    window.location.hostname === 'localhost'
  ) {
    return `/${cleanPath}`;
  }

  // Production mode - use the full path
  return `/${cleanPath}`;
};

// SSMA Information
export const SSMA_INFO = {
  name: 'Sacramento Shia Muslim Association',
  shortName: 'SSMA',
  tagline:
    'Serving the Muslim community, following the guidance of Quran and Ahlul-Bayt',
  location: 'Sacramento, CA',
  email: 'info@sacramentoshia.org',
  facebook: 'https://www.facebook.com/sacramento.shia',
  youtube: 'https://www.youtube.com/@sacramentoshia6230',
  instagram: 'https://www.instagram.com/sacramentoshia',
  channelId: 'UCsacramentoshia6230', // You'll need to get the actual channel ID
};

// Prayer time icons
export const PRAYER_ICONS = {
  fajr: '🌅',
  sunrise: '☀️',
  dhuhr: '🌞',
  asr: '🌤️',
  maghrib: '🌆',
  sunset: '🌇',
  isha: '🌙',
  midnight: '🌃',
};

// About SSMA content
export const ABOUT_CONTENT = `The Sacramento Shia Muslim Association (SSMA) is a non-profit organization dedicated to serving the Urdu-speaking Shia community of Greater Sacramento by fostering spiritual growth, preserving Urdu heritage, and promoting Islamic values of compassion and unity through diverse religious, cultural, and community programs. SSMA provides regular lectures, Quranic teachings, religious commemorations, and cultural events to nurture the spiritual and social needs of its members, strengthen community bonds, and inspire the practice of Islamic principles as taught in the Holy Qur'an and the traditions of Prophet Muhammad (S) and the Ahlul Bayt (AS). Committed to inclusivity, compassion, and service, SSMA strives to be a welcoming home for believers and a beacon of truth, and peace for the broader community.`;

// Donation information
export const DONATION_INFO = {
  venmo: {
    handle: '@SacramentoShia',
    qrCode: 'images/Venmo.jpeg',
  },
  zelle: {
    email: 'Use QR code below',
    organization: 'Sacramento Shia Muslim Association',
    qrCode: 'images/zelleMini.jpeg',
  },
};
