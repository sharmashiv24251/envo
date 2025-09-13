import { useState, useEffect, useCallback } from 'react';
import { posts, Post } from '../../constants/db';

interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useFeedPreview(): QueryResult<Post[]> {
  const [data, setData] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Get latest 3 posts for preview
      const latestPosts = [...posts]
        .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
        .slice(0, 3);
      
      setData(latestPosts);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}
