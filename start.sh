#!/bin/bash

echo "🎨 Character Story Generator"
echo "=========================="
echo ""

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Please run this script from the dootle directory"
    exit 1
fi

# Kill any existing processes on port 3000 and 3001
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
sleep 2

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd frontend
    npm install
    cd ..
else
    echo "📦 Checking for dependency updates..."
    cd frontend
    npm update
    cd ..
fi

# Check if .env.local exists
if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  Environment file not found!"
    echo "📝 Copying environment template..."
    cp frontend/env.example frontend/.env.local
    echo ""
    echo "🔑 Please edit frontend/.env.local and add your API keys:"
    echo "   - OPENROUTER_API_KEY (required for AI story generation)"
    echo "   - ELEVENLABS_API_KEY (optional for speech-to-text)"
    echo ""
    echo "Press Enter when ready to continue..."
    read
fi

echo "🚀 Starting the application..."
echo "📍 The app will be available at: http://localhost:3001"
echo ""

cd frontend
PORT=3001 npm run dev
