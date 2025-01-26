import { useState } from "react";

export const useCloudinaryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    if (!file.type.startsWith("image/")) {
        throw new Error("Por favor, selecciona un archivo de imagen válido.");
      }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "default_preset");
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "");

    try {
      setIsUploading(true);
      const response = await fetch(
        import.meta.env.VITE_CLOUDINARY_API_URL || "",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Detalles del error:", error);
        throw new Error("Error al subir la imagen a Cloudinary");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImageToCloudinary, isUploading };
};
