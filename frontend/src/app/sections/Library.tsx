'use client';

interface LibraryProps {
  onBack: () => void;
}

export default function Library({ onBack }: LibraryProps) {
  return (
    <div className="min-h-screen bg-blue-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your Library
          </h1>
          <p className="text-gray-600">
            All your storybooks in one place
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 min-h-[400px] flex items-center justify-center">
          {/* Library content will be displayed here */}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-200"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
