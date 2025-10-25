'use client';

import { useState } from 'react';
import HomeSection from './sections/Home';
import DrawCharacter from './sections/DrawCharacter';
import DescribeCharacter from './sections/DescribeCharacter';
import Storybook from './sections/Storybook';

type Page = 'landing' | 'drawing' | 'input' | 'storybook';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  // Render current page
  if (currentPage === 'landing') {
    return <HomeSection onStart={() => setCurrentPage('drawing')} />;
  }

  if (currentPage === 'drawing') {
    return <DrawCharacter onNext={() => setCurrentPage('input')} />;
  }

  if (currentPage === 'input') {
    return (
      <DescribeCharacter
        onBack={() => setCurrentPage('drawing')}
        onStoryGenerated={() => setCurrentPage('storybook')}
      />
    );
  }

  if (currentPage === 'storybook') {
    return <Storybook onBackToDrawing={() => setCurrentPage('drawing')} />;
  }

  // Fallback
  return <HomeSection onStart={() => setCurrentPage('drawing')} />;
}