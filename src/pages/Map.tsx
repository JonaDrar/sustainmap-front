import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerList from "../components/MarkerList";
import CenterMap from "../components/maps/CenterPointMap";
import UseFetchPoints from "../hooks/UseFetchPoints";
import SidebarMenu from "../components/SidebarMenu";
import { Pointdata } from "../hooks/UseFetchPoints";
import MapBoundsUpdater from "../components/maps/FiltersPoints";
import LocateUser from "../components/maps/FoundLocateUser";
import SuccessModal from "../components/SucessModal";
import { useLocation } from "react-router-dom";

const Map = () => {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [filteredPoints, setFilteredPoints] = useState<Pointdata[]>([]);
  const { points, deletePoint } = UseFetchPoints();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const id = searchParams.get("id");

  // Nuevo estado para manejar el punto seleccionado
  const [selectedPoint, setSelectedPoint] = useState<Pointdata | null>(null);
  useEffect(() => {
    if (!points || points.length === 0) return;
  
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      if (!isNaN(latitude) && !isNaN(longitude) && (!selectedCoords || selectedCoords[0] !== latitude || selectedCoords[1] !== longitude)) {
        setSelectedCoords([latitude, longitude]);
      }
    }
  
    if (id) {
      const foundPoint = points.find(point => point.id === id);
      if (foundPoint && foundPoint.id !== selectedPoint?.id) {
        setSelectedPoint(foundPoint);
      }
    }
  }, [lat, lng, id, points, selectedCoords, selectedPoint]);

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
    setSuccessMessage(name); 
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
      {/* Mapa */}
      <div className="order-1 md:order-2 flex-grow w-full min-h-[50vh] md:h-full relative overflow-hidden">
        <MapContainer
          center={ [-33.4489, -70.6693]}
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
      </div>
      {/* Barra Lateral */}
      <div className=" order-2 md:order-1 w-full md:2/5 lg:w-2/5 bg-white overflow-y-auto p-4 md:shadow-lg">
        {/* Barra de búsqueda  */}
        <SidebarMenu
          points={id && selectedPoint ? [selectedPoint] : filteredPoints}
          onPointSelect={(coords) => setSelectedCoords(coords)}
          userCoords={userCoords}
          onDeletePoint={(id, name) => handleDeletePoint(id, name)}
          onSearch={handleSearch}
        />
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
