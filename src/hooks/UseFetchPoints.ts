import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { backendUrlBase } from "../utils/environment";

export interface Pointdata {
    id: string;
    latitud: number;
    longitude:number;
    name: string;
    description: string;
    photo_url: string;
    address: string;
    commune: string;
    region: string;
    phone: string;
    services: string[];
    type: number;
    highlighted: boolean;
    gallery?: { 
        galleryName: string;
        localNumber: string;
    };
    rrss?: {
        instagram: string;
        facebook: string;
        twitter: string;
        other: string;
    };
    deleted?: boolean;
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

    const createPoint = async (newPoint: Partial<Pointdata>) => {
        try {
            const formattedPoint = {
                ...newPoint,
                id: undefined,
                type: Math.max(1, Math.min(4, Math.floor(newPoint.type || 1))),
            };

            const response = await axios.post(`${backendUrlBase}/points`, formattedPoint);
            setPoints((prev) => [...prev, response.data]);
        } catch (error) {
            console.error("Error al crear el punto:", error);
            const errorMessage = 
              error instanceof AxiosError 
                ? error.response?.data?.message || error.message 
                : "Error al crear el punto.";
            throw new Error(errorMessage);
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
            if (id) {
                const galleryUpdates = updatedData.gallery
                    ? {
                        gallery: {
                            ...updatedData.gallery,
                            galleryName: updatedData.gallery?.galleryName || undefined,
                            localNumber: updatedData.gallery?.localNumber || undefined,
                        },
                    }
                    : {};
    
                const dataToUpdate = { ...updatedData, ...galleryUpdates, id: undefined };
    
                const response = await axios.put(`${backendUrlBase}/points/${id}`, dataToUpdate);
                setPoints((prev) =>
                    prev.map((point) => (point.id === id ? { ...point, ...response.data } : point))
                );
            } else {
                await createPoint(updatedData);
            }
        } catch (error) {
            console.error("Error al actualizar o crear el punto:", error);
            throw new Error("Error al actualizar o crear el punto.");
        }
    };

    return {points: activePoints, loading, error, deletePoint, updatePoint, createPoint};
};

export default UseFetchPoints; 