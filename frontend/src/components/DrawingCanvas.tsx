'use client';

import { useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
  onImageDataChange: (imageData: string) => void;
  onColorSchemeChange: (colors: string[]) => void;
}

const BASE_COLORS = [
  '#000000', // Black
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
];

const ADDITIONAL_COLORS = [
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFC0CB', // Pink
  '#A52A2A', // Brown
  '#808080', // Gray
  '#FFD700', // Gold
  '#FF69B4', // Hot Pink
  '#32CD32', // Lime Green
  '#4169E1', // Royal Blue
  '#FF4500', // Orange Red
  '#9370DB', // Medium Purple
  '#20B2AA', // Light Sea Green
  '#FF6347', // Tomato
  '#8A2BE2', // Blue Violet
];

const BRUSH_SIZES = [2, 5, 10];

export default function DrawingCanvas({ onImageDataChange, onColorSchemeChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [availableColors, setAvailableColors] = useState<string[]>(BASE_COLORS);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size only once
    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = 400;
      canvas.height = 400;
      
      // Fill with white background only on first load
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Set drawing styles
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
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

  const addColor = (color: string) => {
    if (!availableColors.includes(color)) {
      setAvailableColors([...availableColors, color]);
    }
    setSelectedColor(color);
    setShowColorPicker(false);
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
    <div className="flex flex-col items-center space-y-6">
      {/* Color Palette */}
      <div className="w-full">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">Color Palette</h3>
        <div className="flex justify-center items-center gap-3">
          {/* Base Colors */}
          {availableColors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-12 h-12 rounded-lg border-3 shadow-sm hover:shadow-md transition-all duration-200 ${
                selectedColor === color 
                  ? 'border-gray-800 scale-110 shadow-lg' 
                  : 'border-gray-300 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          
          {/* Add Color Button */}
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-12 h-12 rounded-lg border-3 border-gray-300 bg-gray-100 hover:bg-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center text-gray-600 font-bold text-lg"
            title="Add more colors"
          >
            +
          </button>
        </div>
        
        {/* Additional Colors Dropdown */}
        {showColorPicker && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Choose a color to add:</h4>
            <div className="grid grid-cols-6 gap-2">
              {ADDITIONAL_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => addColor(color)}
                  className={`w-8 h-8 rounded-lg border-2 shadow-sm hover:shadow-md transition-all duration-200 ${
                    availableColors.includes(color)
                      ? 'border-green-500 opacity-50 cursor-not-allowed'
                      : 'border-gray-300 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                  disabled={availableColors.includes(color)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Brush Size Buttons */}
      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
        <span className="text-sm font-medium text-gray-700">Brush Size:</span>
        <div className="flex space-x-2">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                brushSize === size
                  ? 'bg-blue-500 border-blue-600 shadow-md'
                  : 'bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400'
              }`}
              title={`${size}px brush`}
            >
              <div 
                className={`rounded-full ${
                  brushSize === size ? 'bg-white' : 'bg-gray-600'
                }`}
                style={{ 
                  width: `${Math.max(2, size * 2)}px`, 
                  height: `${Math.max(2, size * 2)}px` 
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="border-3 border-gray-300 rounded-xl overflow-hidden shadow-xl bg-white">
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
      <div className="flex justify-center">
        <button
          onClick={clearCanvas}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
}
