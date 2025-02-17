# Import necessary modules from Flask and other libraries
from flask import Flask, request, jsonify  # Flask for web server, request for handling HTTP requests, jsonify for JSON responses
from flask import send_from_directory  # Used to serve files from a directory
import base64  # For encoding images into base64 format
import os  # For file system operations
from flask_cors import CORS  # Enable Cross-Origin Resource Sharing (CORS) for API accessibility
from openai import OpenAI  # Import OpenAI SDK for interacting with OpenAI's API
from dotenv import load_dotenv  # Load environment variables from a .env file

# Load environment variables from the .env file
load_dotenv()

# Create an OpenAI client instance
client = OpenAI()

# Retrieve the OpenAI API key from environment variables
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Create a Flask web application instance
app = Flask(__name__)

# Enable CORS to allow frontend applications to access the API
CORS(app)

# Define the directory where uploaded images will be stored
UPLOAD_FOLDER = 'uploads'
# Create the uploads folder if it does not exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Define an API endpoint for handling chatbot requests
@app.route('/ask', methods=['POST'])
def chat():
    # Extract JSON data sent from the frontend
    data = request.json  
    # Extract the user’s message from the JSON request
    user_message = data.get('message')  # Retrieve the "message" field

    # If the message is missing, return an error response
    if not user_message:
        return jsonify({"error": "Message is required"}), 400
    
    try:
        # Send the user’s message to OpenAI’s chat model and get a response
        response = client.chat.completions.create(
            model="gpt-4",  # Use GPT-4 for the response
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},  # System message setting assistant behavior
                {"role": "user", "content": user_message}  # User's input message
            ]
        )
        print(response)  # Print the full response for debugging
        
        # Extract the response content from OpenAI’s reply
        ai_response = response.choices[0].message.content
        
        # Return the AI-generated response as JSON
        return jsonify({"response": ai_response})
        
    except Exception as e:
        # Handle any errors that occur and return an error message
        return jsonify({"error": str(e)}), 500


# Function to convert an image file to a base64-encoded string
def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:  # Open the image file in binary mode
        return base64.b64encode(image_file.read()).decode('utf-8')  # Encode it in base64 and convert to string

# Define an API endpoint to analyze an uploaded image
@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    # Check if an image file is included in the request
    if 'image' not in request.files:
        return jsonify({"error": "No image file part"}), 400  # Return error if no file
    
    image = request.files['image']  # Retrieve the uploaded image file
    
    # Check if the filename is empty
    if image.filename == '':
        return jsonify({"error": "No selected file"}), 400  # Return error if no file was selected
    
    try:
        # Define the full path to save the uploaded image
        image_path = os.path.join(UPLOAD_FOLDER, image.filename)
        image.save(image_path)  # Save the uploaded image

        
        
        # Convert the saved image to a base64 string
        base64_image = image_to_base64(image_path)
        
        # Call OpenAI's GPT-4 Vision API to analyze the image
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Use GPT-4o-mini for image analysis
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "What's in this image?"},  # Send a text prompt
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"  # Embed the base64 image data
                            }
                        }
                    ]
                }
            ],
            max_tokens=300  # Limit the response length
        )
        print(response.choices[0])  # Print the response for debugging
        
        # Return the analysis result from OpenAI
        return jsonify({
            "analysis": response.choices[0].message.content
        })
        
    except Exception as e:
        # Handle any errors that occur and return an error message
        return jsonify({"error": str(e)}), 500


# Define an endpoint to serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)  # Serve the requested file from the uploads folder


# Run the Flask web server on port 5001
if __name__ == "__main__":
    app.run(port=5001)
