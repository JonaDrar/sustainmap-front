import { Marker } from 'react-leaflet';
import SitePopup from './SitePopup';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; 
import { Pointdata } from '../hooks/UseFetchPoints';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';


interface MarkerListProps {
  sites: Pointdata[];
  onDeletePoint?: (id: string) => void;
}

// const IconMarker= new L.Icon({
//   iconUrl:('/images/circulo.png'),
//   iconSize: [30,30], 
//   iconAnchor: [10, 35], 
//   popupAnchor: [0,-35] 
// })

const MarkerList: React.FC<MarkerListProps> = ({ sites, onDeletePoint }) => {
  const { loggedInUser } = useContext(UserContext);
  return (
    <>
      {sites.map((site) => {
        // Si el usuario no está logueado, los puntos inactivos no se deben mostrar
        if (!loggedInUser && !site.isActive) {
          return null; // No renderizamos el marcador si no está activo
        }

        // Creamos el ícono con la opacidad correspondiente
        const icon = new L.Icon({
          iconUrl: '/images/circulo.png',
          iconSize: [30, 30],
          iconAnchor: [10, 35],
          popupAnchor: [0, -35],
          className: site.isActive ? '' : 'opacity-50', // Aplicamos la clase de opacidad aquí
        });

        return (
          <Marker key={site.id} position={[site.latitud, site.longitude]} icon={icon}>
            <SitePopup site={site} onDeletePoint={() => onDeletePoint?.(site.id)} />
          </Marker>
        );
      })}
    </>
  );
};

export default MarkerList;
