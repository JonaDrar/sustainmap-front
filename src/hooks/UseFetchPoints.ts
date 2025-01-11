import { useEffect, useState } from "react";
import axios from "axios";
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
    gallery?: { 
        galleryName: string;
        localNumber: string;
    };
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
                setError('Error al obtener los maracadores');
            } finally {
                setLoading(false);
            }
        };
        fetchPoints();
    }, []);

    return {points, loading, error};
};



export default UseFetchPoints; 