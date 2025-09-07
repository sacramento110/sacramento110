import { useEffect, useState } from 'react';
import { detectLiveStream, LiveStream } from '@/services/liveStream';

export const useLiveStream = () => {
  const [liveStream, setLiveStream] = useState<LiveStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLiveStream = async () => {
      try {
        setLoading(true);
        const result = await detectLiveStream();

        if (result.error) {
          setError(result.error);
          setLiveStream(null);
        } else {
          setLiveStream(result.liveStream);
          setError(null);
        }
      } catch (err) {
        setError('Failed to check for live streams');
        setLiveStream(null);
      } finally {
        setLoading(false);
      }
    };

    // Check immediately
    checkLiveStream();

    // Check every 30 seconds for live streams (2,880 requests/day)
    const interval = setInterval(checkLiveStream, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { liveStream, loading, error };
};
