'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type TransitionPhase = 'idle' | 'fading-out' | 'fading-in';

type TransitionContextType = {
  isTransitioning: boolean;
  transitionPhase: TransitionPhase;
  isStorybookPage: boolean;
  setIsStorybookPage: (value: boolean) => void;
  startTransition: (callback: () => void) => Promise<void>;
};

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle');
  const [isStorybookPage, setIsStorybookPage] = useState(false);

  const startTransition = async (callback: () => void): Promise<void> => {
    return new Promise((resolve) => {
      setIsTransitioning(true);
      setTransitionPhase('fading-out');
      
      // Wait for clouds to move to the middle and fade-out to complete (1000ms)
      setTimeout(() => {
        callback(); // Change the page/section while clouds are in the middle
        setTransitionPhase('fading-in');
        
        // Wait for clouds to return to original positions and fade-in to complete (1000ms)
        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionPhase('idle');
          resolve();
        }, 1000);
      }, 1000);
    });
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, transitionPhase, isStorybookPage, setIsStorybookPage, startTransition }}>
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
