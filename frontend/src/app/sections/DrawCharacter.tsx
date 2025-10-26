'use client';

import { useState, useRef } from 'react';
import DrawingCanvas, { DrawingCanvasRef } from '@/components/DrawingCanvas';

interface DrawCharacterProps {
  onNext: () => void;
}

export default function DrawCharacter({ onNext }: DrawCharacterProps) {
  const [imageData, setImageData] = useState('');
  const [colorScheme, setColorScheme] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<DrawingCanvasRef>(null);

  const handleImageDataChange = (data: string) => {
    setImageData(data);
    setError(''); // Clear error when drawing
  };

  const handleColorSchemeChange = (colors: string[]) => {
    setColorScheme(colors);
  };

  const handleClearCanvas = () => {
    canvasRef.current?.clearCanvas();
    setError(''); // Clear any errors when clearing canvas
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
    <div className="min-h-screen py-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {/* Centered container for entire drawing interface */}
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col items-center">
              <div className="text-center mb-2">
                <h1 className="text-4xl font-bold text-gray-800">
                  Draw Your Character
                </h1>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
                <DrawingCanvas 
                  ref={canvasRef}
                  onImageDataChange={handleImageDataChange}
                  onColorSchemeChange={handleColorSchemeChange}
                />
                
                {error && (
                  <div className="mt-6 bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={handleNext}
                    disabled={!imageData || isSaving}
                    className="py-3 px-8 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 enabled:bg-black enabled:hover:bg-gray-800"
                  >
                    {isSaving ? 'Saving...' : 'Next →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
