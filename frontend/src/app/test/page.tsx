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
