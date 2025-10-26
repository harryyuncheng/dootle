'use client';

import { useState, useEffect } from 'react';
import StorybookComponent from '@/components/Storybook';

interface StorybookSectionProps {
  onBackToDrawing: () => void;
}

export default function Storybook({ onBackToDrawing }: StorybookSectionProps) {
  const [isLoading, setIsLoading] = useState(true);

  interface StorySegment {
    type: 'text' | 'image';
    content: string;
  }

  interface StoryPage {
    segments: StorySegment[];
  }

  interface StoryData {
    success: boolean;
    pages: StoryPage[];
    character: string;
    theme: string;
  }

  const [sessionData, setSessionData] = useState<{
    imageData?: string;
    colorScheme?: string[];
    storyData?: StoryData;
  }>({});

  // Load session data on mount
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const response = await fetch('/api/session');
        if (response.ok) {
          const data = await response.json();
          setSessionData(data);
        }
      } catch (err) {
        console.error('Error loading session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, []);

  const handleBackToDrawing = async () => {
    // Clear session when going back
    try {
      await fetch('/api/session', {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Error clearing session:', err);
    }

    onBackToDrawing();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading your storybook...</div>
      </div>
    );
  }

  if (!sessionData.storyData || !sessionData.imageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">No story data found. Please start over.</div>
      </div>
    );
  }

  return (
    <StorybookComponent
      pages={sessionData.storyData.pages}
      imageData={sessionData.imageData}
      colorScheme={sessionData.colorScheme || []}
      onBackToDrawing={handleBackToDrawing}
    />
  );
}
