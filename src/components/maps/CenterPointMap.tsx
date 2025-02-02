import { useMap } from 'react-leaflet';

interface CenterMapProps {
  coords: [number, number] | null;
}

const CenterMap: React.FC<CenterMapProps> = ({ coords }) => {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 17, { 
      animate: true, 
    });
  }
  return null;
};

export default CenterMap