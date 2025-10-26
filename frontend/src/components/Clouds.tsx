'use client';

import Image from 'next/image';
import { useTransition } from '@/contexts/TransitionContext';

export default function Clouds() {
  const { isTransitioning } = useTransition();

  // Cloud configurations with positions and slide distances
  const clouds = [
    // Top left

    { src: '/clouds/cloud3.png', top: '10%', left: '-8%', width: 600, slideDistance: '50vw', fromLeft: true },
    { src: '/clouds/cloud1.png', top: '23%', left: '-8%', width: 400, slideDistance: '45vw', fromLeft: true },
    
    // Top right
    { src: '/clouds/cloud2.png', top: '8%', right: '-6%', width: 220, slideDistance: '-55vw', fromLeft: false },
    { src: '/clouds/cloud4.png', top: '18%', right: '-7%', width: 190, slideDistance: '-60vw', fromLeft: false },
    
    // Middle left
    { src: '/clouds/cloud5.png', top: '45%', left: '-7%', width: 210, slideDistance: '45vw', fromLeft: true },
    
    // Middle right
    { src: '/clouds/cloud6.png', top: '50%', right: '-8%', width: 200, slideDistance: '-58vw', fromLeft: false },
    
    // Bottom left
    { src: '/clouds/cloud7.png', bottom: '10%', left: '-6%', width: 195, slideDistance: '50vw', fromLeft: true },
    { src: '/clouds/cloud8.png', bottom: '20%', left: '-9%', width: 185, slideDistance: '48vw', fromLeft: true },
    
    // Bottom right
    { src: '/clouds/cloud1.png', bottom: '12%', right: '-7%', width: 205, slideDistance: '-62vw', fromLeft: false },
    { src: '/clouds/cloud2.png', bottom: '22%', right: '-5%', width: 175, slideDistance: '-55vw', fromLeft: false },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {clouds.map((cloud, index) => {
        const customStyle = {
          top: cloud.top,
          bottom: cloud.bottom,
          left: cloud.left,
          right: cloud.right,
          '--slide-distance-left': cloud.fromLeft ? cloud.slideDistance : undefined,
          '--slide-distance-right': !cloud.fromLeft ? cloud.slideDistance : undefined,
        } as React.CSSProperties & {
          '--slide-distance-left'?: string;
          '--slide-distance-right'?: string;
        };

        return (
          <div
            key={index}
            className={`absolute transition-transform duration-1000 ease-in-out ${
              isTransitioning 
                ? cloud.fromLeft 
                  ? 'animate-cloud-from-left' 
                  : 'animate-cloud-from-right'
                : ''
            }`}
            style={customStyle}
          >
            <Image
              src={cloud.src}
              alt={`Cloud ${index + 1}`}
              width={cloud.width}
              height={cloud.width * 0.6} // Maintain aspect ratio
              priority
            />
          </div>
        );
      })}
    </div>
  );
}
