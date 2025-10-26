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

  const getBackgroundStyle = () => {
    // Always use solid pale blue background
    return {
      background: '#DBEAFE'
    };
  };

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
      return "/book/book_mid.png"; // Show book_mid.png as background for title page
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
        
        @keyframes backgroundFadeToDark {
          0% {
            background-color: #DBEAFE;
          }
          100% {
            background-color: #0f172a;
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
        
        @keyframes backgroundFadeToLight {
          0% {
            background-color: #0f172a;
          }
          100% {
            background-color: #DBEAFE;
          }
        }
      `}</style>
      <div className="h-screen w-screen flex flex-col items-center p-0 overflow-hidden" style={{...getBackgroundStyle(), animation: shouldShowEnlargementAnimation() ? 'backgroundFadeToDark 1s ease-out forwards' : shouldShowShrinkAnimation() ? 'backgroundFadeToLight 1.2s ease-out forwards' : ''}}>
      <div className="max-w-4xl w-full h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-0 py-1">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Your Storybook
          </h1>
        </div>

        {/* Storybook Page */}
        <div className="relative flex-1 flex items-start justify-center pt-2">
            {/* Book Background Image */}
            <div className="relative w-full max-w-4xl">
               <img
                 src={getBookImage()}
                 alt="Storybook"
                 className={`w-full h-auto object-contain ${shouldShowEnlargementAnimation() ? 'animate-[enlargeBookTo80Percent_1s_ease-out_forwards]' : shouldShowShrinkAnimation() ? 'animate-[shrinkBookToNormal_1.2s_ease-out_forwards]' : shouldShowBookBackTransition() ? 'scale-75' : 'scale-75'}`}
               />
            
            {/* Background box for title page - extends across both buttons */}
            {currentPage === 0 && (
              <div className="absolute inset-0 flex justify-center items-center z-25">
                <div 
                  className="w-[70%] h-[70%] scale-110"
                  style={{ backgroundColor: '#DBEAFE' }}
                />
              </div>
            )}

            {/* Background box for back page - extends across both buttons */}
            {currentPage === 17 && (
              <div className="absolute inset-0 flex justify-center items-center z-25">
                <div 
                  className="w-[70%] h-[70%] scale-110"
                  style={{ backgroundColor: '#DBEAFE' }}
                />
              </div>
            )}

            {/* Transparent Navigation Buttons - Connected in Center */}
             <div className="absolute inset-0 flex justify-center items-center z-30" style={currentPage === 17 ? { transform: 'translateY(-2cm)' } : {}}>
               <div className={`flex w-[70%] h-[70%] ${shouldShowEnlargementAnimation() ? 'animate-[enlargeTo80Percent_1s_ease-out_forwards]' : shouldShowShrinkAnimation() ? 'animate-[shrinkToNormal_1.2s_ease-out_forwards]' : ''}`}>
                {/* Left Half Button - Previous */}
                <div 
                  className={`flex-1 transition-colors rounded-l-lg relative ${
                    currentPage === 0 
                      ? 'cursor-not-allowed opacity-50' 
                      : 'cursor-pointer hover:bg-black/5'
                  }`}
                  onClick={currentPage === 0 ? undefined : prevPage}
                  title={currentPage === 0 ? "No Previous Page" : "Previous Page"}
                >
                  {/* Back page image - only show on page 17 */}
                  {currentPage === 17 && (
                    <img
                      src="/book/book_back.png"
                      alt="Book Back"
                      className="absolute top-0 left-0 w-full h-auto object-contain scale-110"
                    />
                  )}
                </div>
                
                {/* Right Half Button - Next */}
                <div 
                  className={`flex-1 transition-colors rounded-r-lg relative ${
                    currentPage === 17 
                      ? 'cursor-not-allowed opacity-50' 
                      : 'cursor-pointer hover:bg-black/5'
                  }`}
                  onClick={currentPage === 17 ? undefined : nextPage}
                  title={currentPage === 17 ? "No Next Page" : "Next Page"}
                >
                  {/* Title page image - only show on page 0 */}
                  {currentPage === 0 && (
                    <img
                      src="/book/book_front.png"
                      alt="Book Front"
                      className="absolute inset-0 w-full h-full object-contain scale-110"
                    />
                  )}
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

        {/* Navigation */}
        <div className="flex justify-between items-center py-1">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            ← Prev
          </button>

                 <div className="flex space-x-1">
                   {/* Title page dot */}
                   <button
                     onClick={() => setCurrentPage(0)}
                     className={`w-1 h-1 rounded-full transition-all duration-200 ${
                       0 === currentPage 
                         ? 'bg-white' 
                         : 'bg-white/50 hover:bg-white/70'
                     }`}
                   />
                   {/* Content page dots */}
                   {Array.from({ length: 8 }, (_, index) => {
                     const pageNumber = index * 2 + 1; // 1, 3, 5, 7, 9, 11, 13, 15
                     return (
                       <button
                         key={index}
                         onClick={() => setCurrentPage(pageNumber)}
                         className={`w-1 h-1 rounded-full transition-all duration-200 ${
                           pageNumber === currentPage 
                             ? 'bg-white' 
                             : 'bg-white/50 hover:bg-white/70'
                         }`}
                       />
                     );
                   })}
                   {/* Back page dot */}
                   <button
                     onClick={() => setCurrentPage(17)}
                     className={`w-1 h-1 rounded-full transition-all duration-200 ${
                       17 === currentPage 
                         ? 'bg-white' 
                         : 'bg-white/50 hover:bg-white/70'
                     }`}
                   />
                 </div>

          <button
            onClick={nextPage}
            disabled={currentPage === 17}
            className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
