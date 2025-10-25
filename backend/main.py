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

def extract_image_placeholders(story_text):
    """Extract all [[description]] placeholders from the story."""
    pattern = r'\[\[([^\]]+)\]\]'
    matches = re.findall(pattern, story_text)
    return matches

def generate_image_with_gemini(description, reference_image_base64):
    """Generate an image using Gemini based on description and reference image."""
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json"
    }

    # Create prompt that references both the description and the style of the user's image
    prompt = f"Generate an image that matches this description: {description}. The character should match the style and appearance of the reference image provided."

    payload = {
        "model": "google/gemini-2.5-flash-image",
        "messages": [
            {
                "role": "user",
                "content": [
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

def replace_placeholders_with_images(story_text, reference_image_base64):
    """Replace all [[description]] placeholders with [[base64_image_url]]."""
    placeholders = extract_image_placeholders(story_text)
    modified_story = story_text

    for description in placeholders:
        print(f"Generating image for: {description}")
        generated_image_url = generate_image_with_gemini(description, reference_image_base64)

        if generated_image_url:
            # Replace the placeholder with the generated image URL
            old_placeholder = f"[[{description}]]"
            new_placeholder = f"[[{generated_image_url}]]"
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

        # Generate story using Claude via OpenRouter
        prompt = f"""Create a children's story based on the following:

Character Description: {char_description}
Story Theme/Description: {story_description}

Please write an engaging, creative children's story that incorporates these elements. The story should be appropriate for young readers and capture their imagination.

IMPORTANT: Throughout the story, include up to {MAX_IMAGES} image placeholders where illustrations would enhance the narrative. Format these as [[description of the scene]], where the description is detailed enough to generate an illustration. Use "my character" to describe the character in the story. For example: [[My character watching the dragon sitting in the library surrounded by colorful books]]. These placeholders should be naturally integrated into the story text."""

        completion = client.chat.completions.create(
            model="anthropic/claude-haiku-4.5",
            messages=[
                {
                    "role": "user",
                    "content": prompt
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
        final_story = replace_placeholders_with_images(generated_story, image)

        return jsonify({
            'success': True,
            'story': final_story,
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
