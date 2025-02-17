from flask import Flask, request, jsonify
import os
from flask import send_from_directory  # Used to serve files from a directory
from openai import OpenAI
from flask_cors import CORS
import base64
from dotenv import load_dotenv

load_dotenv()

client= OpenAI()
CORS(app)

# Retrieve the OpenAI API key from environment variables
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

app=Flask(__name__)

UPLOAD_FOLDER='uploads'

os.makedirs(UPLOAD_FOLDER , exist_ok=True)


app.route('/ask', methods=['POST'])

def chat():
     data= request.json
     user_message= data.get('message')

     if not user_message:
          return jsonify({"errot" : "no user message"}), 400
     
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

def image_to_base64(image_path):
    with open(image_path , "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
    
    
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

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
               {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Describe this image?"},  # Send a text prompt
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"  # Embed the base64 image data
                            }
                        }
                    ]
                }
                

            ]
            max_tokens=300  # Limit the response length

        )

        print(response.choices[0])  # Print the response for debugging
        
        # Return the analysis result from OpenAI
        return jsonify({
            "analysis": response.choices[0].message.content
        })



    except Exception as e:
        return jsonify({"error" : str(e)})



