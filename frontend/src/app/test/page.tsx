'use client';

import { useState } from 'react';

// Test image
const TEST_IMAGE = 'data:image/png;base64,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';

interface StorySegment {
  type: 'text' | 'image';
  content: string;
}

function parseStoryWithImages(storyText: string): StorySegment[] {
  const segments: StorySegment[] = [];
  const regex = /\{([^}]+)\}/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(storyText)) !== null) {
    // Add text before the image
    if (match.index > lastIndex) {
      const textContent = storyText.substring(lastIndex, match.index).trim();
      if (textContent) {
        segments.push({ type: 'text', content: textContent });
      }
    }

    // Add the image
    segments.push({ type: 'image', content: match[1] });
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < storyText.length) {
    const textContent = storyText.substring(lastIndex).trim();
    if (textContent) {
      segments.push({ type: 'text', content: textContent });
    }
  }

  return segments;
}

export default function TestPage() {
  const [charDescription, setCharDescription] = useState('A curious dragon who loves reading books');
  const [storyDescription, setStoryDescription] = useState('An adventure in a magical library');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testBackend = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const res = await fetch('http://localhost:5001/api/create-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: TEST_IMAGE,
          charDescription,
          storyDescription,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Backend Test Page</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Test Configuration</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Character Description
            </label>
            <input
              type="text"
              value={charDescription}
              onChange={(e) => setCharDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Story Description (Themes)
            </label>
            <input
              type="text"
              value={storyDescription}
              onChange={(e) => setStoryDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-400">
              <strong>Endpoint:</strong> http://localhost:5001/api/create-story
            </p>
            <p className="text-sm text-gray-400">
              <strong>Image:</strong> Using test character image
            </p>
          </div>

          <button
            onClick={testBackend}
            disabled={loading}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-semibold transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Story...
              </div>
            ) : (
              'Test Backend'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Error:</h3>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Response</h2>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-green-400">
                ✓ Success: {response.success ? 'true' : 'false'}
              </h3>
              <p className="text-sm text-gray-400">
                Images found: {parseStoryWithImages(response.story).filter(s => s.type === 'image').length}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Story Preview:</h3>
              <div className="bg-white text-gray-900 rounded p-8 overflow-auto max-h-[600px]">
                {parseStoryWithImages(response.story).map((segment, index) => {
                  if (segment.type === 'image') {
                    return (
                      <div key={index} className="my-6 flex justify-center">
                        <img
                          src={segment.content}
                          alt={`Story illustration ${index}`}
                          className="max-w-full rounded-lg shadow-lg border-2 border-gray-200"
                          style={{ maxHeight: '400px' }}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <p key={index} className="mb-4 text-lg leading-relaxed">
                        {segment.content}
                      </p>
                    );
                  }
                })}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Raw Story Text:</h3>
              <div className="bg-gray-900 rounded p-4 overflow-auto max-h-96 whitespace-pre-wrap font-mono text-sm">
                {response.story}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Character:</h3>
              <p className="bg-gray-900 rounded p-4">{response.character}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Theme:</h3>
              <p className="bg-gray-900 rounded p-4">{response.theme}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Raw JSON:</h3>
              <pre className="bg-gray-900 rounded p-4 overflow-auto max-h-96 text-xs">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>

            <div className="mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(response.story);
                  alert('Story copied to clipboard!');
                }}
                className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded font-semibold transition-colors"
              >
                Copy Story to Clipboard
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>This is a test page. Delete it when done testing.</p>
          <p className="mt-2">
            <a href="/" className="text-blue-400 hover:text-blue-300 underline">
              ← Back to main app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
