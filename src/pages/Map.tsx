import { useState, useEffect, useRef } from 'react';
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
  // const alertShown = useRef(false); // Evita que la alerta se muestre varias veces
  // const [hasLocation, setHasLocation] = useState(false); // Estado para evitar actualizar continuamente

  useEffect(() => {
    if (userCoords && map) {
      console.log("User location found:", userCoords);
      // // Crear un nuevo pane si no existe
      // if (!map.getPane('circlePane')) {
      //   map.createPane('circlePane');
      //   map.getPane('circlePane')!.style.zIndex = '399'; // Colocar debajo de los marcadores (400 es el predeterminado para marcadores)
      // }

      // Evitar que se actualice constantemente el estado
      // if (!hasLocation) {
      //   setHasLocation(true); // Cambiar el estado solo la primera vez

        // Eliminar el círculo anterior si existe
        if (circle) {
          circle.remove();
          // map.removeLayer(circle);
        }

        // Crear un nuevo círculo con la nueva ubicación
        const newCircle = L.circle([userCoords.lat, userCoords.lng], {
          radius: userCoords.radius,
          // radius: 50000,
          color: 'blue',
          fillColor: 'blue',
          fillOpacity: 0.2,
          // pane: 'circlePane', // Asignar el pane al círculo
          // interactive: false, // Hace que el círculo no interfiera con las interacciones
          // pane: 'overlayPane', // Asegura que se renderice debajo de los marcadores
        });

        // Agregarlo al mapa
        newCircle.addTo(map);
        newCircle.bindPopup("Ubicación encontrada").openPopup();

        // Guardar el círculo en el estado
        setCircle(newCircle);

        // Centrar la vista en la ubicación del usuario sin resetear el zoom
        map.setView([userCoords.lat, userCoords.lng], 15);

        // Llamar a la función para enviar la ubicación
        // onLocationFound(userCoords.lat, userCoords.lng, 50000); // Enviar radio de 50,000 metros
      // }
    }
  }, [userCoords, map]); // , circle, hasLocation, onLocationFound

  useEffect(() => {
    // Usamos solo una vez para obtener la ubicación
    map.locate({ setView: false, maxZoom: 15, watch: true });  // Watch para actualizar ubicación

    const onLocationFoundEvent = (e: L.LocationEvent) => {
      const { lat, lng } = e.latlng;
      // const accuracy = e.accuracy / 2; // Radio de precisión
      const accuracy = 50000;
      // const accuracy = e.accuracy; // Usamos el valor real de precisión proporcionado por la API
      onLocationFound(lat, lng, accuracy); // Llamar a la función para actualizar el estado
    };

    const onLocationError = () => {
        console.log("Error al obtener ubicación");
        alert("No se pudo obtener tu ubicación. Por favor, habilita la geolocalización.");
        // alertShown.current = true; // Evita mostrar la alerta varias veces
      // }
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
      if (point.latitud == null || point.longitude == null) return false; // Evitar errores
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
            userCoords={userCoords} // Pasar userCoords al SidebarMenu
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
