import { useEffect, useState } from "react";
import { useMap, useMapEvent } from "react-leaflet";

interface CenterMapProps {
  coords: [number, number] | null;
}

const CenterMap: React.FC<CenterMapProps> = ({ coords }) => {
  const map = useMap();
  const [popupOpen, setPopupOpen] = useState(false);

  // Detecta si un popup está abierto
  useMapEvent("popupopen", () => setPopupOpen(true));
  useMapEvent("popupclose", () => setPopupOpen(false));

  useEffect(() => {
    if (coords && !popupOpen) {
      map.flyTo(coords, 15, {
        animate: true, //Evita animaciones innecesarias
      });
    }
  }, [coords, map, popupOpen]); // Ahora depende de popupOpen

  return null;
};

export default CenterMap;