import React from 'react';
// import { useMap } from 'react-leaflet';
import { Pointdata } from '../hooks/UseFetchPoints';

interface SidebarMenuProps {
  points: Pointdata[];
  onPointSelect: (coords: [number, number]) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ points, onPointSelect }) => {
//   const map = useMap();

  const handlePointClick = (point: Pointdata) => {
    const coords: [number, number] = [point.latitud, point.longitude];
    onPointSelect(coords);
    // map.flyTo(coords, 15, { animate: true });
  };

  return (
    <div
      className="bg-gray-100 p-4 h-full w-full overflow-y-auto"
      style={{ width: '100%', height: '100%' }}
    >
      <h2 className="text-lg font-bold text-blue-600 mb-4">Lista de Puntos</h2>
      {points.length === 0 ? (
        <p className="text-gray-500">No hay puntos disponibles</p>
      ) : (
        <ul className="space-y-2">
          {points.map((point) => (
            <li
              key={point.id}
              className="p-3 bg-white shadow rounded cursor-pointer hover:bg-blue-100"
              onClick={() => handlePointClick(point)}
            >
              <h3 className="font-semibold text-blue-700">{point.name}</h3>
              <p className="text-sm text-gray-600">{point.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarMenu;
