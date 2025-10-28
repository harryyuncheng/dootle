'use client';

interface TestingProps {
  onGoToLibrary: () => void;
}

export default function Testing({ onGoToLibrary }: TestingProps) {
  return (
    <button
      onClick={onGoToLibrary}
      className="fixed top-4 right-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-lg z-50 font-semibold"
      title="Go to Library"
    >
      Library 📚
    </button>
  );
}

