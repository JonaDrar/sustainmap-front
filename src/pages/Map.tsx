import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerList from "../components/MarkerList";
import CenterMap from "../components/CenterMap";
import UseFetchPoints from "../hooks/UseFetchPoints";
import SidebarMenu from "../components/SidebarMenu";
import L from "leaflet";
import { Pointdata } from "../hooks/UseFetchPoints";
import SearchBar from "../components/SearchBar";  // Importa el SearchBar
import SuccessModal from "../components/SucessModal";

const LocateUser = ({
  onLocationFound,
  userCoords,
}: {
  onLocationFound: (lat: number, lng: number) => void;
  userCoords: { lat: number; lng: number } | null;
}) => {
  const map = useMap();
  const [hasCentered, setHasCentered] = useState(false);
  const [locationRequested, setLocationRequested] = useState(false);

  useEffect(() => {
    if (userCoords && map && !hasCentered) {
      console.log("User location found:", userCoords);
      map.setView([userCoords.lat, userCoords.lng], 15);
      setHasCentered(true);
    }
  }, [userCoords, map, hasCentered]);

  useEffect(() => {
    if (!locationRequested && map) {
      setLocationRequested(true);
      map.locate({ setView: false, maxZoom: 15, watch: true });

      const onLocationFoundEvent = (e: L.LocationEvent) => {
        const { lat, lng } = e.latlng;
        onLocationFound(lat, lng);
      };

      const onLocationError = () => {
        console.log("Error al obtener ubicación");
        alert(
          "No se pudo obtener tu ubicación. Por favor, habilita la geolocalización."
        );
      };

      map.on("locationfound", onLocationFoundEvent);
      map.on("locationerror", onLocationError);

      return () => {
        map.off("locationfound", onLocationFoundEvent);
        map.off("locationerror", onLocationError);
      };
    }
  }, [map, locationRequested, onLocationFound]);

  return null;
};

const MapBoundsUpdater = ({
  points,
  setFilteredPoints,
  resetSelectedCoords,
}: {
  points: Pointdata[];
  setFilteredPoints: React.Dispatch<React.SetStateAction<Pointdata[]>>;
  resetSelectedCoords: () => void;
}) => {
  const map = useMap();
  const prevBoundsRef = useRef<L.LatLngBounds | null>(null);

  useEffect(() => {
    if (map) {
      const updateFilteredPoints = () => {
        const bounds = map.getBounds();

        if (!prevBoundsRef.current || !bounds.equals(prevBoundsRef.current)) {
          const filtered = points.filter((point) => {
            if (point.latitud == null || point.longitude == null) return false;
            const pointLocation = L.latLng(point.latitud, point.longitude);
            return bounds.contains(pointLocation);
          });
          setFilteredPoints(filtered);
          resetSelectedCoords();
          prevBoundsRef.current = bounds;
        }
      };

      updateFilteredPoints();

      map.on('moveend', updateFilteredPoints);
      map.on('zoomend', updateFilteredPoints);

      return () => {
        map.off('moveend', updateFilteredPoints);
        map.off('zoomend', updateFilteredPoints);
      };
    }
  }, [map, points, setFilteredPoints, resetSelectedCoords]);

  return null;
};

const Map = () => {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [filteredPoints, setFilteredPoints] = useState<Pointdata[]>([]);
  const { points, deletePoint } = UseFetchPoints();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pointData: Pointdata[] = points.map((point) => ({
    id: point.id,
    latitud: point.latitud,
    longitude: point.longitude,
    name: point.name,
    description: point.description || "",
    photo_url: point.photo_url || "",
    address: point.address || "",
    commune: point.commune || "",
    region: point.region || "",
    phone: point.phone || "",
    services: point.services || [],
    type: point.type,
    highlighted: point.highlighted || false,
    gallery: point.gallery || undefined,
    deleted: point.deleted || false,
    rrss: point.rrss || undefined,
  }));

  const handleLocationFound = (lat: number, lng: number) => {
    setUserCoords({ lat, lng });
  };

  const handleSearch = (searchTerm: string) => {
    const filtered = points.filter((point) =>
      point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPoints(filtered);
  };
  
  const handleDeletePoint = (id: string, name: string) => {
    deletePoint(id);
    setSuccessMessage(name); // Solo guardamos el nombre de la peluquería
  };

  const closeSuccessModal = () => {
    setSuccessMessage(null);
  };

  useEffect(() => {
    const savedUserCoords = localStorage.getItem("userCoords");
    if (savedUserCoords) {
      setUserCoords(JSON.parse(savedUserCoords));
    }

    const savedPoints = localStorage.getItem("filteredPoints");
    if (savedPoints) {
      setFilteredPoints(JSON.parse(savedPoints));
    }
  }, []);

  useEffect(() => {
    if (userCoords) {
      localStorage.setItem("userCoords", JSON.stringify(userCoords));
    }
  }, [userCoords]);

  useEffect(() => {
    if (filteredPoints.length > 0) {
      localStorage.setItem("filteredPoints", JSON.stringify(filteredPoints));
    }
  }, [filteredPoints]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Barra Lateral */}
      <div className="order-2 md:order-1 md:w-2/5 lg:w-2/5 w-full h-1/3 md:h-full bg-white overflow-y-auto p-4 relative">
        <SidebarMenu
          points={filteredPoints}
          onPointSelect={(coords) => setSelectedCoords(coords)}
          userCoords={userCoords}
          onDeletePoint={(id, name) => handleDeletePoint(id,name)}
        />
      </div>

      {/* Mapa */}
      <div className="order-1 md:order-2 flex-grow w-full h-2/3 md:h-full relative">
        <MapContainer
          center={[-33.4489, -70.6693]}
          zoom={9}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/'>CARTO</a>"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MarkerList sites={pointData} onDeletePoint={(id, name) => handleDeletePoint(id, name)} />
          <CenterMap coords={selectedCoords} />
          <MapBoundsUpdater
            points={pointData}
            setFilteredPoints={setFilteredPoints}
            resetSelectedCoords={() => setSelectedCoords(null)}
          />
          <LocateUser
            onLocationFound={handleLocationFound}
            userCoords={userCoords}
          />
        </MapContainer>

        {/* Barra de búsqueda */}
        <div className="absolute top-4 left-4 z-10">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      <SuccessModal
        name={successMessage || ""}
        isOpen={!!successMessage}
        onClose={closeSuccessModal}
      />
    </div>
  );
};

export default Map;
