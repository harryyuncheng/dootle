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
      return "/book/book_mid.png"; // Show book_mid.png as background for back page
    } else {
      return "/book/book_mid.png";
    }
  };

  const shouldShowContent = () => {
    return currentPage > 0 && currentPage < 17;
  };

  const shouldShowPageNumbers = () => {
    return currentPage > 0 && currentPage < 17;
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center p-0 overflow-hidden" style={getBackgroundStyle()}>
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
                className="w-full h-auto object-contain scale-75"
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
            <div className="absolute inset-0 flex justify-center items-center z-30">
              <div className="flex w-[70%] h-[70%]">
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
                      className="absolute inset-0 w-full h-full object-contain scale-110"
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

            {/* Page Number Textboxes - Only show for content pages */}
            {shouldShowPageNumbers() && (
              <div className="absolute inset-0 flex z-20">
                {/* Left Page Number */}
                <div className="flex-1 flex justify-center items-start pt-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                    <span className="text-sm font-semibold text-gray-800">
                      Page {currentPage}
                    </span>
                  </div>
                </div>

                {/* Right Page Number */}
                <div className="flex-1 flex justify-center items-start pt-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                    <span className="text-sm font-semibold text-gray-800">
                      Page {currentPage + 1}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Content Overlay - Only show for middle pages */}
            {shouldShowContent() && (
              <div className="absolute inset-0 flex justify-center items-center z-10">
                <div className="flex w-[70%] h-[70%]">
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
  );
}
