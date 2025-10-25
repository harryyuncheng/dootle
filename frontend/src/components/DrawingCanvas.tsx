'use client';

import { useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
  onImageDataChange: (imageData: string) => void;
  onColorSchemeChange: (colors: string[]) => void;
}

const COLORS = [
  '#000000', // Black
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFC0CB', // Pink
  '#A52A2A', // Brown
  '#808080', // Gray
];

export default function DrawingCanvas({ onImageDataChange, onColorSchemeChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Set drawing styles
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [selectedColor, brushSize]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      // Convert canvas to base64 image data
      const canvas = canvasRef.current;
      if (canvas) {
        const imageData = canvas.toDataURL('image/png');
        onImageDataChange(imageData);
        
        // Extract color scheme from the drawing
        const colors = extractColorScheme(canvas);
        onColorSchemeChange(colors);
      }
    }
  };

  const extractColorScheme = (canvas: HTMLCanvasElement): string[] => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const colorCounts: { [key: string]: number } = {};

    // Sample every 10th pixel for performance
    for (let i = 0; i < data.length; i += 40) { // 4 bytes per pixel, sample every 10th pixel
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];

      // Skip transparent or white pixels
      if (alpha < 128 || (r > 240 && g > 240 && b > 240)) continue;

      const rgb = `rgb(${r},${g},${b})`;
      colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
    }

    // Get top 5 most used colors
    const sortedColors = Object.entries(colorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([color]) => color);

    return sortedColors.length > 0 ? sortedColors : ['#FFD700', '#FF6B6B', '#4ECDC4']; // Default colors
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
    onImageDataChange('');
    onColorSchemeChange([]);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Color Palette */}
      <div className="flex flex-wrap gap-2 justify-center">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-8 h-8 rounded-full border-2 ${
              selectedColor === color ? 'border-gray-800' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {/* Brush Size */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Brush Size:</span>
        <input
          type="range"
          min="1"
          max="10"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-20"
        />
        <span className="text-sm text-gray-600">{brushSize}px</span>
      </div>

      {/* Canvas */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <canvas
          ref={canvasRef}
          className="cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      {/* Controls */}
      <div className="flex space-x-4">
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Clear Canvas
        </button>
        {hasDrawing && (
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
            ✓ Drawing saved
          </span>
        )}
      </div>
    </div>
  );
}
