'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PortfolioData = Record<string, any>;

interface PortfolioContextType {
  data: PortfolioData | null;
  loading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType>({ data: null, loading: true });

export function PortfolioProvider({ children, initialData }: { children: React.ReactNode, initialData?: PortfolioData | null }) {
  const [data, setData] = useState<PortfolioData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  // Fetch on client if no server data was provided
  useEffect(() => {
    if (initialData) return;

    const fetchPortfolio = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
        const baseUrl = backendUrl ? backendUrl.replace(/\/$/, '') : '';

        const res = await fetch(`${baseUrl}/api/portfolio`);
        if (res.ok) {
          const fetchedData = await res.json();
          setData(fetchedData);
        }
      } catch (error) {
        console.error('Network error fetching portfolio data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [initialData]);

  return (
    <PortfolioContext.Provider value={{ data, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioData() {
  return useContext(PortfolioContext);
}
