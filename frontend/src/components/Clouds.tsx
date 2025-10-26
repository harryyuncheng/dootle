'use client';

import Image from 'next/image';
import { useTransition } from '@/contexts/TransitionContext';

export default function Clouds() {
  const { isTransitioning } = useTransition();

  // Cloud configurations with positions and slide distances
  const clouds = [

    // Top left
    { src: '/clouds/cloud7.png', top: '10%', left: '-8%', width: 600, slideDistance: '32vw', fromLeft: true, flipHorizontal: false },
    { src: '/clouds/cloud1.png', top: '23%', left: '-8%', width: 400, slideDistance: '39vw', fromLeft: true, flipHorizontal: false },
    { src: '/clouds/cloud4.png', top: '5%', left: '-25%', width: 500, slideDistance: '28vw', fromLeft: true, flipHorizontal: true },
    
    // Top right
    { src: '/clouds/cloud2.png', top: '2%', right: '-10%', width: 600, slideDistance: '-30vw', fromLeft: false, flipHorizontal: false },
    { src: '/clouds/cloud4.png', top: '15%', right: '-10%', width: 500, slideDistance: '-30vw', fromLeft: false, flipHorizontal: false },
    { src: '/clouds/cloud5.png', top: '-5%', right: '-30%', width: 400, slideDistance: '-30vw', fromLeft: false, flipHorizontal: true },
    
    // Middle right
    { src: '/clouds/cloud3.png', top: '30%', right: '-40%', width: 700, slideDistance: '-55vw', fromLeft: false, flipHorizontal: true },
    { src: '/clouds/cloud8.png', top: '25%', right: '-30%', width: 400, slideDistance: '-35vw', fromLeft: false, flipHorizontal: false },
        
    // Middle left
    { src: '/clouds/cloud2.png', top: '30%', left: '-40%', width: 700, slideDistance: '55vw', fromLeft: true, flipHorizontal: true },
    { src: '/clouds/cloud7.png', top: '30%', left: '-40%', width: 400, slideDistance: '35vw', fromLeft: true, flipHorizontal: true },
    
    // Bottom left
    { src: '/clouds/cloud5.png', top: '45%', left: '-20%', width: 710, slideDistance: '35vw', fromLeft: true, flipHorizontal: false },
    { src: '/clouds/cloud3.png', bottom: '11%', left: '-10%', width: 700, slideDistance: '37vw', fromLeft: true, flipHorizontal: false },
    { src: '/clouds/cloud1.png', bottom: '5%', left: '-20%', width: 400, slideDistance: '25vw', fromLeft: true, flipHorizontal: false },

    // Bottom right
    { src: '/clouds/cloud2.png', bottom: '28%', right: '-15%', width: 600, slideDistance: '-32vw', fromLeft: false, flipHorizontal: false },
    { src: '/clouds/cloud1.png', bottom: '10%', right: '-5%', width: 600, slideDistance: '-35vw', fromLeft: false, flipHorizontal: true },
    { src: '/clouds/cloud6.png', bottom: '-3%', right: '-35%', width: 600, slideDistance: '-35vw', fromLeft: false, flipHorizontal: false },
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
              style={{
                transform: cloud.flipHorizontal ? 'scaleX(-1)' : 'none',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
