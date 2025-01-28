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
            // Calcular si el punto estará activo según las fechas al momento de crearlo
            const isActive = newPoint.activationStartDate && newPoint.activationEndDate
                ? new Date() >= new Date(newPoint.activationStartDate) && new Date() <= new Date(newPoint.activationEndDate)
                : newPoint.isActive || false;  // Si no hay fechas, usar el valor de isActive pasado.
    
            const formattedPoint = {
                ...newPoint,
                isActive, // Incluir el valor de isActive calculado
                rrss: {
                    ...(newPoint.rrss?.facebook && { facebook: newPoint.rrss.facebook }),
                    ...(newPoint.rrss?.instagram && { instagram: newPoint.rrss.instagram }),
                    ...(newPoint.rrss?.other && { other: newPoint.rrss.other }),
                },
                activationStartDate: newPoint.activationStartDate
                    ? new Date(newPoint.activationStartDate).toISOString()
                    : null,
                activationEndDate: newPoint.activationEndDate
                    ? new Date(newPoint.activationEndDate).toISOString()
                    : null,
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

    const activePoints = points.filter((point) => {
        if (point.deleted) return false;
    
        // Verificar fechas para calcular si el punto está activo
        if (point.activationStartDate && point.activationEndDate) {
            const now = new Date();
            const start = new Date(point.activationStartDate);
            const end = new Date(point.activationEndDate);
            return now >= start && now <= end;
        }
    
        return true; // Si no tiene fechas, se considera activo por defecto
    });

    const updatePoint = async (id: string, data: Pointdata) => {
    const formattedData = {
      ...data,
      activationStartDate: data.activationStartDate
        ? new Date(data.activationStartDate).toISOString()
        : null,
      activationEndDate: data.activationEndDate
        ? new Date(data.activationEndDate).toISOString()
        : null,
    };
    const response = await fetch(`${backendUrlBase}/points/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el punto.");
    }
    return response.json();
  };

    return {points: activePoints, loading, error, deletePoint, updatePoint, createPoint};
};



export default UseFetchPoints; 