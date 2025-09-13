import { useState, useEffect, useCallback } from 'react';
import { rewards, Rewards } from '../../constants/db';

interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useRewards(): QueryResult<Rewards> {
  const [data, setData] = useState<Rewards | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Deep copy to avoid mutations
      setData(JSON.parse(JSON.stringify(rewards)));
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
