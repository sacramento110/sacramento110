export interface PrayerTime {
  name: string;
  time: string;
  icon: string;
  isNext: boolean;
  isActive: boolean;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  sunset: string;
  isha: string;
  midnight: string;
  date: string;
  location: string;
}

export interface PrayerConfig {
  latitude: number;
  longitude: number;
  timezone: string;
  method: string; // Shia Jafaria method
}
