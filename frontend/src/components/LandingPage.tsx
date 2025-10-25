'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [cloudsVisible, setCloudsVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStart = () => {
    setIsTransitioning(true);
    setCloudsVisible(false);
    
    // Wait for animation to complete before transitioning
    setTimeout(() => {
      onStart();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-blue-100 relative overflow-hidden">
      {/* Large Side Clouds */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}>
        {/* Left Side - Layered Clouds */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/4">
          {/* Back layer */}
          <Image
            src="/clouds/cloud1.png"
            alt="Cloud"
            width={600}
            height={400}
            className="opacity-60 absolute"
          />
          {/* Front layer */}
          <Image
            src="/clouds/cloud3.png"
            alt="Cloud"
            width={550}
            height={350}
            className="opacity-80 relative z-10"
          />
        </div>

        {/* Right Side - Layered Clouds */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4">
          {/* Back layer */}
          <Image
            src="/clouds/cloud2.png"
            alt="Cloud"
            width={600}
            height={400}
            className="opacity-60 absolute"
          />
          {/* Front layer */}
          <Image
            src="/clouds/cloud4.png"
            alt="Cloud"
            width={550}
            height={350}
            className="opacity-80 relative z-10"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className={`text-center transition-all duration-1000 ${
          isTransitioning ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
        }`}>
          {/* Title */}
          <h1 className="text-8xl font-bold text-gray-800 mb-8 drop-shadow-lg">
            Dootle
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create magical storybooks with your drawings
          </p>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={isTransitioning}
            className="px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold rounded-2xl shadow-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isTransitioning ? 'Starting...' : 'Start Creating'}
          </button>
        </div>
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .float-animation:nth-child(2) {
          animation-delay: -2s;
        }
        
        .float-animation:nth-child(3) {
          animation-delay: -4s;
        }
      `}</style>
    </div>
  );
}
