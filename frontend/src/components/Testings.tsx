'use client';

interface TestingsProps {
  onGoToEnd: () => void;
}

export default function Testings({ onGoToEnd }: TestingsProps) {
  return (
    <button
      onClick={onGoToEnd}
      className="fixed top-4 right-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-lg z-50 font-semibold"
      title="Go to the end of the storybook"
    >
      Skip to End 📖
    </button>
  );
}

