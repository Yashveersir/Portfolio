'use client';

import { useState, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PortfolioData = Record<string, any>;

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
        const baseUrl = backendUrl ? backendUrl.replace(/\/$/, '') : '';

        const res = await fetch(`${baseUrl}/api/portfolio`);
        if (res.ok) {
          const fetchedData = await res.json();
          setData(fetchedData);
        } else {
          console.error('Failed to fetch portfolio data');
        }
      } catch (error) {
        console.error('Network error fetching portfolio data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return { data, loading };
}
