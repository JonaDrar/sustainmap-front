import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerList from "../components/MarkerList";
import UseFetchPoints from "../hooks/UseFetchPoints";
import SidebarMenu from "../components/SidebarMenu";
import { Pointdata } from "../hooks/UseFetchPoints";
import CenterMap from "../components/maps/CenterMap";
import LocateUser from "../components/maps/FoundLocateUser";
import MapBoundsUpdater from "../components/maps/FiltersPoints";

const Map = () => {
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [filteredPoints, setFilteredPoints] = useState<Pointdata[]>([]);
  const { points, deletePoint } = UseFetchPoints();

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
    services: point.services || [],
    type: point.type,
    highlighted: point.highlighted || false,
    gallery: point.gallery || undefined,
    deleted: point.deleted || false,
  }));

  const handleLocationFound = (lat: number, lng: number) => {
    setUserCoords({ lat, lng });
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
    <div>
      <div className="flex" style={{ height: "100vh" }}>
        <div className="flex-none" style={{ width: "25%" }}>
          <SidebarMenu
            points={filteredPoints}
            onPointSelect={(coords) => setSelectedCoords(coords)}
            userCoords={userCoords}
          />
        </div>

        <div className="flex-grow" style={{ height: "100%" }}>
          <MapContainer
            center={[-33.4489, -70.6693]}
            zoom={9}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/'>CARTO</a>"
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <MarkerList sites={pointData} onDeletePoint={deletePoint} />
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
      </div>
    </div>
  );
};

export default Map;
