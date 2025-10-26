'use client';

interface DescribeStoryProps {
  isTransitioning: boolean;
  onCloudTransitionComplete: () => void;
}

/**
 * DescribeStory section component
 * This is a placeholder for future functionality where users can describe
 * the story they want to generate before creating the storybook.
 */
export default function DescribeStory({
  isTransitioning,
  onCloudTransitionComplete,
}: DescribeStoryProps) {
  return (
    <div className={`min-h-screen py-8 relative overflow-hidden transition-all duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-2xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Describe Your Story
            </h1>
            <p className="text-gray-600">
              This section is coming soon!
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-center text-gray-600">
              Future functionality: Describe the story arc, themes, and plot points you'd like to include.
            </p>
          </div>
        </div>
      </div>
  );
}
