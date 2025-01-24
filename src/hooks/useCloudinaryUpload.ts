import { useState } from "react";

export const useCloudinaryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    if (!file.type.startsWith("image/")) {
        throw new Error("Por favor, selecciona un archivo de imagen válido.");
      }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    formData.append("cloud_name", "dfxlipbvl");

    try {
      setIsUploading(true);
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dfxlipbvl/image/upload",
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
