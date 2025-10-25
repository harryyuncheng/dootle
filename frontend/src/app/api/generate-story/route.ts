import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { imageData, description } = await request.json();

    if (!imageData || !description) {
      return NextResponse.json(
        { error: 'Image data and description are required' },
        { status: 400 }
      );
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    // Generate story using OpenRouter with Google Gemini
    if (OPENROUTER_API_KEY) {
      try {
        const prompt = `Create a children's storybook with 6-8 pages about a character based on this description: "${description.trim()}". 

Structure the story as follows:
- Page 1: Introduction of the character
- Page 2-3: The character's world and daily life
- Page 4-5: An adventure or challenge begins
- Page 6-7: The character faces obstacles and learns something important
- Page 8: A happy ending with a lesson learned

Each page should be 2-3 sentences long, suitable for children ages 4-8. Make it creative, engaging, and include elements of friendship, courage, or discovery.`;

        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'google/gemini-flash-1.5',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 1000,
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:3000',
              'X-Title': 'Character Story Generator'
            }
          }
        );

        const story = response.data.choices[0]?.message?.content || 'Unable to generate story at this time.';
        
        // Parse the story into pages
        const pages = parseStoryIntoPages(story);
        
        return NextResponse.json({ 
          story: story,
          pages: pages,
          type: 'storybook'
        });
      } catch (error) {
        console.error('Error calling OpenRouter API:', error);
        // Fall back to mock story
      }
    }

    // Fallback mock story if API key is not configured
    const mockStory = `Page 1: Once upon a time, there was a wonderful character who embodied the spirit of "${description.trim()}". This character lived in a magical world full of possibilities.

Page 2: Every day, our character would explore their colorful world, meeting new friends and discovering amazing places. They loved to help others and always had a smile on their face.

Page 3: One sunny morning, our character noticed something unusual in their favorite garden. A small, lost creature was crying softly under a big tree.

Page 4: The character approached gently and asked, "Why are you so sad, little friend?" The creature explained they were lost and couldn't find their way home.

Page 5: Our brave character decided to help! They searched through forests, crossed streams, and climbed hills to find the creature's family.

Page 6: Along the way, they met many helpful animals who joined their quest. Together, they formed a wonderful team of friends.

Page 7: Finally, after many adventures, they found the creature's home! The family was overjoyed and thanked our character for their kindness.

Page 8: Our character learned that helping others brings the greatest joy. They returned home with new friends and wonderful memories, knowing that kindness makes the world a better place.`;

    const pages = parseStoryIntoPages(mockStory);
    
    return NextResponse.json({ 
      story: mockStory,
      pages: pages,
      type: 'storybook'
    });

  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}

function parseStoryIntoPages(story: string): string[] {
  const pageRegex = /Page \d+:/g;
  const pages = story.split(pageRegex).filter(page => page.trim().length > 0);
  return pages.map(page => page.trim()).filter(page => page.length > 0);
}
