import React from 'react';
import { Pointdata } from '../hooks/UseFetchPoints';

interface SidebarMenuProps {
  points: Pointdata[];
  onPointSelect: (coords: [number, number]) => void;
  userCoords: { lat: number; lng: number } | null;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ points, onPointSelect, userCoords }) => {
  const handlePointClick = (point: Pointdata) => {
    if (point.latitud != null && point.longitude != null) {
      const coords: [number, number] = [point.latitud, point.longitude];
      onPointSelect(coords);
    } else {
      console.error(`El punto con id ${point.id} no tiene coordenadas válidas.`);
    }
  };

  return (
    <div
      className="bg-gray-100 p-4 h-full w-full overflow-y-auto"
      style={{ width: '100%', height: '100%' }}
    >
      <h2 className="text-lg font-bold text-blue-600 mb-4">Lista de Puntos</h2>
      {!userCoords ? (
        <p className="text-gray-500">Esperando la ubicación del usuario...</p>
      ) : points.length === 0 ? (
        <p className="text-gray-500">
          No hay puntos disponibles en el área visible del mapa.
        </p>
      ) : (
        <ul className="space-y-2">
          {points.map((point) => (
            <li
              key={point.id}
              className="p-3 bg-white shadow rounded cursor-pointer hover:bg-blue-100 transition duration-200"
              onClick={() => handlePointClick(point)}
            >
              <h3 className="font-semibold text-blue-700">{point.name}</h3>
              <p className="text-sm text-gray-600">{point.address || 'Dirección no disponible'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarMenu;
