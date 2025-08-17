import { useState, useEffect } from 'react';
import { PrayerTimes, PrayerTime } from '@/types/prayer';
import { calculatePrayerTimes, getPrayerTimesArray, getNextPrayerTime } from '@/services/prayerTimes';

export const usePrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [prayerTimesArray, setPrayerTimesArray] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        const times = await calculatePrayerTimes();
        const timesArray = getPrayerTimesArray(times);
        const next = getNextPrayerTime(timesArray);
        
        setPrayerTimes(times);
        setPrayerTimesArray(timesArray);
        setNextPrayer(next);
        setError(null);
      } catch (err) {
        setError('Failed to load prayer times');
        console.error('Prayer times error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
    
    // Update prayer times every minute
    const interval = setInterval(fetchPrayerTimes, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    prayerTimes,
    prayerTimesArray,
    nextPrayer,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      calculatePrayerTimes().then(times => {
        const timesArray = getPrayerTimesArray(times);
        const next = getNextPrayerTime(timesArray);
        
        setPrayerTimes(times);
        setPrayerTimesArray(timesArray);
        setNextPrayer(next);
        setLoading(false);
      });
    }
  };
};
