'use client';

interface LibraryProps {
  onBackToStorybook: () => void;
}

export default function Library({ onBackToStorybook }: LibraryProps) {
  // Fixed patterns for each shelf (0 = hidden, 1 = visible)
  const shelf1Pattern = [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1];
  const shelf2Pattern = [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0];
  const shelf3Pattern = [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1];
  const shelf4Pattern = [0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1];

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-amber-50 to-orange-100 relative">
      {/* Multiple Shelves */}
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-20">
        {/* Shelf 1 - Top Shelf */}
        <div className="relative" data-shelf-number="1">
          {/* White background box for shelf 1 */}
          <div className="absolute inset-0 bg-white w-96" style={{ height: '80px', transform: 'translateY(0.25cm) scaleY(0.30)', transformOrigin: 'top', opacity: 0 }}>
            <div className="absolute top-2 left-2 text-2xl font-bold text-gray-700 z-10">1</div>
          </div>
          {/* Colored rectangles on top of box 1 - filling the entire width, behind shelf */}
          {Array.from({ length: 16 }).map((_, i) => {
            const colors = ['red', 'blue', 'green', 'yellow'];
            const color = colors[(i + 0) % colors.length]; // Shelf 1 starts at 0
            const show = shelf1Pattern[i] === 1; // Use fixed pattern
            
            if (!show) return null;
            
            return (
              <div key={i}>
                <div 
                  className="absolute top-0 z-0" 
                  style={{ 
                    left: `${i * 24}px`,
                    transform: 'translateY(calc(0.25cm - 58px))', 
                    width: '24px', 
                    height: '58px', 
                    backgroundColor: color,
                    opacity: 0
                  }}
                >
                </div>
                {color === 'blue' && (
                  <img
                    src="/book_1.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
                {color === 'green' && (
                  <img
                    src="/book_2.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
                {color === 'yellow' && (
                  <img
                    src="/book_3.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
                {color === 'red' && (
                  <img
                    src="/book_4.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
              </div>
            );
          })}
          <img
            src="/shelf_sg.png"
            alt="Shelf"
            className="w-96 drop-shadow-lg relative z-20"
            draggable={false}
          />
        </div>
        
        {/* Shelf 2 - Second Shelf */}
        <div className="relative" data-shelf-number="2">
          {/* White background box for shelf 2 */}
          <div className="absolute inset-0 bg-white w-96" style={{ height: '80px', transform: 'translateY(0.25cm) scaleY(0.30)', transformOrigin: 'top', opacity: 0 }}>
            <div className="absolute top-2 left-2 text-2xl font-bold text-gray-700 z-10">2</div>
          </div>
          {/* Colored rectangles on top of box 2 */}
          {Array.from({ length: 16 }).map((_, i) => {
            const colors = ['red', 'blue', 'green', 'yellow'];
            const color = colors[(i + 1) % colors.length]; // Shelf 2 starts at index 1
            const show = shelf2Pattern[i] === 1; // Use fixed pattern
            
            if (!show) return null;
            
            return (
              <div key={i}>
                <div 
                  className="absolute top-0 z-0" 
                  style={{ 
                    left: `${i * 24}px`,
                    transform: 'translateY(calc(0.25cm - 58px))', 
                    width: '24px', 
                    height: '58px', 
                    backgroundColor: color,
                    opacity: 0
                  }}
                >
                </div>
                {color === 'blue' && (
                  <img
                    src="/book_1.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
                {color === 'green' && (
                  <img
                    src="/book_2.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
                {color === 'yellow' && (
                  <img
                    src="/book_3.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
                {color === 'red' && (
                  <img
                    src="/book_4.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
              </div>
            );
          })}
          <img
            src="/shelf_sg.png"
            alt="Shelf"
            className="w-96 drop-shadow-lg relative z-20"
            draggable={false}
          />
        </div>
        
        {/* Shelf 3 - Third Shelf */}
        <div className="relative" data-shelf-number="3">
          {/* White background box for shelf 3 */}
          <div className="absolute inset-0 bg-white w-96" style={{ height: '80px', transform: 'translateY(0.25cm) scaleY(0.30)', transformOrigin: 'top', opacity: 0 }}>
            <div className="absolute top-2 left-2 text-2xl font-bold text-gray-700 z-10">3</div>
          </div>
          {/* Colored rectangles on top of box 3 */}
          {Array.from({ length: 16 }).map((_, i) => {
            const colors = ['red', 'blue', 'green', 'yellow'];
            const color = colors[(i + 2) % colors.length]; // Shelf 3 starts at index 2
            const show = shelf3Pattern[i] === 1; // Use fixed pattern
            
            if (!show) return null;
            
            return (
              <div key={i}>
                <div 
                  className="absolute top-0 z-0" 
                  style={{ 
                    left: `${i * 24}px`,
                    transform: 'translateY(calc(0.25cm - 58px))', 
                    width: '24px', 
                    height: '58px', 
                    backgroundColor: color,
                    opacity: 0
                  }}
                >
                </div>
                {color === 'blue' && (
                  <img
                    src="/book_1.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
                {color === 'green' && (
                  <img
                    src="/book_2.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
                {color === 'yellow' && (
                  <img
                    src="/book_3.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
                {color === 'red' && (
                  <img
                    src="/book_4.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
              </div>
            );
          })}
          <img
            src="/shelf_sg.png"
            alt="Shelf"
            className="w-96 drop-shadow-lg relative z-20"
            draggable={false}
          />
        </div>
        
        {/* Shelf 4 - Fourth Shelf */}
        <div className="relative" data-shelf-number="4">
          {/* White background box for shelf 4 */}
          <div className="absolute inset-0 bg-white w-96" style={{ height: '80px', transform: 'translateY(0.25cm) scaleY(0.30)', transformOrigin: 'top', opacity: 0 }}>
            <div className="absolute top-2 left-2 text-2xl font-bold text-gray-700 z-10">4</div>
          </div>
          {/* Colored rectangles on top of box 4 */}
          {Array.from({ length: 16 }).map((_, i) => {
            const colors = ['red', 'blue', 'green', 'yellow'];
            const color = colors[(i + 3) % colors.length]; // Shelf 4 starts at index 3
            const show = shelf4Pattern[i] === 1; // Use fixed pattern
            
            if (!show) return null;
            
            return (
              <div key={i}>
                <div 
                  className="absolute top-0 z-0" 
                  style={{ 
                    left: `${i * 24}px`,
                    transform: 'translateY(calc(0.25cm - 58px))', 
                    width: '24px', 
                    height: '58px', 
                    backgroundColor: color,
                    opacity: 0
                  }}
                >
                </div>
                {color === 'blue' && (
                  <img
                    src="/book_1.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
                {color === 'green' && (
                  <img
                    src="/book_2.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
                {color === 'yellow' && (
                  <img
                    src="/book_3.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
                {color === 'red' && (
                  <img
                    src="/book_4.png"
                    alt="Book"
                    className="absolute top-0 z-10 hover:scale-[1.4] transition-transform duration-300 cursor-pointer"
                    onClick={onBackToStorybook}
                    style={{
                      left: `${i * 24}px`,
                      transform: 'translateY(calc(0.25cm - 58px))',
                      width: '24px',
                      height: '58px',
                      objectFit: 'contain',
                      objectPosition: 'bottom'
                    }}
                  />
                )}
              </div>
            );
          })}
          <img
            src="/shelf_sg.png"
            alt="Shelf"
            className="w-96 drop-shadow-lg relative z-20"
            draggable={false}
          />
        </div>
      </div>

      {/* Back button - top right */}
      <button
        onClick={onBackToStorybook}
        className="absolute top-6 right-6 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-lg z-20"
      >
        Back
      </button>
    </div>
  );
}

