import { useEffect, useState, useContext } from "react";
import axios, { AxiosError } from "axios";
import { backendUrlBase } from "../utils/environment";
import { UserContext } from "../contexts/UserContext";

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
    const { loggedInUser } = useContext(UserContext);
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
                activationStartDate: newPoint.activationStartDate ? new Date(newPoint.activationStartDate) : undefined,
                activationEndDate: newPoint.activationEndDate ? new Date(newPoint.activationEndDate) : undefined,
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
        const { id, ...formattedData } = data; // Eliminar 'id' de los datos antes de enviar

        // Convertir las fechas a ISO 8601 si existen
        formattedData.activationStartDate = formattedData.activationStartDate
            ? new Date(formattedData.activationStartDate).toISOString()
            : undefined;
        formattedData.activationEndDate = formattedData.activationEndDate
            ? new Date(formattedData.activationEndDate).toISOString()
            : undefined;

            console.log("Datos enviados al backend:", formattedData);

            const response = await axios.put(`${backendUrlBase}/points/${id}`, formattedData);

            if (response.status === 200) {
                setPoints((prev) =>
                    prev.map((point) => (point.id === id ? { ...point, ...response.data } : point))
                );
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error al actualizar el punto:", error.response?.data || error.message);
              } else {
                console.error("Error al actualizar el punto:", error);
              }
              console.error("Detalles del error:", error); // Agregado para depurar
              throw new Error("Error al actualizar el punto.");
        }
    };

    return {points: activePoints, loading, error, deletePoint, updatePoint, createPoint};
};

export default UseFetchPoints; 