import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// In-memory session store (for demo - use Redis/DB in production)
const sessions = new Map<string, {
  imageData?: string;
  colorScheme?: string[];
  description?: string;
  storyData?: {
    story: string;
    pages: string[];
    type: string;
  };
  createdAt: number;
  updatedAt: number;
}>();

// Clean up old sessions (older than 24 hours)
setInterval(() => {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.updatedAt > oneDayMs) {
      sessions.delete(sessionId);
    }
  }
}, 60 * 60 * 1000); // Run every hour

async function getSessionId(request: NextRequest): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('session_id')?.value;
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }
  
  return sessionId;
}

// GET - Retrieve session data
export async function GET(request: NextRequest) {
  const sessionId = await getSessionId(request);
  const sessionData = sessions.get(sessionId) || {
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const response = NextResponse.json(sessionData);
  response.cookies.set('session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}

// POST - Create/update session data
export async function POST(request: NextRequest) {
  const sessionId = await getSessionId(request);
  const body = await request.json();
  
  const existingData = sessions.get(sessionId) || {
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const updatedData = {
    ...existingData,
    ...body,
    updatedAt: Date.now(),
  };

  sessions.set(sessionId, updatedData);

  const response = NextResponse.json(updatedData);
  response.cookies.set('session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}

// DELETE - Clear session data
export async function DELETE(request: NextRequest) {
  const sessionId = await getSessionId(request);
  sessions.delete(sessionId);

  const response = NextResponse.json({ success: true });
  response.cookies.delete('session_id');

  return response;
}
