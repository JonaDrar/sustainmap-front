import { useEffect, useState, useContext } from "react";
import axios, { AxiosError } from "axios";
import { backendUrlBase } from "../utils/environment";
import { useCloudinaryUpload } from "./useCloudinaryUpload";

import { UserContext } from "../contexts/UserContext";

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
    activationStartDate?: string; 
    activationEndDate?: string;  
    isActive?: boolean;
}

const UseFetchPoints = () => {
    const { loggedInUser } = useContext(UserContext);
    const [points, setPoints] = useState<Pointdata[]>([]);
    const [loading, setLoading] =useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect (()=> {
        const fetchPoints = async () => {
            try {
                const response= await axios.get(`${backendUrlBase}/points`);
                // console.log("Datos recuperados:", response.data);
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
            // Calcular si el punto estará activo según las fechas al momento de crearlo
            const isActive = newPoint.activationStartDate && newPoint.activationEndDate
                ? new Date() >= new Date(newPoint.activationStartDate) && new Date() <= new Date(newPoint.activationEndDate)
                : newPoint.isActive || false;  // Si no hay fechas, usar el valor de isActive pasado.
    
            const formattedPoint = {
                ...newPoint,
                photo_url: photoUrl,
                type: newPoint.type || [],
                services: newPoint.services || [],
                phone: newPoint.phone || "",
                isActive, // Incluir el valor de isActive calculado
                rrss: {
                    ...(newPoint.rrss?.facebook && { facebook: newPoint.rrss.facebook }),
                    ...(newPoint.rrss?.instagram && { instagram: newPoint.rrss.instagram }),
                    ...(newPoint.rrss?.other && { other: newPoint.rrss.other }),
                },
                activationStartDate: newPoint.activationStartDate ? new Date(newPoint.activationStartDate) : undefined,
                activationEndDate: newPoint.activationEndDate ? new Date(newPoint.activationEndDate) : undefined,
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

    const activePoints = points.filter((point) => {
        if (point.deleted) return false;

        // Si el usuario está autenticado, mostrar todos los puntos (activos e inactivos)
        if (loggedInUser) return true; 
    
        // Verificar fechas para calcular si el punto está activo
        if (point.activationStartDate && point.activationEndDate) {
            const now = new Date();
            const start = new Date(point.activationStartDate);
            const end = new Date(point.activationEndDate);
            return now >= start && now <= end;
        }
    
        return point.isActive; // Si no hay fechas, usa el estado `isActive`
    });

    const updatePoint = async (id: string, data: Pointdata) => {
        try {
        // Verifica los datos que estás recibiendo
        console.log("Datos recibidos para actualizar:", data);
            // Eliminar 'id' de los datos antes de enviar
        const { id: _, ...formattedData } = data; // Eliminar 'id' de los datos antes de enviar
        console.log("_:", _);

        // Convertir las fechas a ISO 8601 si existen
        formattedData.activationStartDate = formattedData.activationStartDate
            ? new Date(formattedData.activationStartDate).toISOString()
            : undefined;
        formattedData.activationEndDate = formattedData.activationEndDate
            ? new Date(formattedData.activationEndDate).toISOString()
            : undefined;

            console.log("Datos enviados al backend:", formattedData);


    const updatePoint = async (id: string, updatedData: Partial<Pointdata>) => {
        try {
            if (id) {
                let photoUrl = updatedData.photo_url;

            if (!photoUrl) {
                console.log("No se proporcionó una imagen, subiendo imagen por defecto...");
                const defaultFile = await urlToFile(DEFAULT_IMAGE_URL, "default.jpg"); 
                photoUrl = await uploadImageToCloudinary(defaultFile);
            } else if (updatedData.photo_url instanceof File) {
                console.log("Subiendo imagen del usuario a Cloudinary...");
                photoUrl = await uploadImageToCloudinary(updatedData.photo_url);
            }
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
                    
                    const dataToUpdate = { 
                        ...updatedData, 
                        ...galleryUpdates, 
                        ...rrssUpdates, 
                        id: undefined, 
                        photo_url: photoUrl, 
                        type: updatedData.type || [],
                        services: updatedData.services || [],
                        phone: updatedData.phone || "", };

                const dataToUpdate = { ...updatedData, ...galleryUpdates, ...rrssUpdates, id: undefined };
    
                const response = await axios.put(`${backendUrlBase}/points/${id}`, dataToUpdate);
                const response = await axios.put(`${backendUrlBase}/points/${id}`, formattedData);

            if (response.status === 200) {
                setPoints((prev) =>
                    prev.map((point) => (point.id === id ? { ...point, ...response.data } : point))
                );
            }
                setPoints((prev) =>
                    prev.map((point) => (point.id === id ? { ...point, ...response.data } : point))
                );
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