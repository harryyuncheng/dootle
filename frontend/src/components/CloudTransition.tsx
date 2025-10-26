'use client';

import Image from 'next/image';
import { useTransition } from '@/contexts/TransitionContext';

type CloudConfig = {
  src: string;
  startLeft?: string;
  startRight?: string;
  verticalPosition: string;
  slideDistance: string; // How far to slide towards middle (e.g., '50vw', '60vw')
  width: number;
  delay: number;
  fromLeft: boolean;
};

export default function CloudTransition() {
  const { isTransitioning } = useTransition();

  if (!isTransitioning) return null;

  // Configure clouds that will slide from edges to middle and back
  const transitionClouds: CloudConfig[] = [
    // Clouds from the LEFT side - slide RIGHT towards middle
    { 
      src: '/clouds/cloud1.png', 
      startLeft: '-10%',
      verticalPosition: '5%',
      slideDistance: '52vw',  // Adjust to control how far right it slides
      width: 200,
      delay: 0,
      fromLeft: true
    },
    { 
      src: '/clouds/cloud2.png', 
      startLeft: '-12%',
      verticalPosition: '25%',
      slideDistance: '48vw',  // Adjust to control how far right it slides
      width: 180,
      delay: 0,
      fromLeft: true
    },
    { 
      src: '/clouds/cloud5.png', 
      startLeft: '-11%',
      verticalPosition: '50%',
      slideDistance: '45vw',  // Adjust to control how far right it slides
      width: 210,
      delay: 0,
      fromLeft: true
    },
    { 
      src: '/clouds/cloud7.png', 
      startLeft: '-9%',
      verticalPosition: '75%',
      slideDistance: '50vw',  // Adjust to control how far right it slides
      width: 195,
      delay: 0,
      fromLeft: true
    },
    
    // Clouds from the RIGHT side - slide LEFT towards middle
    { 
      src: '/clouds/cloud3.png', 
      startRight: '-10%',
      verticalPosition: '10%',
      slideDistance: '-55vw', // Negative = slide left
      width: 220,
      delay: 0,
      fromLeft: false
    },
    { 
      src: '/clouds/cloud4.png', 
      startRight: '-11%',
      verticalPosition: '30%',
      slideDistance: '-60vw', // Negative = slide left
      width: 190,
      delay: 0,
      fromLeft: false
    },
    { 
      src: '/clouds/cloud6.png', 
      startRight: '-12%',
      verticalPosition: '55%',
      slideDistance: '-58vw', // Negative = slide left
      width: 200,
      delay: 0,
      fromLeft: false
    },
    { 
      src: '/clouds/cloud8.png', 
      startRight: '-10%',
      verticalPosition: '80%',
      slideDistance: '-62vw', // Negative = slide left
      width: 185,
      delay: 0,
      fromLeft: false
    },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-[10000]">
      {transitionClouds.map((cloud, index) => (
        <div
          key={index}
          className={`absolute ${cloud.fromLeft ? 'animate-cloud-from-left' : 'animate-cloud-from-right'}`}
          style={{
            top: cloud.verticalPosition,
            left: cloud.startLeft || 'auto',
            right: cloud.startRight || 'auto',
            animationDelay: `${cloud.delay}s`,
            [cloud.fromLeft ? '--slide-distance-left' : '--slide-distance-right']: cloud.slideDistance,
          } as React.CSSProperties}
        >
          <Image
            src={cloud.src}
            alt="Transition cloud"
            width={cloud.width}
            height={cloud.width * 0.6}
            className="opacity-90"
            priority
          />
        </div>
      ))}
    </div>
  );
}
