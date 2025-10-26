'use client';

import { useState, useRef } from 'react';

interface StorySegment {
  type: 'text' | 'image';
  content: string;
}

interface StoryPage {
  segments: StorySegment[];
}

interface StorybookProps {
  pages: StoryPage[];
  imageData: string;
  colorScheme: string[];
  onBackToDrawing: () => void;
}

export default function Storybook({ pages, imageData, colorScheme, onBackToDrawing }: StorybookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 18; // Total pages including start and end
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const getBackgroundStyle = () => {
    // Use default background from globals
    return {};
  };

  const readAloud = async () => {
    // Stop current audio if playing
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsLoadingAudio(true);

      // Collect all text from current page
      const pageText = pages[currentPage]?.segments
        .filter(segment => segment.type === 'text')
        .map(segment => segment.content)
        .join(' ');

      if (!pageText) {
        console.error('No text to read on this page');
        setIsLoadingAudio(false);
        return;
      }

      // Call backend text-to-speech endpoint
      const response = await fetch('http://localhost:5001/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: pageText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      // Get audio blob and create URL
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsPlayingAudio(true);
        setIsLoadingAudio(false);
      };

      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        setIsLoadingAudio(false);
        console.error('Error playing audio');
      };

      await audio.play();
    } catch (error) {
      console.error('Error generating speech:', error);
      setIsLoadingAudio(false);
      setIsPlayingAudio(false);
    }
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
      <div className="h-screen w-screen flex flex-col items-center justify-center p-0 overflow-hidden" style={getBackgroundStyle()}>
      <div className="max-w-4xl w-full h-full flex flex-col items-center justify-center">
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
                    {pages[currentPage]?.segments.map((segment, index) => (
                        <div key={index} className="flex justify-center">
                          {segment.type === 'text' ? (
                            <div className="text-sm text-gray-700 leading-relaxed text-center">
                              {segment.content}
                            </div>
                          ) : (
                            <img
                              src={segment.content}
                              alt={`Story illustration ${index + 1}`}
                              className="max-w-full max-h-48 object-contain rounded-lg"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Page Content */}
                  <div className="flex-1 py-4 flex flex-col justify-center">
                    <div className="text-center space-y-2 ml-8 mr-4">
                    {pages[currentPage + 1]?.segments.map((segment, index) => (
                        <div key={index} className="flex justify-center">
                          {segment.type === 'text' ? (
                            <div className="text-sm text-gray-700 leading-relaxed text-center">
                              {segment.content}
                            </div>
                          ) : (
                            <img
                              src={segment.content}
                              alt={`Story illustration ${index + 1}`}
                              className="max-w-full max-h-48 object-contain rounded-lg"
                            />
                          )}
                        </div>
                      ))}
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

        {/* Speech Button - Positioned in bottom right corner */}
        {/* Adjust position by modifying bottom and right values */}
        <button
          onClick={readAloud}
          disabled={isLoadingAudio}
          className="fixed p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg z-50"
          style={{ bottom: '2rem', right: '2rem' }}
          title={isPlayingAudio ? "Stop reading" : "Read aloud"}
        >
          {isLoadingAudio ? (
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isPlayingAudio ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
    </>
  );
}
