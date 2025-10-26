'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import HomeSection from './sections/Home';
import DrawCharacter from './sections/DrawCharacter';
import DescribeCharacter from './sections/DescribeCharacter';
import Storybook from './sections/Storybook';
import { useTransition } from '@/contexts/TransitionContext';

type Page = 'landing' | 'drawing' | 'input' | 'storybook';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { startTransition } = useTransition();

  // Render current page
  if (currentPage === 'landing') {
    return (
      <>
        <NavBar onHomeClick={() => startTransition(() => setCurrentPage('landing'))} />
        <HomeSection onStart={() => startTransition(() => setCurrentPage('drawing'))} />
      </>
    );
  }

  if (currentPage === 'drawing') {
    return (
      <>
        <NavBar onHomeClick={() => startTransition(() => setCurrentPage('landing'))} />
        <DrawCharacter onNext={() => startTransition(() => setCurrentPage('input'))} />
      </>
    );
  }

  if (currentPage === 'input') {
    return (
      <>
        <NavBar onHomeClick={() => startTransition(() => setCurrentPage('landing'))} />
        <DescribeCharacter
          onBack={() => startTransition(() => setCurrentPage('drawing'))}
          onStoryGenerated={() => startTransition(() => setCurrentPage('storybook'))}
        />
      </>
    );
  }

  if (currentPage === 'storybook') {
    return (
      <>
        <NavBar onHomeClick={() => startTransition(() => setCurrentPage('landing'))} />
        <Storybook onBackToDrawing={() => startTransition(() => setCurrentPage('drawing'))} />
      </>
    );
  }

  // Fallback
  return (
    <>
      <NavBar onHomeClick={() => startTransition(() => setCurrentPage('landing'))} />
      <HomeSection onStart={() => startTransition(() => setCurrentPage('drawing'))} />
    </>
  );
}