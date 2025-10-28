'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import HomeSection from './sections/Home';
import DrawCharacter from './sections/DrawCharacter';
import DescribeCharacter from './sections/DescribeCharacter';
import Storybook from './sections/Storybook';
import Login from './sections/Login';
import Library from '@/components/Library';
import { useTransition } from '@/contexts/TransitionContext';
import { useAuth } from '@/contexts/AuthContext';

type Page = 'login' | 'landing' | 'drawing' | 'input' | 'storybook' | 'library';

export default function Home() {
  const { isLoggedIn, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(isLoggedIn ? 'landing' : 'login');
  const { startTransition, transitionPhase, setIsStorybookPage } = useTransition();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn && currentPage !== 'login') {
      setCurrentPage('login');
    }
  }, [isLoggedIn, currentPage]);

  // Determine fade class based on transition phase
  const getFadeClass = () => {
    if (transitionPhase === 'fading-out') return 'fade-out';
    if (transitionPhase === 'fading-in') return 'fade-in';
    return '';
  };

  const fadeClass = getFadeClass();

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
  };

  const handleLibraryClick = () => {
    setIsStorybookPage(false);
    startTransition(() => setCurrentPage('library'));
  };

  // Render login page
  if (currentPage === 'login') {
    return <Login onLoginSuccess={() => setCurrentPage('landing')} />;
  }

  // Render library page
  if (currentPage === 'library') {
    return (
      <>
        <NavBar
          onHomeClick={() => {
            setIsStorybookPage(false);
            startTransition(() => setCurrentPage('landing'));
          }}
          onLibraryClick={handleLibraryClick}
          onLogoutClick={handleLogout}
        />
        <div className={fadeClass}>
          <Library onBackToStorybook={() => {
            setIsStorybookPage(true);
            startTransition(() => setCurrentPage('storybook'));
          }} />
        </div>
      </>
    );
  }

  // Render current page
  if (currentPage === 'landing') {
    return (
      <>
        <NavBar
          onHomeClick={() => startTransition(() => setCurrentPage('landing'))}
          onLibraryClick={handleLibraryClick}
          onLogoutClick={handleLogout}
        />
        <div className={fadeClass}>
          <HomeSection onStart={() => {
            setIsStorybookPage(false);
            startTransition(() => setCurrentPage('drawing'));
          }} />
        </div>
      </>
    );
  }

  if (currentPage === 'drawing') {
    return (
      <>
        <NavBar
          onHomeClick={() => {
            setIsStorybookPage(false);
            startTransition(() => setCurrentPage('landing'));
          }}
          onLibraryClick={handleLibraryClick}
          onLogoutClick={handleLogout}
        />
        <div className={fadeClass}>
          <DrawCharacter onNext={() => {
            setIsStorybookPage(false);
            startTransition(() => setCurrentPage('input'));
          }} />
        </div>
      </>
    );
  }

  if (currentPage === 'input') {
    return (
      <>
        <NavBar
          onHomeClick={() => {
            setIsStorybookPage(false);
            startTransition(() => setCurrentPage('landing'));
          }}
          onLibraryClick={handleLibraryClick}
          onLogoutClick={handleLogout}
        />
        <div className={fadeClass}>
          <DescribeCharacter
            onBack={() => {
              setIsStorybookPage(false);
              startTransition(() => setCurrentPage('drawing'));
            }}
            onStoryGenerated={() => {
              setIsStorybookPage(true);
              startTransition(() => setCurrentPage('storybook'));
            }}
          />
        </div>
      </>
    );
  }

  if (currentPage === 'storybook') {
    return (
      <>
        <NavBar
          onHomeClick={() => {
            setIsStorybookPage(false);
            startTransition(() => setCurrentPage('landing'));
          }}
          onLibraryClick={handleLibraryClick}
          onLogoutClick={handleLogout}
        />
        <div className={fadeClass}>
          <Storybook onBackToDrawing={() => {
            setIsStorybookPage(false);
            startTransition(() => setCurrentPage('drawing'));
          }} />
        </div>
      </>
    );
  }

  // Fallback
  return (
    <>
      <NavBar
        onHomeClick={() => {
          setIsStorybookPage(false);
          startTransition(() => setCurrentPage('landing'));
        }}
        onLibraryClick={handleLibraryClick}
        onLogoutClick={handleLogout}
      />
      <div className={fadeClass}>
        <HomeSection onStart={() => {
          setIsStorybookPage(false);
          startTransition(() => setCurrentPage('drawing'));
        }} />
      </div>
    </>
  );
}