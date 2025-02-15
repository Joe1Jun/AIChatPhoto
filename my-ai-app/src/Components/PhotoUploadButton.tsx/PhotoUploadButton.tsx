

import { useState } from "react";
import axios from "axios";
import { IconButton, CircularProgress } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

interface PhotoUploadButtonProps {
  onUpload: (message: { role: string; content: string }) => void;
}

const PhotoUploadButton: React.FC<PhotoUploadButtonProps> = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/analyze-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUpload({ role: "AI", content: response.data.analysis });

    } catch (error) {
      console.error("Error uploading image:", error);
      onUpload({ role: "AI", content: "Failed to analyze image." });
    }

    setLoading(false);
  };



  return(
    
    <>
    <input
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      id="photo-upload"
      onChange={handleFileChange}
    />
    <label htmlFor="photo-upload">
      <IconButton color="primary" component="span" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
      </IconButton>
    </label>
  </>

  )
  
};

export default PhotoUploadButton;
