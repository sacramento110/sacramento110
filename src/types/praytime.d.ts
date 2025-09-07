declare module 'praytime' {
  interface PrayerTimesResult {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    midnight: string;
  }

  export class PrayTime {
    constructor(method?: string);
    getTimes(
      date: Date,
      location: number[],
      timezone: number
    ): PrayerTimesResult;
    method(method: string): void;
    location(coordinates: number[]): void;
    timezone(timezone: string): void;
    utcOffset(offset: number): void;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PrayTime: any;
  export default PrayTime;
}
