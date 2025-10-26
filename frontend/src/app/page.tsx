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
  const { startTransition, transitionPhase } = useTransition();

  // Determine fade class based on transition phase
  const getFadeClass = () => {
    if (transitionPhase === 'fading-out') return 'fade-out';
    if (transitionPhase === 'fading-in') return 'fade-in';
    return '';
  };

  const fadeClass = getFadeClass();

  // Render current page
  if (currentPage === 'landing') {
    return (
      <>
        <NavBar onHomeClick={() => startTransition(() => setCurrentPage('landing'))} />
        <div className={fadeClass}>
          <HomeSection onStart={() => startTransition(() => setCurrentPage('drawing'))} />
        </div>
      </>
    );
  }

  if (currentPage === 'drawing') {
    return (
      <>
        <NavBar onHomeClick={() => startTransition(() => setCurrentPage('landing'))} />
        <div className={fadeClass}>
          <DrawCharacter onNext={() => startTransition(() => setCurrentPage('input'))} />
        </div>
      </>
    );
  }

  if (currentPage === 'input') {
    return (
      <>
        <NavBar onHomeClick={() => startTransition(() => setCurrentPage('landing'))} />
        <div className={fadeClass}>
          <DescribeCharacter
            onBack={() => startTransition(() => setCurrentPage('drawing'))}
            onStoryGenerated={() => startTransition(() => setCurrentPage('storybook'))}
          />
        </div>
      </>
    );
  }

  if (currentPage === 'storybook') {
    return (
      <>
        <NavBar onHomeClick={() => startTransition(() => setCurrentPage('landing'))} />
        <div className={fadeClass}>
          <Storybook onBackToDrawing={() => startTransition(() => setCurrentPage('drawing'))} />
        </div>
      </>
    );
  }

  // Fallback
  return (
    <>
      <NavBar onHomeClick={() => startTransition(() => setCurrentPage('landing'))} />
      <div className={fadeClass}>
        <HomeSection onStart={() => startTransition(() => setCurrentPage('drawing'))} />
      </div>
    </>
  );
}