import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { backendUrlBase } from "../utils/environment";
import { useCloudinaryUpload } from "./useCloudinaryUpload";


export interface Pointdata {
    id: string;
    latitud: number;
    longitude:number;
    name: string;
    description: string;
    photo_url?: string | File;
    address: string;
    commune: string;
    region: string;
    phone: string;
    services: string[];
    type: number[];
    highlighted: boolean;
    gallery?: { 
        galleryName: string | null;
        localNumber: string | null;
    };
    rrss?: {
        instagram: string | null;
        facebook: string | null;
        other: string | null;
    };
    deleted?: boolean;
    normalizedName?: string[];
    normalizedAddress?: string[]; 
}

const UseFetchPoints = () => {
    const [points, setPoints] = useState<Pointdata[]>([]);
    const [loading, setLoading] =useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect (()=> {
        const fetchPoints = async () => {
            try {
                const response= await axios.get(`${backendUrlBase}/points`);
                setPoints(response.data);
            } catch (error) {
                console.error('Error al obtener los marcadores:', error);
                setError('Error al obtener los marcadores');
            } finally {
                setLoading(false);
            }
        };
        fetchPoints();
    }, []);

    const { uploadImageToCloudinary } = useCloudinaryUpload();

    // const DEFAULT_IMAGE_FILE = new File(
    //     ["/images/4960717128898555064.jpg"], // Ruta de la imagen por defecto
    //     "default.jpg",
    //     { type: "image/jpeg" }
    //   );

    const DEFAULT_IMAGE_URL = "/images/4960717128898555064.jpg";

    const urlToFile = async (imageUrl: string, filename: string): Promise<File> => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    };

    const createPoint = async (newPoint: Partial<Pointdata>) => {
        try {
            let photoUrl = newPoint.photo_url;

            if (!photoUrl) {
                console.log("No se proporcionó una imagen, subiendo imagen por defecto...");
                const defaultFile = await urlToFile(DEFAULT_IMAGE_URL, "default.jpg");
                photoUrl = await uploadImageToCloudinary(defaultFile);
            } else if (newPoint.photo_url instanceof File) {
                console.log("Subiendo imagen del usuario a Cloudinary...");
                photoUrl = await uploadImageToCloudinary(newPoint.photo_url);
            }
            const formattedPoint = {
                ...newPoint,
                photo_url: photoUrl,
                rrss: {
                    // Si no existen los enlaces, no se incluyen en el objeto
                    ...(newPoint.rrss?.facebook && { facebook: newPoint.rrss.facebook }),
                    ...(newPoint.rrss?.instagram && { instagram: newPoint.rrss.instagram }),
                    ...(newPoint.rrss?.other && { other: newPoint.rrss.other }),
                },
                id: undefined,
            };

            const response = await axios.post(`${backendUrlBase}/points`, formattedPoint);
            setPoints((prev) => [...prev, response.data]);
        } catch (error) {
            console.error("Error al crear el punto:", error);
            if (error instanceof AxiosError) {
                const errorData = error.response?.data;
                if (errorData && typeof errorData === "object") {
                    const errorMessages = Object.entries(errorData)
                        .map(([field, msg]) => `${field}: ${msg}`)
                        .join("\n");
                    throw new Error(`Error al crear el punto:\n${errorMessages}`);
                }
                throw new Error(error.response?.data?.message || error.message);
            }
            
            throw new Error("Error al crear el punto.");
        }
    };

    const deletePoint = async (id: string) => {
        try {
            await axios.delete(`${backendUrlBase}/points/${id}`);
            setPoints((prev) => prev.map((point) =>
                point.id === id ? { ...point, deleted: true } : point
            ));
        } catch (error) {
            console.error("Error al eliminar el punto:", error);
            throw new Error("Error al eliminar el punto.");
        }
    };

    const activePoints = points.filter((point) => !point.deleted);

    const updatePoint = async (id: string, updatedData: Partial<Pointdata>) => {
        try {
            let photoUrl = updatedData.photo_url;

            if (!photoUrl) {
                console.log("No se proporcionó una imagen, subiendo imagen por defecto...");
                const defaultFile = await urlToFile(DEFAULT_IMAGE_URL, "default.jpg"); 
                photoUrl = await uploadImageToCloudinary(defaultFile);
            } else if (updatedData.photo_url instanceof File) {
                console.log("Subiendo imagen del usuario a Cloudinary...");
                photoUrl = await uploadImageToCloudinary(updatedData.photo_url);
            }
            if (id) {
                const galleryUpdates = updatedData.gallery
                    ? {
                        gallery: {
                            ...updatedData.gallery,
                            galleryName: updatedData.gallery?.galleryName || null,
                            localNumber: updatedData.gallery?.localNumber || null,
                        },
                    }
                    : {};

                const rrssUpdates = updatedData.rrss
                    ? {
                        rrss: {
                            ...updatedData.rrss,
                            facebook: updatedData.rrss?.facebook || null, 
                            instagram: updatedData.rrss?.instagram || null,
                            other: updatedData.rrss?.other || null,
                        },
                    }
                    : {};
    
                const dataToUpdate = { ...updatedData, ...galleryUpdates, ...rrssUpdates, id: undefined, photo_url: photoUrl, };
    
                const response = await axios.put(`${backendUrlBase}/points/${id}`, dataToUpdate);
                setPoints((prev) =>
                    prev.map((point) => (point.id === id ? { ...point, ...response.data } : point))
                );
            } else {
                await createPoint(updatedData);
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            if (error instanceof AxiosError) {
                const errorData = error.response?.data;
                if (errorData && typeof errorData === "object") {
                    const errorMessages = Object.entries(errorData)
                        .map(([field, msg]) => `${field}: ${msg}`)
                        .join("\n");
                    throw new Error(`Error al actualizar el punto:\n${errorMessages}`);
                }
                throw new Error(error.response?.data?.message || error.message);
            }
    
            throw new Error("Error al actualizar el punto.");
        }
    };

    return {points: activePoints, loading, error, deletePoint, updatePoint, createPoint};
};



export default UseFetchPoints; 