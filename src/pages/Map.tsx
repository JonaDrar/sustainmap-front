import { useState, useEffect} from "react";
import { MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerList from "../components/MarkerList";
import CenterMap from "../components/maps/CenterPointMap";
import UseFetchPoints from "../hooks/UseFetchPoints";
import SidebarMenu from "../components/SidebarMenu";
import { Pointdata } from "../hooks/UseFetchPoints";
import MapBoundsUpdater from "../components/maps/FiltersPoints";
import LocateUser from "../components/maps/FoundLocateUser";
import SearchBar from "../components/SearchBar";  // Importa el SearchBar
import SuccessModal from "../components/SucessModal";

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
