import { useMap } from 'react-leaflet';

interface CenterMapProps {
  coords: [number, number] | null;
}

const CenterMap: React.FC<CenterMapProps> = ({ coords }) => {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 15, { 
      animate: true, 
    });
  }
  return null;
};

export default CenterMap;
