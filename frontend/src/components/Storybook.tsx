'use client';

import { useState } from 'react';

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

  const getBackgroundStyle = () => {
    // Always use solid pale blue background
    return {
      background: '#DBEAFE'
    };
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={getBackgroundStyle()}>
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
            Your Storybook
          </h1>
          <p className="text-white/90 text-lg">
            Page {currentPage + 1} of {pages.length}
          </p>
        </div>

        {/* Storybook Page */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px]">
          <div className="p-8 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {currentPage === 0 ? 'Cover' : `Page ${currentPage}`}
            </h2>

            {/* Render segments */}
            <div className="w-full max-w-2xl space-y-6">
              {pages[currentPage]?.segments.map((segment, index) => (
                <div key={index} className="flex justify-center">
                  {segment.type === 'text' ? (
                    <div className="text-lg text-gray-700 leading-relaxed text-center">
                      {segment.content}
                    </div>
                  ) : (
                    <img
                      src={segment.content}
                      alt={`Story illustration ${index + 1}`}
                      className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
          >
            ← Previous
          </button>

          <div className="flex space-x-2">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentPage 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
          >
            Next →
          </button>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={onBackToDrawing}
            className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 font-semibold"
          >
            Create Another Story
          </button>
        </div>
      </div>
    </div>
  );
}
