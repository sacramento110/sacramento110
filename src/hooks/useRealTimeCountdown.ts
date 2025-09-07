import { useState, useEffect } from 'react';
import { getTimeUntilWithSeconds } from '@/utils/dateHelpers';

export const useRealTimeCountdown = (targetTime: string | null) => {
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    if (!targetTime) {
      setCountdown('');
      return;
    }

    // Update immediately
    setCountdown(getTimeUntilWithSeconds(targetTime));

    // Update every second
    const interval = setInterval(() => {
      setCountdown(getTimeUntilWithSeconds(targetTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return countdown;
};
