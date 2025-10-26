'use client';

import { useState } from 'react';

interface StorybookProps {
  pages: string[];
  imageData: string;
  colorScheme: string[];
  onBackToDrawing: () => void;
}

export default function Storybook({ pages, imageData, colorScheme, onBackToDrawing }: StorybookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 18; // Total pages including start and end

  const nextPage = () => {
    if (currentPage === 0) {
      // From title page to first content page
      setCurrentPage(1);
    } else if (currentPage < 16) { // Max page 16 to show pages 16-17
      setCurrentPage(currentPage + 2);
    } else if (currentPage === 16) {
      // From page 16 to back page 17
      setCurrentPage(17);
    }
  };

  const prevPage = () => {
    if (currentPage === 1) {
      // From first content page back to title page
      setCurrentPage(0);
    } else if (currentPage === 17) {
      // From back page to page 16
      setCurrentPage(16);
    } else if (currentPage > 1) {
      setCurrentPage(currentPage - 2);
    }
  };

  const getBookImage = () => {
    if (currentPage === 0) {
      return "/book/book_front.png"; // Show front cover for page 0
    } else if (currentPage === 17) {
      return "/book/book_back.png"; // Show book_back.png for back page
    } else {
      return "/book/book_mid.png";
    }
  };

  const shouldShowContent = () => {
    return currentPage > 0 && currentPage < 17;
  };

  const shouldShowEnlargementAnimation = () => {
    return currentPage >= 1 && currentPage <= 16;
  };

  const shouldShowShrinkAnimation = () => {
    return currentPage === 15 || currentPage === 16;
  };

  const shouldShowBookBackTransition = () => {
    return currentPage === 17;
  };

  return (
    <>
      <style jsx>{`
        @keyframes enlargeTo80Percent {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.43);
          }
        }
        
        @keyframes enlargeBookTo80Percent {
          0% {
            transform: scale(0.75);
          }
          100% {
            transform: scale(1.1);
          }
        }
        
        @keyframes shrinkToNormal {
          0% {
            transform: scale(1.43);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes shrinkBookToNormal {
          0% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(0.75);
          }
        }
      `}</style>
      <div className="h-screen w-screen flex flex-col items-center justify-center p-0 overflow-hidden">
        {/* Storybook Page */}
        <div className="relative flex items-center justify-center w-full max-w-4xl">
            {/* Book Background Image */}
            <div className="relative w-full max-w-4xl">
               <img
                 src={getBookImage()}
                 alt="Storybook"
                 className={`w-full h-auto object-contain ${
                   currentPage === 0 
                     ? 'scale-[0.375]' 
                     : currentPage === 17 
                     ? 'scale-[0.375]' 
                     : shouldShowEnlargementAnimation() 
                     ? 'animate-[enlargeBookTo80Percent_1s_ease-out_forwards]' 
                     : shouldShowShrinkAnimation() 
                     ? 'animate-[shrinkBookToNormal_1.2s_ease-out_forwards]' 
                     : 'scale-75'
                 }`}
               />

            {/* Transparent Navigation Buttons - Connected in Center */}
             <div className="absolute inset-0 flex justify-center items-center z-30">
               <div className={`flex ${
                 currentPage === 0 || currentPage === 17 
                   ? 'w-[35%] h-[35%]' 
                   : 'w-[70%] h-[70%]'
               } ${shouldShowEnlargementAnimation() ? 'animate-[enlargeTo80Percent_1s_ease-out_forwards]' : shouldShowShrinkAnimation() ? 'animate-[shrinkToNormal_1.2s_ease-out_forwards]' : ''}`}>
                {/* Left Half Button - Previous */}
                <div 
                  className={`transition-colors rounded-l-lg relative ${
                    currentPage === 0 
                      ? 'cursor-not-allowed opacity-50 w-0' 
                      : currentPage === 17
                      ? 'cursor-pointer hover:bg-black/5 flex-1'
                      : 'cursor-pointer hover:bg-black/5 flex-1'
                  }`}
                  onClick={currentPage === 0 ? undefined : prevPage}
                  title={currentPage === 0 ? "No Previous Page" : "Previous Page"}
                >
                </div>
                
                {/* Right Half Button - Next */}
                <div 
                  className={`transition-colors rounded-r-lg relative ${
                    currentPage === 17 
                      ? 'cursor-not-allowed opacity-50 w-0' 
                      : currentPage === 0
                      ? 'cursor-pointer hover:bg-black/5 flex-1'
                      : 'cursor-pointer hover:bg-black/5 flex-1'
                  }`}
                  onClick={currentPage === 17 ? undefined : nextPage}
                  title={currentPage === 17 ? "No Next Page" : "Next Page"}
                >
                </div>
              </div>
            </div>

            
            {/* Content Overlay - Only show for middle pages */}
            {shouldShowContent() && (
              <div className="absolute inset-0 flex justify-center items-center z-10">
                 <div className={`flex w-[70%] h-[70%] ${shouldShowEnlargementAnimation() ? 'animate-[enlargeTo80Percent_1s_ease-out_forwards]' : shouldShowShrinkAnimation() ? 'animate-[shrinkToNormal_1.2s_ease-out_forwards]' : ''}`}>
                  {/* Left Page Content */}
                  <div className="flex-1 py-4 flex flex-col justify-center">
                    <div className="text-center space-y-2 ml-4 mr-8">
                      <div className="text-sm text-gray-700 leading-relaxed max-w-xs mx-auto">
                        {pages[currentPage - 1] || 'No content available'}
                      </div>
                    </div>
                  </div>

                  {/* Right Page Content */}
                  <div className="flex-1 py-4 flex flex-col justify-center">
                    <div className="text-center space-y-2 ml-8 mr-4">
                      <div className="text-sm text-gray-700 leading-relaxed max-w-xs mx-auto">
                        {pages[currentPage] || 'No content available'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Counter */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="text-xs text-gray-600">
            Page {currentPage + 1} out of {totalPages}
          </div>
        </div>
      </div>
    </>
  );
}
