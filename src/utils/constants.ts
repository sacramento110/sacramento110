// Sacramento coordinates for prayer times (City Hall coordinates for accuracy)
export const SACRAMENTO_COORDS = {
  latitude: 38.5816, // Sacramento, CA latitude
  longitude: -121.4944, // Sacramento, CA longitude
  timezone: 'America/Los_Angeles'
};

// SSMA Information
export const SSMA_INFO = {
  name: 'Sacramento Shia Muslim Association',
  shortName: 'SSMA',
  tagline: 'Serving the Muslim community, following the guidance of Quran and Ahlul-Bayt',
  location: 'Sacramento, CA',
  email: 'info@sacramentoshia.org',
  facebook: 'https://www.facebook.com/sacramento.shia',
  youtube: 'https://www.youtube.com/@sacramentoshia6230',
  instagram: 'https://www.instagram.com/sacramentoshia',
  channelId: 'UCsacramentoshia6230' // You'll need to get the actual channel ID
};

// YouTube RSS feed URL for free API alternative
export const YOUTUBE_RSS_URL = `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${SSMA_INFO.channelId}`;

// Prayer time icons
export const PRAYER_ICONS = {
  fajr: '🌅',
  sunrise: '☀️',
  dhuhr: '🌞',
  asr: '🌤️',
  maghrib: '🌆',
  sunset: '🌇',
  isha: '🌙',
  midnight: '🌃'
};

// About SSMA content
export const ABOUT_CONTENT = `The Sacramento Shia Muslim Association (SSMA) is a non-profit organization dedicated to serving the Urdu-speaking Shia community of Greater Sacramento by fostering spiritual growth, preserving Urdu heritage, and promoting Islamic values of compassion and unity through diverse religious, cultural, and community programs. SSMA provides regular lectures, Quranic teachings, religious commemorations, and cultural events to nurture the spiritual and social needs of its members, strengthen community bonds, and inspire the practice of Islamic principles as taught in the Holy Qur'an and the traditions of Prophet Muhammad (S) and the Ahlul Bayt (AS). Committed to inclusivity, compassion, and service, SSMA strives to be a welcoming home for believers and a beacon of truth, and peace for the broader community.`;

// Donation information
export const DONATION_INFO = {
  venmo: {
    handle: '@SacramentoShia',
    qrCode: '/sacramento110/images/Venmo.jpeg'
  },
  zelle: {
    email: 's***s@gmail.com',
    organization: 'Sacramento Shia Muslim Association',
    qrCode: '/sacramento110/images/zelleMini.jpeg'
  }
};

// Google Sheets configuration (you'll need to set these up)
export const GOOGLE_CONFIG = {
  sheetsApiUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  driveBaseUrl: 'https://drive.google.com/uc?id='
};
