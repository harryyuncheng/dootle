'use client';

import { useState } from 'react';
import LandingPage from '@/components/LandingPage';

interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  const handleStart = () => {
    onStart();
  };

  return (
    <>
      <LandingPage onStart={handleStart} />
    </>
  );
}
