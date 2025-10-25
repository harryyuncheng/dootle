'use client';

import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import CloudTransition from '@/components/CloudTransition';

interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  const [showCloudTransition, setShowCloudTransition] = useState(false);

  const handleStart = () => {
    setShowCloudTransition(true);
  };

  const handleCloudTransitionComplete = () => {
    setShowCloudTransition(false);
    onStart();
  };

  return (
    <>
      <LandingPage onStart={handleStart} />
      <CloudTransition 
        isVisible={showCloudTransition} 
        onComplete={handleCloudTransitionComplete}
      />
    </>
  );
}
