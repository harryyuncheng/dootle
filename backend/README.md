# Dootle Backend API

This is the Flask backend for Dootle, a children's storybook generation service.

## API Endpoints

### POST `/api/create-story`

Generates a children's storybook with AI-generated text and images.

#### Request Body

```json
{
  "image": "data:image/png;base64,...",
  "charDescription": "A curious dragon who loves reading books",
  "storyDescription": "An adventure in a magical library"
}
```

**Fields:**
- `image` (required): Base64-encoded image of the character drawn by the user
- `charDescription` (required): Text description of the character
- `storyDescription` (required): Description of the story themes/plot

#### Response Format

```json
{
  "success": true,
  "pages": [
    {
      "segments": [
        {
          "type": "text",
          "content": "Story Title: Luna's Magical Library Adventure"
        },
        {
          "type": "image",
          "content": "data:image/png;base64,..."
        },
        {
          "type": "text",
          "content": "Once upon a time, in a land far away..."
        }
      ]
    },
    {
      "segments": [
        {
          "type": "image",
          "content": "data:image/png;base64,..."
        },
        {
          "type": "text",
          "content": "The dragon entered the library..."
        }
      ]
    }
  ],
  "character": "A curious dragon who loves reading books",
  "theme": "An adventure in a magical library"
}
```

#### Response Structure

**Root Level:**
- `success` (boolean): Whether the story generation was successful
- `pages` (array): Array of page objects
- `character` (string): The character description from the request
- `theme` (string): The story description from the request

**Page Object:**
- `segments` (array): Array of segment objects representing the content on this page

**Segment Object:**
- `type` (string): Either `"text"` or `"image"`
- `content` (string):
  - If `type` is `"text"`: The text content to display
  - If `type` is `"image"`: Base64-encoded image URL (e.g., `"data:image/png;base64,..."`)

#### Story Structure

The story is organized into pages following this pattern:
- **Page 0 (Cover)**: Usually contains the title, tagline, and cover illustration
- **Pages 1-N**: Story pages with narrative text and illustrations

Each page can have multiple segments that alternate or combine text and images in any order.

#### Example Usage

```python
import requests

response = requests.post('http://localhost:5001/api/create-story', json={
    "image": "data:image/png;base64,iVBORw0KGgo...",
    "charDescription": "A brave knight with a golden sword",
    "storyDescription": "A quest to save the kingdom"
})

data = response.json()

# Iterate through pages
for i, page in enumerate(data['pages']):
    print(f"Page {i}:")

    # Iterate through segments on each page
    for segment in page['segments']:
        if segment['type'] == 'text':
            print(f"  Text: {segment['content']}")
        elif segment['type'] == 'image':
            print(f"  Image: [base64 data]")
```

#### Error Response

```json
{
  "error": "Missing required fields. Need: image, charDescription, storyDescription"
}
```

## Story Generation Process

1. **User Input**: Character image (base64) + descriptions
2. **Claude Analysis**: Claude analyzes the image and generates story with placeholder descriptions
3. **Image Generation**:
   - First placeholder generates the **cover image** (with strict style preservation)
   - Subsequent images use both the user's drawing AND the cover for consistency
4. **Parsing**: Story is parsed into structured pages and segments
5. **Response**: Structured JSON returned to client

## Configuration

- `MAX_IMAGES`: Maximum number of images per story (default: 5)
- Story prompt template: `story-prompt.txt`

## Environment Variables

Create a `.env` file:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Running the Server

```bash
cd backend
uv run python main.py
```

Server runs on `http://localhost:5001` by default.
