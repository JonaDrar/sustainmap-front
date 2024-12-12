import { Marker } from 'react-leaflet';
import SitePopup from './SitePopup';
import L from "leaflet"; 
import 'leaflet/dist/leaflet.css'; 


interface MarkerListProps {
  sites: { position: [number, number]; name: string }[];
}

const IconMarker= new L.Icon({
  iconUrl:('src/assets/peluqueria (2).png'),
  iconSize: [40,40], 
  iconAnchor: [15, 40], 
  popupAnchor: [0,-40] 
})

const MarkerList: React.FC<MarkerListProps> = ({ sites }) => {
  return (
    <>
      {sites.map((site, index) => (
        <Marker key={index} position={site.position} icon={IconMarker} >
          <SitePopup site={site} />
        </Marker>
      ))}
    </>
  );
};

export default MarkerList;
