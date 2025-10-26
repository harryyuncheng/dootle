'use client';

import { useState, useEffect } from 'react';

interface DescribeCharacterProps {
  onBack: () => void;
  onStoryGenerated: () => void;
}

export default function DescribeCharacter({
  onBack,
  onStoryGenerated,
}: DescribeCharacterProps) {
  const [imageData, setImageData] = useState('');
  const [charDescription, setCharDescription] = useState('');
  const [storyTheme, setStoryTheme] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load session data on mount
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const response = await fetch('/api/session');
        if (response.ok) {
          const data = await response.json();
          if (data.imageData) {
            setImageData(data.imageData);
          }
          if (data.charDescription) {
            setCharDescription(data.charDescription);
          }
          if (data.storyTheme) {
            setStoryTheme(data.storyTheme);
          }
        }
      } catch (err) {
        console.error('Error loading session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, []);

  const handleBack = () => {
    setIsTransitioning(true);
  };

  const generateStory = async () => {
    if (!imageData) {
      setError('Please draw a character first!');
      return;
    }

    if (!charDescription.trim()) {
      setError('Please provide a character description!');
      return;
    }

    if (!storyTheme.trim()) {
      setError('Please provide a story theme!');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Save descriptions to session
      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          charDescription: charDescription.trim(),
          storyTheme: storyTheme.trim()
        }),
      });

      // Call the backend API to generate the story
      const response = await fetch('http://localhost:5001/api/create-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          charDescription: charDescription.trim(),
          storyDescription: storyTheme.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();

      // Save story data to session
      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyData: data }),
      });

      // Start cloud transition for story generation
      setIsTransitioning(true);
      
      // Navigate after transition starts
      setTimeout(() => {
        onStoryGenerated();
      }, 100);
    } catch (err) {
      setError('Failed to generate story. Please try again.');
      console.error('Error generating story:', err);
      setIsGenerating(false);
    }
  };

  const handleCloudTransitionComplete = () => {
    setIsTransitioning(false);
    
    // If we're not generating (i.e., going back), trigger the back callback
    if (!isGenerating) {
      onBack();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen bg-blue-100 py-8 relative overflow-hidden transition-all duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-2xl mx-auto px-4 relative z-10">
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
                {imageData ? (
                  <img
                    src={imageData}
                    alt="Your Character"
                    className="max-w-xs max-h-48 object-contain rounded-lg shadow-md border-2 border-gray-200"
                  />
                ) : (
                  <div className="text-gray-400">No drawing found</div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Character Description
              </h2>
              <textarea
                value={charDescription}
                onChange={(e) => setCharDescription(e.target.value)}
                placeholder="Describe your character... (e.g., 'A curious dragon who loves reading books')"
                className="w-full h-24 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Story Theme
              </h2>
              <textarea
                value={storyTheme}
                onChange={(e) => setStoryTheme(e.target.value)}
                placeholder="What should the story be about? (e.g., 'An adventure in a magical library')"
                className="w-full h-24 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="mb-6 bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleBack}
                className="flex-1 py-3 px-6 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                ← Back to Drawing
              </button>
              <button
                onClick={generateStory}
                disabled={isGenerating || !charDescription.trim() || !storyTheme.trim()}
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
    </>
  );
}
