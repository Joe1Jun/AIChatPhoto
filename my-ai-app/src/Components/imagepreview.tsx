import React from "react";
import { Box } from "@mui/material";

interface ImagePreviewProps {
  imageUrl: string | null; // Accepts a string or null
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl }) => {
  if (!imageUrl) return null; // Don't render anything if no image is selected

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "300px", // Set a reasonable max height
        overflow: "hidden",
        borderRadius: "8px",
        marginBottom: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        border: "1px solid #ddd",
      }}
    >
      <img
        src={imageUrl}
        alt="Selected"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
        }}
      />
    </Box>
  );
};

export default ImagePreview;
