'use client';

import React, { createContext, useContext, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PortfolioData = Record<string, any>;

interface PortfolioContextType {
  data: PortfolioData | null;
  loading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType>({ data: null, loading: true });

export function PortfolioProvider({ children, initialData }: { children: React.ReactNode, initialData?: PortfolioData | null }) {
  const [data] = useState<PortfolioData | null>(initialData || null);
  // Always set loading to false to prevent PageLoader from waiting
  const loading = false;

  return (
    <PortfolioContext.Provider value={{ data, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioData() {
  return useContext(PortfolioContext);
}
