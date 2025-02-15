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
            model="gpt-4",
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
        
        # Generate the URL to the uploaded image
        image_url = f"http://localhost:5001/uploads/{image.filename}"
        
        return jsonify({
            "imageUrl": image_url,
            "analysis": response.choices[0].message.content
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500