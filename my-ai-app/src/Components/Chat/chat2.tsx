import { useState } from "react";
import axios from "axios";
import { TextField, Button, CircularProgress, IconButton } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ImagePreview from "./ImagePreview"; // Import the new component

const ChatWithImageUpload = () => {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle text input change
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  // Handle image selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const localImageUrl = URL.createObjectURL(file);
    setSelectedImage(localImageUrl);
    setImageFile(file);
  };

  // Handle sending message and image
  const handleSend = async () => {
    setLoading(true);

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("message", message);

      try {
        const response = await axios.post("http://localhost:5001/analyze-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("AI Response:", response.data);
      } catch (error) {
        console.error("Error sending image and message:", error);
      }
    } else {
      try {
        const response = await axios.post("http://localhost:5001/ask", { message });
        console.log("AI Response:", response.data);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }

    setLoading(false);
    setMessage("");
    setSelectedImage(null);
    setImageFile(null);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}>
      {/* Image Preview Component */}
      <ImagePreview imageUrl={selectedImage} />

      {/* Message Input Field */}
      <TextField
        label="Type a message..."
        variant="outlined"
        fullWidth
        value={message}
        onChange={handleMessageChange}
        disabled={loading}
        style={{ marginBottom: "10px" }}
      />

      {/* File Upload Button */}
      <input type="file" accept="image/*" style={{ display: "none" }} id="photo-upload" onChange={handleFileChange} />
      <label htmlFor="photo-upload">
        <IconButton color="primary" component="span" disabled={loading}>
          <PhotoCameraIcon />
        </IconButton>
      </label>

      {/* Send Button */}
      <Button variant="contained" color="primary" onClick={handleSend} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Send"}
      </Button>
    </div>
  );
};

export default ChatWithImageUpload;
