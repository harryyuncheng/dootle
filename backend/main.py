from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenRouter client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

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

Please write an engaging, creative children's story that incorporates these elements. The story should be appropriate for young readers and capture their imagination."""

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

        return jsonify({
            'success': True,
            'story': generated_story,
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
