



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

        # You can send back the image URL (assuming you're serving it from Flask)
        image_url = f"http://localhost:5001/uploads/{image.filename}"

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
                        "url": image_url,
                    },
                },
            ],
        }
    ],
    max_tokens=300,
)
        print(response)
        response = response.choices[0].message.content
        return jsonify({"analysis": response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500