'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CloudTransitionProps {
  isVisible: boolean;
  onComplete: () => void;
}

export default function CloudTransition({ isVisible, onComplete }: CloudTransitionProps) {
  const [phase, setPhase] = useState<'hidden' | 'moving-in' | 'moving-out' | 'complete'>('hidden');

  useEffect(() => {
    if (isVisible) {
      setPhase('moving-in');
      
      // Start moving out after clouds cover the screen
      setTimeout(() => {
        setPhase('moving-out');
      }, 900);
      
      // Complete transition
      setTimeout(() => {
        setPhase('complete');
        onComplete();
      }, 1800);
    } else {
      setPhase('hidden');
    }
  }, [isVisible, onComplete]);

  if (!isVisible && phase === 'hidden') return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-br from-sky-200 via-blue-100 to-purple-100">
      {/* Background Cloud Layer - Top */}
      <div className={`absolute top-0 left-1/4 transform -translate-x-1/2 transition-all duration-900 ease-in-out ${
        phase === 'moving-in' 
          ? 'translate-y-1/2' 
          : phase === 'moving-out'
          ? '-translate-y-1/2'
          : '-translate-y-1/2'
      }`}>
          <Image
            src="/clouds/cloud5.png"
            alt="Cloud"
            width={800}
            height={500}
            className="opacity-40"
          />
      </div>

      {/* Background Cloud Layer - Bottom */}
      <div className={`absolute bottom-0 right-1/4 transform translate-x-1/2 transition-all duration-900 ease-in-out ${
        phase === 'moving-in' 
          ? '-translate-y-1/2' 
          : phase === 'moving-out'
          ? 'translate-y-1/2'
          : 'translate-y-1/2'
      }`}>
          <Image
            src="/clouds/cloud6.png"
            alt="Cloud"
            width={750}
            height={450}
            className="opacity-35"
          />
      </div>

      {/* Background Cloud Layer - Center Left */}
      <div className={`absolute left-1/6 top-1/3 transform transition-all duration-900 ease-in-out ${
        phase === 'moving-in' 
          ? 'translate-x-1/2 translate-y-1/3' 
          : phase === 'moving-out'
          ? '-translate-x-1/3'
          : '-translate-x-1/3'
      }`}>
          <Image
            src="/clouds/cloud7.png"
            alt="Cloud"
            width={600}
            height={400}
            className="opacity-30"
          />
      </div>

      {/* Background Cloud Layer - Center Right */}
      <div className={`absolute right-1/6 top-2/3 transform transition-all duration-900 ease-in-out ${
        phase === 'moving-in' 
          ? '-translate-x-1/2 -translate-y-1/3' 
          : phase === 'moving-out'
          ? 'translate-x-1/3'
          : 'translate-x-1/3'
      }`}>
          <Image
            src="/clouds/cloud8.png"
            alt="Cloud"
            width={650}
            height={420}
            className="opacity-30"
          />
      </div>

      {/* Main Left Cloud */}
      <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 transition-all duration-900 ease-in-out ${
        phase === 'moving-in' 
          ? 'translate-x-1/2' 
          : phase === 'moving-out'
          ? '-translate-x-1/4'
          : '-translate-x-1/4'
      }`}>
        <div className="relative">
          {/* Back layer */}
          <Image
            src="/clouds/cloud1.png"
            alt="Cloud"
            width={700}
            height={500}
            className="opacity-60"
          />
          {/* Front layer */}
          <Image
            src="/clouds/cloud3.png"
            alt="Cloud"
            width={650}
            height={450}
            className="opacity-80 absolute top-6 left-6"
          />
        </div>
      </div>

      {/* Main Right Cloud */}
      <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 transition-all duration-900 ease-in-out ${
        phase === 'moving-in' 
          ? '-translate-x-1/2' 
          : phase === 'moving-out'
          ? 'translate-x-1/4'
          : 'translate-x-1/4'
      }`}>
        <div className="relative">
          {/* Back layer */}
          <Image
            src="/clouds/cloud2.png"
            alt="Cloud"
            width={700}
            height={500}
            className="opacity-60"
          />
          {/* Front layer */}
          <Image
            src="/clouds/cloud4.png"
            alt="Cloud"
            width={650}
            height={450}
            className="opacity-80 absolute top-6 left-6"
          />
        </div>
      </div>

    </div>
  );
}