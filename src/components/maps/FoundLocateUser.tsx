import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

interface LocateUserProps {
  onLocationFound: (lat: number, lng: number) => void;
  userCoords: { lat: number; lng: number } | null;
}

const LocateUser: React.FC<LocateUserProps> = ({ onLocationFound, userCoords }) => {
  const map = useMap();
  const [hasCentered, setHasCentered] = useState(false);
  const [locationRequested, setLocationRequested] = useState(false);

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

      const handleLocationFound = (e: L.LocationEvent) => {
        const { lat, lng } = e.latlng;
        console.log("Ubicación encontrada:", { lat, lng });
        onLocationFound(lat, lng);
      };

      const handleLocationError = (error: L.ErrorEvent) => {
        console.error("Error al obtener la ubicación:", error.message);
        alert("No se pudo obtener tu ubicación. Por favor, habilita la geolocalización.");
      };

      map.on("locationfound", handleLocationFound);
      map.on("locationerror", handleLocationError);

      return () => {
        map.off("locationfound", handleLocationFound);
        map.off("locationerror", handleLocationError);
      };
    }
  }, [map, locationRequested, onLocationFound]);

  return null;
};

export default LocateUser;