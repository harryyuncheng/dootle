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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    <div className="min-h-screen flex items-center justify-center p-4" style={getBackgroundStyle()}>
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
            Your Storybook
          </h1>
          <div className="flex items-center justify-center gap-4">
            <p className="text-white/90 text-lg">
              Page {currentPage + 1} of {pages.length}
            </p>
            <button
              onClick={readAloud}
              disabled={isLoadingAudio}
              className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
