'use client';

import { useState } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';

interface DrawCharacterProps {
  onNext: () => void;
}

export default function DrawCharacter({ onNext }: DrawCharacterProps) {
  const [imageData, setImageData] = useState('');
  const [colorScheme, setColorScheme] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleImageDataChange = (data: string) => {
    setImageData(data);
    setError(''); // Clear error when drawing
  };

  const handleColorSchemeChange = (colors: string[]) => {
    setColorScheme(colors);
  };

  const handleNext = async () => {
    if (!imageData) {
      setError('Please draw a character first!');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Save to session
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData, colorScheme }),
      });

      if (!response.ok) {
        throw new Error('Failed to save drawing');
      }

      // Navigate to next page after successful save
      onNext();
    } catch (err) {
      setError('Failed to save your drawing. Please try again.');
      console.error('Error saving drawing:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-blue-100 py-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
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
                  onClick={handleNext}
                  disabled={!imageData || isSaving}
                  className="py-3 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isSaving ? 'Saving...' : 'Next →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
