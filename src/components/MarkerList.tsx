import { Marker } from 'react-leaflet'; 
import SitePopup from './SitePopup';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; 
import { Pointdata } from '../hooks/UseFetchPoints';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

import iconoTijeras from '/images/icon-scissors.png';
import iconoCanino from '/images/icono-canino.png';
import iconoCentroAcopio from '/images/icono-centro-acopio.png';
import iconoCentroEstudio from '/images/centro-estudio-g.png';
import iconoOtros from '/images/icono-otros.png';

const iconMap: { [key: number]: string } = {
  1: iconoTijeras,
  2: iconoCanino,
  3: iconoCentroAcopio,
  4: iconoCentroEstudio,
  5: iconoOtros,
};

const defaultIcon = '/images/circulo.png';

interface MarkerListProps {
  sites: Pointdata[];
  onDeletePoint?: (id: string, name: string) => void;
}

const MarkerList: React.FC<MarkerListProps> = ({ sites, onDeletePoint }) => {
  const { loggedInUser } = useContext(UserContext);
  return (
    <>
      {sites.map((site) => {
        // Si el usuario no está logueado, los puntos inactivos no se deben mostrar
        if (!loggedInUser && !site.isActive) {
          return null;
        }

        // Determinar el icono a usar según la categoría
        const category = site.type.length > 0 ? site.type[0] : null;
        const iconUrl = category ? iconMap[category as number] || defaultIcon : defaultIcon;

        // Crear el ícono con opacidad si el punto está inactivo
        const icon = new L.Icon({
          iconUrl,
          iconSize: [30, 30],
          iconAnchor: [10, 35],
          popupAnchor: [0, -35],
          className: site.isActive ? '' : 'opacity-50',
        });

        return (
          <Marker key={site.id} position={[site.latitud, site.longitude]} icon={icon}>
            <SitePopup site={site} onDeletePoint={() => onDeletePoint?.(site.id, site.name)} />
          </Marker>
        );
      })}
    </>
  );
};

export default MarkerList;



// import { Marker } from 'react-leaflet'; 
// import SitePopup from './SitePopup';
// import L from 'leaflet'; 
// import 'leaflet/dist/leaflet.css'; 
// import { Pointdata } from '../hooks/UseFetchPoints';
// import { useContext } from 'react';
// import { UserContext } from '../contexts/UserContext';

// import iconoTijeras from '/images/icon-scissors.png';
// import iconoCanino from '/images/icono-canino.png';
// import iconoCentroAcopio from '/images/icono-centro-acopio.png';
// import iconoCentroEstudio from '/images/centro-estudio-g.png';
// import iconoOtros from '/images/icono-otros.png';
// import iconoTijerasGris from '/images/icono-peluqueria.png';
// import iconoCaninoGris from '/images/Icono-canina.png';
// import iconoCentroAcopioGris from '/images/Icono-acopio.png';
// import iconoCentroEstudioGris from '/images/icono-estudio.png';
// import iconoOtrosGris from '/images/icono-otras.png';

// const iconMap: { [key: number]: string } = {
//   1: iconoTijeras,
//   2: iconoCanino,
//   3: iconoCentroAcopio,
//   4: iconoCentroEstudio,
//   5: iconoOtros,
// };

// const iconMapInactive: { [key: number]: string } = {
//   1: iconoTijerasGris,
//   2: iconoCaninoGris,
//   3: iconoCentroAcopioGris,
//   4: iconoCentroEstudioGris,
//   5: iconoOtrosGris,
// };

// interface MarkerListProps {
//   sites: Pointdata[];
//   onDeletePoint?: (id: string, name: string) => void;
// }

// const MarkerList: React.FC<MarkerListProps> = ({ sites, onDeletePoint }) => {
//   const { loggedInUser } = useContext(UserContext);
//   return (
//     <>
//       {sites.map((site) => {
//         // Si el usuario no está logueado, los puntos inactivos no se deben mostrar
//         if (!loggedInUser && !site.isActive) {
//           return null;
//         }

//         // Determinar la primera categoría válida
//         const category = site.type.length > 0 ? site.type[0] : null;
//         const isActive = site.isActive;

//         // Seleccionar el icono según el estado y la categoría
//         const iconUrl = category
//           ? isActive
//             ? iconMap[category] || '/images/circulo.png'
//             : iconMapInactive[category] || '/images/circulo.png'
//           : '/images/circulo.png';

//         // Crear el ícono con opacidad si el punto está inactivo y no tiene categoría
//         const icon = new L.Icon({
//           iconUrl,
//           iconSize: [30, 30],
//           iconAnchor: [10, 35],
//           popupAnchor: [0, -35],
//           className: !isActive && !category ? 'opacity-50' : '',
//         });

//         return (
//           <Marker key={site.id} position={[site.latitud, site.longitude]} icon={icon}>
//             <SitePopup site={site} onDeletePoint={() => onDeletePoint?.(site.id, site.name)} />
//           </Marker>
//         );
//       })}
//     </>
//   );
// };

// export default MarkerList;



// import { Marker } from 'react-leaflet'; 
// import SitePopup from './SitePopup';
// import L from 'leaflet'; 
// import 'leaflet/dist/leaflet.css'; 
// import { Pointdata } from '../hooks/UseFetchPoints';
// import { useContext } from 'react';
// import { UserContext } from '../contexts/UserContext';

// import iconoTijeras from '/images/icon-scissors.png';
// import iconoCanino from '/images/icono-canino.png';
// import iconoCentroAcopio from '/images/icono-centro-acopio.png';
// import iconoCentroEstudio from '/images/centro-estudio-g.png';
// import iconoOtros from '/images/icono-otros.png';
// import iconoTijerasGris from '/images/icono-peluqueria.png';
// import iconoCaninoGris from '/images/Icono-canina.png';
// import iconoCentroAcopioGris from '/images/Icono-acopio.png';
// import iconoCentroEstudioGris from '/images/icono-estudio.png';
// import iconoOtrosGris from '/images/icono-otras.png';

// const iconMap: { [key: number]: string } = {
//   1: iconoTijeras,
//   2: iconoCanino,
//   3: iconoCentroAcopio,
//   4: iconoCentroEstudio,
//   5: iconoOtros,
// };

// const iconMapInactive: { [key: number]: string } = {
//   1: iconoTijerasGris,
//   2: iconoCaninoGris,
//   3: iconoCentroAcopioGris,
//   4: iconoCentroEstudioGris,
//   5: iconoOtrosGris,
// };

// interface MarkerListProps {
//   sites: Pointdata[];
//   onDeletePoint?: (id: string, name: string) => void;
// }

// const MarkerList: React.FC<MarkerListProps> = ({ sites, onDeletePoint }) => {
//   const { loggedInUser } = useContext(UserContext);
//   return (
//     <>
//       {sites.map((site) => {
//         // Si el usuario no está logueado, los puntos inactivos no se deben mostrar
//         if (!loggedInUser && !site.isActive) {
//           return null;
//         }

//         // Determinar el icono a usar según la categoría y estado del punto
//         const category = site.type.length > 0 ? site.type[0] : null;
//         const iconUrl = site.isActive
//           ? iconMap[category as number] || '/images/circulo.png'
//           : iconMapInactive[category as number] || '/images/circulo.png';

//         // Crear el ícono con opacidad si el punto está inactivo
//         const icon = new L.Icon({
//           iconUrl,
//           iconSize: [30, 30],
//           iconAnchor: [10, 35],
//           popupAnchor: [0, -35],
//           className: site.isActive ? '' : 'opacity-50',
//         });

//         return (
//           <Marker key={site.id} position={[site.latitud, site.longitude]} icon={icon}>
//             <SitePopup site={site} onDeletePoint={() => onDeletePoint?.(site.id, site.name)} />
//           </Marker>
//         );
//       })}
//     </>
//   );
// };

// export default MarkerList;
