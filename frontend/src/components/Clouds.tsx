import Image from 'next/image';

export default function Clouds() {
  // Cloud configurations with positions
  const clouds = [
    // Top left
    { src: '/clouds/cloud1.png', top: '5%', left: '-5%', width: 200 },
    { src: '/clouds/cloud2.png', top: '15%', left: '-8%', width: 180 },
    
    // Top right
    { src: '/clouds/cloud3.png', top: '8%', right: '-6%', width: 220 },
    { src: '/clouds/cloud4.png', top: '18%', right: '-7%', width: 190 },
    
    // Middle left
    { src: '/clouds/cloud5.png', top: '45%', left: '-7%', width: 210 },
    
    // Middle right
    { src: '/clouds/cloud6.png', top: '50%', right: '-8%', width: 200 },
    
    // Bottom left
    { src: '/clouds/cloud7.png', bottom: '10%', left: '-6%', width: 195 },
    { src: '/clouds/cloud8.png', bottom: '20%', left: '-9%', width: 185 },
    
    // Bottom right
    { src: '/clouds/cloud1.png', bottom: '12%', right: '-7%', width: 205 },
    { src: '/clouds/cloud2.png', bottom: '22%', right: '-5%', width: 175 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {clouds.map((cloud, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: cloud.top,
            bottom: cloud.bottom,
            left: cloud.left,
            right: cloud.right,
          }}
        >
          <Image
            src={cloud.src}
            alt={`Cloud ${index + 1}`}
            width={cloud.width}
            height={cloud.width * 0.6} // Maintain aspect ratio
            className="opacity-80"
            priority
          />
        </div>
      ))}
    </div>
  );
}
