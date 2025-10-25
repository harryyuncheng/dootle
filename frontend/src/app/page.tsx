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

  // Show main drawing interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Character Story Generator
          </h1>
          <p className="text-gray-600">
            Draw a character with multiple colors, describe them, and watch AI create a magical storybook!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Drawing and Input */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Draw Your Character
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Choose colors from the palette and adjust brush size. Your drawing's colors will create the storybook's theme!
              </p>
              <DrawingCanvas 
                onImageDataChange={handleImageDataChange}
                onColorSchemeChange={handleColorSchemeChange}
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Describe Your Character
              </h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description of your character... (e.g., 'A brave knight with a golden sword who loves adventure')"
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-4">
                <button
                  onClick={generateStory}
                  disabled={isGenerating || !imageData || !description.trim()}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
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

          {/* Right Column - Preview and Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Color Scheme Preview
              </h2>
              {colorScheme.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {colorScheme.map((color, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-lg shadow-md"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    These colors will be used for your storybook's background theme!
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🎨</div>
                  <p>Draw something to see your color scheme!</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                What You'll Get
              </h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📖</span>
                  <span>6-8 page storybook</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🎨</span>
                  <span>Your drawing integrated into each page</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🌈</span>
                  <span>Background colors from your drawing</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">✨</span>
                  <span>AI-generated story based on your description</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}