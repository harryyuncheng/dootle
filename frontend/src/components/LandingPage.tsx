'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const rotatingTexts = ['bedtime story', 'next adventure', 'hero\'s journey'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
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
    <div className="min-h-screen bg-blue-100 relative overflow-hidden">
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
            <h1 className="text-7xl font-bold mb-4 mt-0 drop-shadow-lg flex items-start justify-center" style={{ color: 'var(--foreground)' }}>
              <span className="text-left">Create your own</span>
              <span className="inline-block min-w-[400px] text-left ml-4 overflow-hidden relative" style={{ height: '1.2em', lineHeight: '1.2em' }}>
                <span 
                  key={currentTextIndex}
                  className="absolute left-0 top-0 animate-slide-in-out"
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
            transform: translateY(-100%);
            opacity: 0;
          }
          15% {
            transform: translateY(0);
            opacity: 1;
          }
          85% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        
        .animate-slide-in-out {
          animation: slide-in-out 3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
