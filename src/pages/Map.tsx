import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SelectLocation from '../components/SelectLocation';
import MarkerList from '../components/MarkerList';
import CenterMap from '../components/CenterMap';
import UseFetchPoints from '../hooks/UseFetchPoints';

const Map = () => {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

  const { points } = UseFetchPoints();

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
      <MapContainer
        center={[-33.4489, -70.6693]}
        zoom={9}
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MarkerList sites={points} />
        <CenterMap coords={selectedCoords} />
      </MapContainer>
    </div>
  );
};

export default Map;
