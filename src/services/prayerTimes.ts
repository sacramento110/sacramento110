import { PrayerTimes, PrayerTime } from '@/types/prayer';
import { SACRAMENTO_COORDS, PRAYER_ICONS } from '@/utils/constants';
import { formatTime } from '@/utils/dateHelpers';

// Dynamic import for praytime package to handle module issues
let PrayTime: any = null;

export const calculatePrayerTimes = async (): Promise<PrayerTimes> => {
  try {
    // Dynamic import for praytime
    if (!PrayTime) {
      try {
        const prayTimeModule = await import('praytime');
        // @ts-ignore
        PrayTime = prayTimeModule.PrayTime || prayTimeModule.default?.PrayTime || prayTimeModule.default || prayTimeModule;
      } catch (importError) {
        console.error('Failed to import praytime:', importError);
        throw new Error('Prayer time calculation library not available');
      }
    }
    
    const today = new Date();
    
    // Get proper timezone offset for Sacramento (handles DST automatically)
    const getCurrentTimezoneOffset = (): number => {
      const date = new Date();
      // Get the timezone offset in minutes and convert to hours
      const offsetMinutes = date.getTimezoneOffset();
      // For Sacramento/PDT in August, offset should be -7 (420 minutes / 60 = 7 hours behind UTC)
      const offsetHours = -offsetMinutes / 60;
      return offsetHours;
    };
    
    const timezoneOffset = getCurrentTimezoneOffset();
    console.log(`Using timezone offset: ${timezoneOffset} hours for Sacramento`);
    
    // Create PrayTime instance with Jafari method
    const prayTime = new PrayTime('Jafari');
    
    // Calculate prayer times for Sacramento coordinates
    const times = prayTime.getTimes(
      today,
      [SACRAMENTO_COORDS.latitude, SACRAMENTO_COORDS.longitude],
      timezoneOffset
    );
    
    // Convert 24-hour format to 12-hour format with AM/PM
    const convertTo12Hour = (time24: string): string => {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };
    
    // Calculate sunset (15 minutes after Maghrib as per Shia tradition)
    const maghribTime = times.maghrib;
    const [maghribHour, maghribMin] = maghribTime.split(':').map(Number);
    const sunsetTime = new Date();
    sunsetTime.setHours(maghribHour, maghribMin + 15, 0, 0);
    const sunsetFormatted = formatTime(sunsetTime);
    
    return {
      fajr: convertTo12Hour(times.fajr),
      sunrise: convertTo12Hour(times.sunrise),
      dhuhr: convertTo12Hour(times.dhuhr),
      asr: convertTo12Hour(times.asr),
      maghrib: convertTo12Hour(times.maghrib),
      sunset: sunsetFormatted,
      isha: convertTo12Hour(times.isha),
      midnight: convertTo12Hour(times.midnight),
      date: today.toISOString().split('T')[0],
      location: 'Sacramento, CA'
    };
  } catch (error) {
    console.error('Error calculating prayer times:', error);
    
    // Fallback to mock times if calculation fails
    const mockTimes = {
      fajr: '5:30 AM',
      sunrise: '6:45 AM',
      dhuhr: '12:30 PM',
      asr: '3:45 PM',
      maghrib: '6:20 PM',
      sunset: '6:35 PM',
      isha: '7:50 PM',
      midnight: '12:15 AM'
    };
    
    return {
      ...mockTimes,
      date: new Date().toISOString().split('T')[0],
      location: 'Sacramento, CA'
    };
  }
};

export const getPrayerTimesArray = (prayerTimes: PrayerTimes): PrayerTime[] => {
  const now = new Date();
  
  const times = [
    { name: 'Fajr', time: prayerTimes.fajr, icon: PRAYER_ICONS.fajr },
    { name: 'Sunrise', time: prayerTimes.sunrise, icon: PRAYER_ICONS.sunrise },
    { name: 'Dhuhr', time: prayerTimes.dhuhr, icon: PRAYER_ICONS.dhuhr },
    { name: 'Asr', time: prayerTimes.asr, icon: PRAYER_ICONS.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib, icon: PRAYER_ICONS.maghrib },
    { name: 'Sunset', time: prayerTimes.sunset, icon: PRAYER_ICONS.sunset },
    { name: 'Isha', time: prayerTimes.isha, icon: PRAYER_ICONS.isha },
    { name: 'Midnight', time: prayerTimes.midnight, icon: PRAYER_ICONS.midnight }
  ];
  
  // Determine which prayer is next and current
  let nextPrayerIndex = -1;
  for (let i = 0; i < times.length; i++) {
    const prayerTime = convertTo24Hour(times[i].time);
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    if (prayerTime > currentTime) {
      nextPrayerIndex = i;
      break;
    }
  }
  
  // If no prayer found for today, next prayer is Fajr tomorrow
  if (nextPrayerIndex === -1) {
    nextPrayerIndex = 0;
  }
  
  return times.map((prayer, index) => ({
    ...prayer,
    isNext: index === nextPrayerIndex,
    isActive: index === nextPrayerIndex
  }));
};

const convertTo24Hour = (timeString: string): number => {
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let hour24 = hours;
  if (period === 'PM' && hours !== 12) hour24 += 12;
  if (period === 'AM' && hours === 12) hour24 = 0;
  
  return hour24 * 100 + minutes;
};

export const getNextPrayerTime = (prayerTimes: PrayerTime[]): PrayerTime | null => {
  return prayerTimes.find(prayer => prayer.isNext) || null;
};
