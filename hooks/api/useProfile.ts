import { useState, useEffect, useCallback } from 'react';
import { users, posts, UserProfile } from '../../constants/db';

interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useProfile(id?: string): QueryResult<UserProfile> {
  const [data, setData] = useState<UserProfile | null>(null);
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
      
      let user: UserProfile | null = null;
      
      if (id) {
        user = users.find(u => u.id === id) || null;
      } else {
        // Return default user (first user)
        user = users[0] || null;
      }
      
      // Update timeline with latest posts
      if (user) {
        user.timeline = posts
          .filter(post => post.uploaderPersonId === user!.id)
          .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      }
      
      setData(user);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

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
