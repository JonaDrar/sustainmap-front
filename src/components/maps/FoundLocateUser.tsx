import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

const LocateUser = ({
  onLocationFound,
  userCoords,
}: {
  onLocationFound: (lat: number, lng: number) => void;
  userCoords: { lat: number; lng: number } | null;
}) => {
  const map = useMap();
  const [hasCentered, setHasCentered] = useState(false);
  const [locationRequested, setLocationRequested] = useState(false);

  useEffect(() => {
    if (userCoords && map && !hasCentered) {
      console.log("User location found:", userCoords);
      map.setView([userCoords.lat, userCoords.lng], 15);
      setHasCentered(true);
    }
  }, [userCoords, map, hasCentered]);

  useEffect(() => {
    if (!locationRequested && map) {
      setLocationRequested(true);
      map.locate({ setView: false, maxZoom: 15, watch: true });

      const onLocationFoundEvent = (e: L.LocationEvent) => {
        const { lat, lng } = e.latlng;
        onLocationFound(lat, lng);
      };

      const onLocationError = () => {
        console.log("Error al obtener ubicación");
        alert(
          "No se pudo obtener tu ubicación. Por favor, habilita la geolocalización."
        );
      };

      map.on("locationfound", onLocationFoundEvent);
      map.on("locationerror", onLocationError);

      return () => {
        map.off("locationfound", onLocationFoundEvent);
        map.off("locationerror", onLocationError);
      };
    }
  }, [map, locationRequested, onLocationFound]);

  return null;
};

export default LocateUser