import { useEffect, useRef } from "react";
import { Pointdata } from "../../hooks/UseFetchPoints";
import { useMap } from "react-leaflet";
import L from "leaflet";


const MapBoundsUpdater = ({
  points,
  setFilteredPoints,
  resetSelectedCoords,
}: {
  points: Pointdata[];
  setFilteredPoints: React.Dispatch<React.SetStateAction<Pointdata[]>>;
  resetSelectedCoords: () => void;
}) => {
  const map = useMap();
  const prevBoundsRef = useRef<L.LatLngBounds | null>(null);

  useEffect(() => {
    if (map) {
      const updateFilteredPoints = () => {
        const bounds = map.getBounds();

        if (!prevBoundsRef.current || !bounds.equals(prevBoundsRef.current)) {
          const filtered = points.filter((point) => {
            if (point.latitud == null || point.longitude == null) return false;
            const pointLocation = L.latLng(point.latitud, point.longitude);
            return bounds.contains(pointLocation);
          });
          setFilteredPoints(filtered);
          resetSelectedCoords();
          prevBoundsRef.current = bounds;
        }
      };

      updateFilteredPoints();

      map.on("moveend", updateFilteredPoints);
      map.on("zoomend", updateFilteredPoints);

      return () => {
        map.off("moveend", updateFilteredPoints);
        map.off("zoomend", updateFilteredPoints);
      };
    }
  }, [map, points, setFilteredPoints, resetSelectedCoords]);

  return null;
};


export default MapBoundsUpdater