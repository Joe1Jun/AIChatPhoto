from flask import Flask, request, jsonify
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

client = OpenAI()
#OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json  # Expecting JSON from front-end
    user_message = data.get("message")  # Extract user input
    
    if not user_message:
        return jsonify({"error": "Message is required"}), 400
    
    try:
        # Call OpenAI API with user message
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Or "gpt-4"
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

if __name__ == "__main__":
    app.run(port=5000)