'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import HomeSection from './sections/Home';
import DrawCharacter from './sections/DrawCharacter';
import DescribeCharacter from './sections/DescribeCharacter';
import Storybook from './sections/Storybook';

type Page = 'landing' | 'drawing' | 'input' | 'storybook';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  // Render current page
  if (currentPage === 'landing') {
    return (
      <>
        <NavBar onHomeClick={() => setCurrentPage('landing')} />
        <HomeSection onStart={() => setCurrentPage('drawing')} />
      </>
    );
  }

  if (currentPage === 'drawing') {
    return (
      <>
        <NavBar onHomeClick={() => setCurrentPage('landing')} />
        <DrawCharacter onNext={() => setCurrentPage('input')} />
      </>
    );
  }

  if (currentPage === 'input') {
    return (
      <>
        <NavBar onHomeClick={() => setCurrentPage('landing')} />
        <DescribeCharacter
          onBack={() => setCurrentPage('drawing')}
          onStoryGenerated={() => setCurrentPage('storybook')}
        />
      </>
    );
  }

  if (currentPage === 'storybook') {
    return (
      <>
        <NavBar onHomeClick={() => setCurrentPage('landing')} />
        <Storybook onBackToDrawing={() => setCurrentPage('drawing')} />
      </>
    );
  }

  // Fallback
  return (
    <>
      <NavBar onHomeClick={() => setCurrentPage('landing')} />
      <HomeSection onStart={() => setCurrentPage('drawing')} />
    </>
  );
}