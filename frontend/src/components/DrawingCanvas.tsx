'use client';

import { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';

interface DrawingCanvasProps {
  onImageDataChange: (imageData: string) => void;
  onColorSchemeChange: (colors: string[]) => void;
  canvasRef?: React.RefObject<{ clearCanvas: () => void }>;
}

export interface DrawingCanvasRef {
  clearCanvas: () => void;
}

const BASE_COLORS = [
  '#000000', // Black
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
];

const BRUSH_SIZES = [2, 4, 7];
const MAX_COLORS = 6;

const DrawingCanvas = forwardRef<DrawingCanvasRef, Omit<DrawingCanvasProps, 'canvasRef'>>((
  { onImageDataChange, onColorSchemeChange }, 
  ref
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);
  const [brushSize, setBrushSize] = useState(4);
  const [availableColors, setAvailableColors] = useState<string[]>(BASE_COLORS);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [tempColor, setTempColor] = useState('#ff0000');
  const saturationBoxRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const colorPickerButtonRef = useRef<HTMLButtonElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set drawing styles
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
    }
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [selectedColor, brushSize, isEraser]);

  // Initialize canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

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

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = selectedColor;
    }
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
    // Replace the currently selected color with the new color
    const colorIndex = availableColors.indexOf(selectedColor);
    if (colorIndex !== -1) {
      const newColors = [...availableColors];
      newColors[colorIndex] = color;
      setAvailableColors(newColors);
    }
    setSelectedColor(color);
    setShowColorPicker(false);
  };

  const confirmColor = () => {
    addColor(tempColor);
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const updateTempColor = useCallback((h: number, s: number, l: number) => {
    const hex = hslToHex(h, s, l);
    setTempColor(hex);
  }, []);

  const handleSaturationBoxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = saturationBoxRef.current;
    if (!box) return;
    
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSaturation = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newLightness = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
    
    setSaturation(newSaturation);
    setLightness(newLightness);
    updateTempColor(hue, newSaturation, newLightness);
  };

  const handleSaturationBoxMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSaturationBoxClick(e);
  };

  const handleSaturationBoxMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleSaturationBoxClick(e);
  };

  const handleSaturationBoxMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showColorPicker &&
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node) &&
        colorPickerButtonRef.current &&
        !colorPickerButtonRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker]);

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseInt(e.target.value);
    setHue(newHue);
    updateTempColor(newHue, saturation, lightness);
  };

  useEffect(() => {
    updateTempColor(hue, saturation, lightness);
  }, [hue, saturation, lightness, updateTempColor]);

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
    setShowClearConfirm(false);
  };

  const handleClearClick = () => {
    if (hasDrawing) {
      setShowClearConfirm(true);
    } else {
      clearCanvas();
    }
  };

  // Expose clearCanvas method to parent
  useImperativeHandle(ref, () => ({
    clearCanvas
  }));

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Color Palette and Brush Size */}
      <div className="w-full relative">
        <div className="flex justify-center items-center gap-3">
          {/* Pen Button */}
          <button
            onClick={() => setIsEraser(false)}
            className="transition-all duration-200 flex items-center justify-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`w-5 h-5 transition-colors ${
                !isEraser ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
              <path d="M2 2l7.586 7.586"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
          </button>
          
          {/* Eraser Button */}
          <button
            onClick={() => {
              setIsEraser(true);
              // Keep selectedColor unchanged for concurrency purposes
            }}
            className="transition-all duration-200 flex items-center justify-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`w-5 h-5 transition-colors ${
                isEraser ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <path d="M20 20H7L3 16L12 7L17 12M11 13L17 19" />
            </svg>
          </button>
          
          {/* Color Palette */}
          <div className="flex items-center gap-3">
            {/* Base Colors */}
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  setIsEraser(false);
                }}
                className={`w-6 h-6 rounded-full shadow-sm transition-all duration-200 ${
                  selectedColor === color
                    ? 'border-[3px] border-blue-500' 
                    : 'border-[3px] border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            
            {/* Add Color Button */}
            <button
              ref={colorPickerButtonRef}
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-6 h-6 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center hover:scale-105 relative"
              style={{
                background: 'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
              }}
            >
              <span className="text-white font-bold text-sm drop-shadow-lg">+</span>
            </button>
          </div>
          
          {/* Brush Sizes */}
          <div className="flex items-center gap-3">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className="flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <div 
                  className={`rounded-full transition-all ${
                    brushSize === size ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                  style={{ 
                    width: '20px',
                    height: `${size}px`,
                    borderRadius: `${size / 2}px`
                  }}
                />
              </button>
            ))}
          </div>
          
          {/* Clear Canvas */}
          <button
            onClick={handleClearClick}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            clear canvas
          </button>
        </div>
        
        {/* Clear Confirmation Popup */}
        {showClearConfirm && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={clearCanvas}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Gradient Color Picker */}
        {showColorPicker && (
          <div 
            ref={colorPickerRef}
            className="absolute top-full mt-2 p-4 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            style={{
              left: colorPickerButtonRef.current 
                ? `${colorPickerButtonRef.current.offsetLeft + colorPickerButtonRef.current.offsetWidth / 2}px`
                : '50%',
              transform: 'translateX(-50%)'
            }}
          >
            {/* Exit Button */}
            <button
              onClick={() => confirmColor()}
              className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm transition-colors"
              title="Close and confirm color"
            >
              ×
            </button>
            
            <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Pick a color</h4>
            
            <div className="space-y-3">
              {/* Saturation/Lightness Box */}
              <div 
                ref={saturationBoxRef}
                onMouseDown={handleSaturationBoxMouseDown}
                onMouseMove={handleSaturationBoxMouseMove}
                onMouseUp={handleSaturationBoxMouseUp}
                className="relative w-48 h-48 cursor-crosshair rounded select-none"
                style={{
                  background: `
                    linear-gradient(to top, black, transparent),
                    linear-gradient(to right, white, hsl(${hue}, 100%, 50%))
                  `
                }}
              >
                {/* Selector Circle */}
                <div
                  className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
                  style={{
                    left: `${saturation}%`,
                    top: `${100 - lightness}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>
              
              {/* Hue Bar */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={handleHueChange}
                  className="w-full h-5 appearance-none cursor-pointer rounded"
                  style={{
                    background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                  }}
                />
              </div>
              
              {/* Color Preview and Confirm */}
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-300"
                  style={{ backgroundColor: tempColor }}
                />
                <button
                  onClick={confirmColor}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="border-3 border-gray-300 rounded-xl overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;