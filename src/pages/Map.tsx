import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SelectLocation from '../components/SelectLocation';
import MarkerList from '../components/MarkerList';
import CenterMap from '../components/CenterMap';
import UseFetchPoints from '../hooks/UseFetchPoints';
import SidebarMenu from '../components/SidebarMenu';
import L from 'leaflet';

const LocateUser = ({
  onLocationFound,
  userCoords,
}: {
  onLocationFound: (lat: number, lng: number, accuracy: number) => void;
  userCoords: { lat: number; lng: number; radius: number } | null;
}) => {
  const map = useMap();
  const [circle, setCircle] = useState<L.Circle | null>(null);

  useEffect(() => {
    if (userCoords && map) {
      // Eliminar el círculo anterior si existe
      if (circle) {
        circle.remove();
      }

      // Crear un nuevo círculo con la nueva ubicación
      const newCircle = L.circle([userCoords.lat, userCoords.lng], {
        radius: userCoords.radius,
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.2,
      });

      // Agregarlo al mapa
      newCircle.addTo(map);
      newCircle.bindPopup("Ubicación encontrada").openPopup();

      // Guardar el círculo en el estado
      setCircle(newCircle);
    }
  }, [userCoords, map, circle]);

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 15, watch: true });  // Watch para actualizar ubicación

    const onLocationFoundEvent = (e: L.LocationEvent) => {
      const { lat, lng } = e.latlng;
      const accuracy = e.accuracy / 2; // Radio de precisión
      onLocationFound(lat, lng, accuracy);
    };

    const onLocationError = () => {
      alert("No se pudo obtener tu ubicación. Por favor, habilita la geolocalización.");
    };

    map.on('locationfound', onLocationFoundEvent);
    map.on('locationerror', onLocationError);

    return () => {
      map.off('locationfound', onLocationFoundEvent);
      map.off('locationerror', onLocationError);
    };
  }, [map, onLocationFound]);

  return null;
};

const Map = () => {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; radius: number } | null>(null);
  const { points, deletePoint } = UseFetchPoints();

  // Función para manejar la localización del usuario
  const handleLocationFound = (lat: number, lng: number, accuracy: number) => {
    setUserCoords({ lat, lng, radius: accuracy });
  };

  // Filtrar los puntos dentro del radio usando distanceTo
  const getPointsWithinRadius = () => {
    if (!userCoords) return [];
    const userLocation = L.latLng(userCoords.lat, userCoords.lng);
    return points.filter(point => {
      const pointLocation = L.latLng(point.latitud, point.longitude);
      const distance = userLocation.distanceTo(pointLocation); // Calcula la distancia entre puntos
      return distance <= userCoords.radius; // Filtra los puntos dentro del radio
    });
  };

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
            position: [point.latitud, point.longitude],
            name: point.name
          }))}
          onSelect={(coords) => setSelectedCoords(coords)}
        />
      </div>
      <div className="flex" style={{ height: '100vh' }}>
        {/* Menú lateral */}
        <div className="flex-none" style={{ width: '25%' }}>
          <SidebarMenu
            points={getPointsWithinRadius()} // Solo los puntos filtrados
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
            <MarkerList sites={points} onDeletePoint={deletePoint} /> {/* Mostrar todos los puntos en el mapa */}
            <MapEffect />
            <CenterMap coords={selectedCoords} />
            <LocateUser onLocationFound={handleLocationFound} userCoords={userCoords} /> {/* Ubicación del usuario */}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Map;
