from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os
import requests
import re

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
MAX_IMAGES = 5  # Maximum number of images to generate per story

# Initialize OpenRouter client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def load_story_prompt():
    """Load the story prompt template from file."""
    prompt_path = os.path.join(os.path.dirname(__file__), 'story-prompt.txt')
    with open(prompt_path, 'r') as f:
        return f.read()

def extract_image_placeholders(story_text):
    """Extract all {description} placeholders from the story."""
    pattern = r'\{([^\}]+)\}'
    matches = re.findall(pattern, story_text)
    return matches

def generate_image_with_gemini(description, reference_image_base64, char_description, cover_image_base64=None, is_cover=False):
    """Generate an image using Gemini based on description and reference images."""
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json"
    }

    # Special prompt for cover to preserve original style
    if is_cover:
        prompt = f"""Generate an image that matches this description: {description}

Character context: {char_description}

CRITICAL: The reference image shows the character's art style. You MUST preserve this EXACT art style in your generation:
- If it's a stick figure, keep it as a stick figure
- If it's a simple sketch, keep it as a simple sketch
- If it's minimalist, keep it minimalist
- Do NOT make it more detailed or "polished" than the original
- Match the line weight, simplicity level, and drawing technique exactly

Think of this as a style transfer - the character and style from the reference image should be recognizable in your output."""
    else:
        # Standard prompt for non-cover images
        prompt = f"""Generate an image that matches this description: {description}

Character context: {char_description}

The character should match the style and appearance of the reference image(s) provided."""

        if cover_image_base64:
            prompt += " Maintain the art style consistent with the cover image provided."

    # Build content array with text and images
    content = [
        {
            "type": "text",
            "text": prompt
        },
        {
            "type": "image_url",
            "image_url": {
                "url": reference_image_base64
            }
        }
    ]

    # Add cover image if provided (for non-cover images)
    if cover_image_base64:
        content.append({
            "type": "image_url",
            "image_url": {
                "url": cover_image_base64
            }
        })

    payload = {
        "model": "google/gemini-2.5-flash-image",
        "messages": [
            {
                "role": "user",
                "content": content
            }
        ],
        "modalities": ["image", "text"],
        "image_config": {
            "aspect_ratio": "16:9"
        }
    }

    response = requests.post(url, headers=headers, json=payload)
    result = response.json()

    if result.get("choices"):
        message = result["choices"][0]["message"]
        if message.get("images") and len(message["images"]) > 0:
            return message["images"][0]["image_url"]["url"]

    return None

def parse_page_segments(page_text):
    """Parse a page's text into segments of text and images."""
    segments = []
    pattern = r'\{([^}]+)\}'
    last_index = 0

    for match in re.finditer(pattern, page_text):
        # Add text before the image
        if match.start() > last_index:
            text_content = page_text[last_index:match.start()].strip()
            if text_content:
                segments.append({"type": "text", "content": text_content})

        # Add the image
        segments.append({"type": "image", "content": match.group(1)})
        last_index = match.end()

    # Add remaining text
    if last_index < len(page_text):
        text_content = page_text[last_index:].strip()
        if text_content:
            segments.append({"type": "text", "content": text_content})

    return segments

def parse_story_into_pages(story_text):
    """Parse the story into structured pages with segments."""
    pages = []

    # Split by page markers (Cover, Page 1, Page 2, etc.)
    page_pattern = r'(?:Cover:|Page \d+:)'
    page_splits = re.split(page_pattern, story_text)

    # Remove empty first element if present
    if page_splits and not page_splits[0].strip():
        page_splits = page_splits[1:]

    # Parse each page into segments
    for page_content in page_splits:
        if page_content.strip():
            segments = parse_page_segments(page_content.strip())
            if segments:  # Only add page if it has content
                pages.append({"segments": segments})

    return pages

def replace_placeholders_with_images(story_text, reference_image_base64, char_description):
    """Replace all {description} placeholders with {base64_image_url}."""
    placeholders = extract_image_placeholders(story_text)
    modified_story = story_text
    cover_image = None

    for index, description in enumerate(placeholders):
        is_cover = index == 0

        if is_cover:
            print(f"Generating cover image: {description}")
        else:
            print(f"Generating image {index + 1}/{len(placeholders)}: {description}")

        # Generate image with or without cover reference
        generated_image_url = generate_image_with_gemini(
            description=description,
            reference_image_base64=reference_image_base64,
            char_description=char_description,
            cover_image_base64=cover_image if not is_cover else None,
            is_cover=is_cover
        )

        if generated_image_url:
            # Store the first image as the cover for subsequent generations
            if is_cover:
                cover_image = generated_image_url
                print("✓ Cover image generated and will be used for consistency")

            # Replace the placeholder with the generated image URL
            old_placeholder = f"{{{description}}}"
            new_placeholder = f"{{{generated_image_url}}}"
            modified_story = modified_story.replace(old_placeholder, new_placeholder, 1)
        else:
            print(f"Failed to generate image for: {description}")

    return modified_story

@app.route('/api/create-story', methods=['POST'])
def create_story():
    try:
        data = request.get_json()

        # Validate required fields
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        image = data.get('image')
        char_description = data.get('charDescription')
        story_description = data.get('storyDescription')

        if not image or not char_description or not story_description:
            return jsonify({
                'error': 'Missing required fields. Need: image, charDescription, storyDescription'
            }), 400

        # Load story prompt template and add user inputs
        base_prompt = load_story_prompt()
        prompt_text = f"""{base_prompt}

---

Now generate a story based on these inputs:

Character Description: {char_description}
Themes: {story_description}

IMPORTANT: I'm providing a reference image of the character. Please observe the art style (e.g., stick figure, sketch, cartoon, etc.) and incorporate this into your image descriptions. If it's a stick figure, mention "in stick figure style" in the descriptions. If it's a sketch, mention "in sketchy style", etc."""

        # Include the character image in the message to Claude
        completion = client.chat.completions.create(
            model="anthropic/claude-haiku-4.5",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt_text
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image
                            }
                        }
                    ]
                }
            ]
        )

        generated_story = completion.choices[0].message.content

        # Log the Claude output for verification
        print("\n=== Claude Story Output ===")
        print(generated_story)
        print("=========================\n")

        # Replace placeholders with actual generated images
        print("Generating images for story placeholders...")
        final_story = replace_placeholders_with_images(generated_story, image, char_description)

        # Parse story into structured pages
        print("Parsing story into pages...")
        pages = parse_story_into_pages(final_story)

        return jsonify({
            'success': True,
            'pages': pages,
            'character': char_description,
            'theme': story_description
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
