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

  const getBackgroundStyle = () => {
    if (colorScheme.length === 0) {
      return {
        background: 'linear-gradient(135deg, #FFD700 0%, #FF6B6B 50%, #4ECDC4 100%)'
      };
    }

    // Create gradient from the color scheme
    const gradientStops = colorScheme.map((color, index) => 
      `${color} ${(index / (colorScheme.length - 1)) * 100}%`
    ).join(', ');

    return {
      background: `linear-gradient(135deg, ${gradientStops})`
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
            📚 Your Storybook
          </h1>
          <p className="text-white/90 text-lg">
            Page {currentPage + 1} of {pages.length}
          </p>
        </div>

        {/* Storybook Page */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px]">
          <div className="flex h-full">
            {/* Left Page - Text */}
            <div className="flex-1 p-8 flex flex-col justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Page {currentPage + 1}
                </h2>
                <div className="text-lg text-gray-700 leading-relaxed max-w-lg mx-auto">
                  {pages[currentPage] || 'Loading...'}
                </div>
              </div>
            </div>

            {/* Right Page - Character Image */}
            <div className="flex-1 p-8 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="mb-4">
                  <img
                    src={imageData}
                    alt="Your Character"
                    className="max-w-full max-h-80 object-contain rounded-lg shadow-lg"
                  />
                </div>
                <p className="text-sm text-gray-600 italic">
                  Your Character
                </p>
              </div>
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
            🎨 Create Another Story
          </button>
        </div>
      </div>
    </div>
  );
}
