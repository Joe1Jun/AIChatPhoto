from flask import Flask, request, jsonify
from flask import send_from_directory
import base64
import os
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

client = OpenAI()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/ask', methods=['POST'])
def chat():
    data = request.json  # Expecting JSON from front-end
    user_message = data.get('message') # Just extract the content
    
    if not user_message:
        return jsonify({"error": "Message is required"}), 400
    
    try:
        # Call OpenAI API with user message
        response = client.chat.completions.create(
            model="gpt-4",  # Or "gpt-4"
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ]
        )
        print(response)
        # Extract AI response using the proper object attributes
        ai_response = response.choices[0].message.content
        return jsonify({"response": ai_response})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file part"}), 400
    
    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        # Save the uploaded image temporarily
        image_path = os.path.join(UPLOAD_FOLDER, image.filename)
        image.save(image_path)
        
        # Convert image to base64
        base64_image = image_to_base64(image_path)
        
        # Call GPT-4 Vision API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "What's in this image?"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300
        )
        print(response.choices[0])
        # Generate the URL to the uploaded image
       # image_url = f"http://localhost:5001/uploads/{image.filename}"
        
        return jsonify({
           # "imageUrl": image_url,
            "analysis": response.choices[0].message.content
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

    
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


    
if __name__ == "__main__":
    app.run(port=5001)