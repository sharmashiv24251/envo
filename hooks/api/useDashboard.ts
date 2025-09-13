import { useState, useEffect, useCallback } from 'react';
import { users, DashboardStats } from '../../constants/db';

interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useDashboard(): QueryResult<DashboardStats> {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Calculate global environmental stats
      const totalCO2 = users.reduce((acc, user) => acc + user.co2, 0);
      const totalPlastic = users.reduce((acc, user) => acc + user.plastic, 0);
      const totalTrees = users.reduce((acc, user) => acc + user.trees, 0);
      
      setData({
        co2: totalCO2,
        plastic: totalPlastic,
        trees: totalTrees,
      });
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
