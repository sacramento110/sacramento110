import { fetchYouTubeVideos } from '@/services/youtube';
import { YouTubeVideo } from '@/types/youtube';
import { useEffect, useState } from 'react';

export const useYouTubeVideos = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const result = await fetchYouTubeVideos();
        setVideos(result.videos);
        setError(result.error || null);
      } catch (err) {
        setError('Failed to load YouTube videos');

        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  return {
    videos,
    loading,
    error,
    refetch: async () => {
      setLoading(true);
      try {
        const result = await fetchYouTubeVideos();
        setVideos(result.videos);
        setError(result.error || null);
      } catch (err) {
        setError('Failed to load YouTube videos');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    },
  };
};
