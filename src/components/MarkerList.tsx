import { Marker } from 'react-leaflet';
import SitePopup from './SitePopup';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; 
import { Pointdata } from '../hooks/UseFetchPoints';


interface MarkerListProps {
  sites: Pointdata[];
  onDeletePoint?: (id: string) => void;
}

const IconMarker= new L.Icon({
  iconUrl:('public/circulo.png'),
  iconSize: [30,30], 
  iconAnchor: [10, 35], 
  popupAnchor: [0,-35] 
})

const MarkerList: React.FC<MarkerListProps> = ({ sites, onDeletePoint }) => {
  return (
    <>
      {sites.map((site) => (
        <Marker key={site.id} position={[site.latitud, site.longitude]} icon={IconMarker} >
          <SitePopup site={site} onDeletePoint={() => onDeletePoint?.(site.id)} />
        </Marker>
      ))}
    </>
  );
};

export default MarkerList;
