'use client';

import { useState, useEffect } from 'react';
import StorybookComponent from '@/components/Storybook';
import CloudTransition from '@/components/CloudTransition';

interface StorybookSectionProps {
  onBackToDrawing: () => void;
}

export default function Storybook({ onBackToDrawing }: StorybookSectionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCloudTransition, setShowCloudTransition] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState<{
    imageData?: string;
    colorScheme?: string[];
    storyData?: {
      story: string;
      pages: string[];
      type: string;
    };
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

    setIsTransitioning(true);
    setShowCloudTransition(true);
  };

  const handleCloudTransitionComplete = () => {
    setShowCloudTransition(false);
    setIsTransitioning(false);
    onBackToDrawing();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-gray-600">Loading your storybook...</div>
      </div>
    );
  }

  if (!sessionData.storyData || !sessionData.imageData) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-gray-600">No story data found. Please start over.</div>
      </div>
    );
  }

  return (
    <>
      <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <StorybookComponent
          pages={sessionData.storyData.pages}
          imageData={sessionData.imageData}
          colorScheme={sessionData.colorScheme || []}
          onBackToDrawing={handleBackToDrawing}
        />
      </div>
      <CloudTransition 
        isVisible={showCloudTransition} 
        onComplete={handleCloudTransitionComplete}
      />
    </>
  );
}
