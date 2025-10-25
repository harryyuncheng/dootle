'use client';

import { useState } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';
import Storybook from '@/components/Storybook';

export default function Home() {
  const [description, setDescription] = useState('');
  const [imageData, setImageData] = useState('');
  const [colorScheme, setColorScheme] = useState<string[]>([]);
  const [storyData, setStoryData] = useState<{
    story: string;
    pages: string[];
    type: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showStorybook, setShowStorybook] = useState(false);
  const [currentPage, setCurrentPage] = useState<'drawing' | 'input'>('drawing');

  const handleImageDataChange = (data: string) => {
    setImageData(data);
  };

  const handleColorSchemeChange = (colors: string[]) => {
    setColorScheme(colors);
  };

  const generateStory = async () => {
    if (!imageData) {
      setError('Please draw a character first!');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a description!');
      return;
    }

    setIsGenerating(true);
    setError('');
    setStoryData(null);

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      setStoryData(data);
      setShowStorybook(true);
    } catch (err) {
      setError('Failed to generate story. Please try again.');
      console.error('Error generating story:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const backToDrawing = () => {
    setShowStorybook(false);
    setStoryData(null);
    setImageData('');
    setDescription('');
    setColorScheme([]);
    setError('');
    setCurrentPage('drawing');
  };

  const goToInputPage = () => {
    if (!imageData) {
      setError('Please draw a character first!');
      return;
    }
    setCurrentPage('input');
    setError('');
  };

  const goBackToDrawing = () => {
    setCurrentPage('drawing');
    setError('');
  };

  // Show storybook if story is generated
  if (showStorybook && storyData) {
    return (
      <Storybook
        pages={storyData.pages}
        imageData={imageData}
        colorScheme={colorScheme}
        onBackToDrawing={backToDrawing}
      />
    );
  }

  // Show input page
  if (currentPage === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Describe Your Character
            </h1>
            <p className="text-gray-600">
              Tell us about your character and the story you'd like to create!
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Drawing
              </h2>
              <div className="flex justify-center">
                <img
                  src={imageData}
                  alt="Your Character"
                  className="max-w-xs max-h-48 object-contain rounded-lg shadow-md border-2 border-gray-200"
                />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Character Description
              </h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description of your character... (e.g., 'A brave knight with a golden sword who loves adventure')"
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="mb-6 bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={goBackToDrawing}
                className="flex-1 py-3 px-6 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                ← Back to Drawing
              </button>
              <button
                onClick={generateStory}
                disabled={isGenerating || !description.trim()}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Your Storybook...
                  </div>
                ) : (
                  '📚 Generate Storybook'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show main drawing interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Draw Your Character
          </h1>
          <p className="text-gray-600">
            Use the color palette to draw your character. Click Next when you're ready to describe them!
          </p>
        </div>

        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <DrawingCanvas 
              onImageDataChange={handleImageDataChange}
              onColorSchemeChange={handleColorSchemeChange}
            />
            
            {error && (
              <div className="mt-6 bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={goToInputPage}
                disabled={!imageData}
                className="py-3 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}