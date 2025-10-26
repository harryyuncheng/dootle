'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HomeProps {
  onStart: () => void;
}

export default function Home({ onStart }: HomeProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  
  const rotatingTexts = ['bedtime story', 'next adventure', 'hero\'s journey'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
      setAnimationKey((prev) => prev + 1);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setIsTransitioning(true);
    
    // Wait for animation to complete before transitioning
    setTimeout(() => {
      onStart();
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className={`text-center transition-all duration-1000 ${
          isTransitioning ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
        }`}>
          {/* Clickable Main Text */}
          <button
            onClick={handleStart}
            disabled={isTransitioning}
            className="text-center cursor-pointer hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-transparent border-none p-0"
          >
            <h1 className="text-6xl font-bold mb-4 mt-0 drop-shadow-lg flex items-center justify-center" style={{ color: 'var(--foreground)' }}>
              <span className="text-left whitespace-nowrap">Create your</span>
              <span className="inline-block min-w-[380px] text-left ml-4 overflow-hidden relative whitespace-nowrap" style={{ height: '1.40em', lineHeight: '1.40em' }}>
                <span 
                  key={animationKey}
                  className="absolute left-0 top-0 animate-slide-in-out whitespace-nowrap"
                >
                  {rotatingTexts[currentTextIndex]}
                </span>
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl leading-relaxed mt-8" style={{ color: 'var(--foreground)' }}>
              with{' '}
              <Image
                src="/Dootle.png"
                alt="Dootle Logo"
                width={150}
                height={50}
                className="inline-block align-middle"
              />
            </p>
          </button>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slide-in-out {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        
        .animate-slide-in-out {
          animation: slide-in-out 3s cubic-bezier(0.45, 0, 0.55, 1);
        }
      `}</style>
    </div>
  );
}
