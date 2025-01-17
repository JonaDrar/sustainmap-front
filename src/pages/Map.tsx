import { useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SelectLocation from '../components/SelectLocation';
import MarkerList from '../components/MarkerList';
import CenterMap from '../components/CenterMap';
import UseFetchPoints from '../hooks/UseFetchPoints';
import SidebarMenu from '../components/SideBarMenu';

const Map = () => {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

  const { points, deletePoint } = UseFetchPoints();

  // Fly to a location when selectedCoords changes
  const MapEffect = () => {
    const map = useMap();
    if (selectedCoords) {
      map.flyTo(selectedCoords, 15, { animate: true });
    }
    return null;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center text-blue-700">Mapa Interactivo con Leaflet</h1>
      <div className="flex justify-center my-4">
        <SelectLocation
          sites={points.map(point => ({
            position:[point.latitud, point.longitude],
            name: point.name
          }))}
          onSelect={(coords) => setSelectedCoords(coords)}
        />
      </div>
      <div className="flex" style={{ height: '100vh' }}>
        {/* Menú lateral */}
        <div className="flex-none" style={{ width: '25%' }}>
          <SidebarMenu
            points={points}
            onPointSelect={(coords) => setSelectedCoords(coords)}
          />
        </div>

        {/* Contenedor del mapa */}
        <div className="flex-grow" style={{ height: '100%' }}>
          <MapContainer
            center={[-33.4489, -70.6693]}
            zoom={9}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <MarkerList sites={points} onDeletePoint={deletePoint} />
            <MapEffect />
            <CenterMap coords={selectedCoords} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Map;
