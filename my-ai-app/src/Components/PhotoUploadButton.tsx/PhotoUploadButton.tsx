

import { useState } from "react"; // Import React's useState for managing component state
import axios from "axios"; // Import axios for making HTTP requests
import { IconButton, CircularProgress } from "@mui/material"; // Import Material UI components
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"; // Import camera icon for the upload button

// Define the props interface for the PhotoUploadButton component
interface PhotoUploadButtonProps {
  onUpload: (message: { role: string; content: string }) => void; // Function to update the chat with image & response
}

// Define the functional component PhotoUploadButton
const PhotoUploadButton: React.FC<PhotoUploadButtonProps> = ({ onUpload }) => {
  // State to manage the loading state while image is being uploaded
  const [loading, setLoading] = useState(false);

  /**
   * Handles file selection and uploads the image to the backend
   * @param event - File input change event
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Get the selected file
    const file = event.target.files?.[0];
    if (!file) return; // If no file is selected, exit function

    // Reset input value to allow re-uploading the same file
    event.target.value = "";

    // Generate a temporary URL to display the image immediately in the chat
    const localImageUrl = URL.createObjectURL(file);

    // Add the uploaded image to the chat immediately (before sending to backend)
    onUpload({ role: "user", content: localImageUrl });

    // Create FormData object to send the image file to the backend
    const formData = new FormData();
    formData.append("image", file); // Append file to form data

    // Set loading to true to show a spinner while the request is processing
    setLoading(true);

    try {
      // Send the image to the backend for processing
      const response = await axios.post("http://localhost:5001/analyze-image", formData, {
        //dony necessarilly need this header we can use formData and axios will infer that we want to pass 
        // files and will include the header in the request
        // This is the same as a json request when you use include a javascript object and JSON is infered
        headers: { "Content-Type": "multipart/form-data" }, // Set correct content type
      });

      // Add the AI's response (analysis) to the chat
      onUpload({ role: "AI", content: response.data.analysis });

    } catch (error) {
      console.error("Error uploading image:", error);
      // If the request fails, add an error message to the chat
      onUpload({ role: "AI", content: "Failed to analyze image." });
    }

    // Reset loading state after request is completed
    setLoading(false);
  };

  return (
    <>
      {/* Hidden file input field for selecting an image */}
      <input
        type="file"
        accept="image/*" // Accept only image files
        style={{ display: "none" }} // Hide the input field
        id="photo-upload" // ID used to link with label
        onChange={handleFileChange} // Call handleFileChange on file selection
      />
      
      {/* Label associated with the hidden input field */}
      <label htmlFor="photo-upload">
        {/* IconButton to act as an image upload button */}
        <IconButton color="primary" component="span" disabled={loading}>
          {/* Show loading spinner if uploading, else show camera icon */}
          {loading ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
        </IconButton>
      </label>
    </>
  );
};

// Export the component to be used in other parts of the application
export default PhotoUploadButton;
