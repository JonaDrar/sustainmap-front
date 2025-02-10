import { useEffect, useState, useCallback } from "react";
import { useMap } from "react-leaflet";

interface LocateUserProps {
  onLocationFound: (lat: number, lng: number) => void;
  userCoords: { lat: number; lng: number } | null;
}

const LocateUser: React.FC<LocateUserProps> = ({ onLocationFound, userCoords }) => {
  const map = useMap();
  const [hasCentered, setHasCentered] = useState(false);
  const [locationRequested, setLocationRequested] = useState(false);

  // Obtener ubicación por IP
  const fetchLocationByIP = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data.latitude && data.longitude) {
        console.log("Ubicación aproximada por IP:", data.latitude, data.longitude);
        onLocationFound(data.latitude, data.longitude);
      } else {
        console.warn("No se pudo obtener la ubicación por IP");
      }
    } catch (error) {
      console.error("Error al obtener ubicación por IP:", error);
    }
  };

  const handleLocationFound = useCallback(
    (e: L.LocationEvent) => {
      const { lat, lng } = e.latlng;
      console.log("Ubicación encontrada:", { lat, lng });
      onLocationFound(lat, lng);
    },
    [onLocationFound]
  );

  const handleLocationError = useCallback((error: L.ErrorEvent) => {
    console.error("Error al obtener la ubicación:", error.message);
    fetchLocationByIP();
  }, []);

  // Centrar el mapa en la ubicación del usuario si está disponible
  useEffect(() => {
    if (userCoords && map && !hasCentered) {
      console.log("Centrando el mapa en la ubicación del usuario:", userCoords);
      map.setView([userCoords.lat, userCoords.lng], 15);
      setHasCentered(true);
    }
  }, [userCoords, map, hasCentered]);


  useEffect(() => {
    if (!locationRequested && map) {
      setLocationRequested(true);
      map.locate({
        setView: false,
        maxZoom: 15,
        watch: true,
      });

      map.on("locationfound", handleLocationFound);
      map.on("locationerror", handleLocationError);

  
      return () => {
        map.off("locationfound", handleLocationFound);
        map.off("locationerror", handleLocationError);
      };
    }
  }, [map, locationRequested, handleLocationFound, handleLocationError]);

  return null;
};

export default LocateUser;
