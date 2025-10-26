'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type TransitionContextType = {
  isTransitioning: boolean;
  startTransition: (callback: () => void) => Promise<void>;
};

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = async (callback: () => void): Promise<void> => {
    return new Promise((resolve) => {
      setIsTransitioning(true);
      
      // Wait for clouds to move to the middle (1000ms)
      setTimeout(() => {
        callback(); // Change the page/section while clouds are in the middle
        
        // Wait for clouds to return to original positions (1000ms)
        setTimeout(() => {
          setIsTransitioning(false);
          resolve();
        }, 1000);
      }, 1000);
    });
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider');
  }
  return context;
}
