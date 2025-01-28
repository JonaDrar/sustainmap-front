import React, { useContext } from "react";
import { Pointdata } from "../hooks/UseFetchPoints";
import DropdownButton from "./DropdownButton";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface SidebarMenuProps {
  points: Pointdata[];
  onPointSelect: (coords: [number, number]) => void;
  userCoords: { lat: number; lng: number } | null;
  onDeletePoint: (id: string, name: string) => void;
}

const typeMapping: { [key: number]: string } = {
  1: "Peluquería",
  2: "Peluquería Canina",
  3: "Centro de Acopio",
  4: "Centro de Estudio",
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  points,
  onPointSelect,
  onDeletePoint,
}) => {
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handlePointClick = (point: Pointdata) => {
    if (point.latitud != null && point.longitude != null) {
      const coords: [number, number] = [point.latitud, point.longitude];
      onPointSelect(coords);
    } else {
      console.error(`El punto con id ${point.id} no tiene coordenadas válidas.`);
    }
  };

  const handleShare = (point: Pointdata) => {
    const shareData = {
      title: point.name,
      text: `Revisa este lugar: ${point.name}, ubicado en ${point.address}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error("Error al compartir", err));
    } else {
      alert("La funcionalidad de compartir no está soportada en este navegador.");
    }
  };

  const handleEdit = (point: Pointdata) => {
    navigate("/edit-point", { state: { point } });
  };

  return (
    <div className="bg-white p-4 h-full w-full overflow-y-auto z-20">
      <h2 className="text-lg font-bold text-blue-600 mb-4">Peluquerías Sustentables</h2>
      {points.length === 0 ? (
        <p className="text-gray-500">No hay puntos disponibles cerca de tu ubicación.</p>
      ) : (
        <ul className="space-y-6">
          {points.map((point) => (
            <li
              key={point.id}
              className="p-6 bg-white border border-gray-500 shadow-lg rounded-lg cursor-pointer hover:bg-blue-50 transition duration-200"
              onClick={() => handlePointClick(point)}
              style={{zIndex: 1000}}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-blue-700 text-lg">{point.name}</h3>
                <div className="flex space-x-3">
                  {/* Icono de Instagram */}
                  <a
                    href={point.rrss?.instagram || "#"}
                    target={point.rrss?.instagram ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`text-blue-600 hover:text-blue-800 ${
                      point.rrss?.instagram ? "" : "cursor-not-allowed opacity-50"
                    }`}
                    title={
                      point.rrss?.instagram
                        ? "Visitar perfil de Instagram"
                        : "Instagram no disponible"
                    }
                  >
                    <img
                      src="/images/instagram.png"
                      alt="Instagram"
                      className="h-8 w-8 object-contain"
                    />
                  </a>

                  {/* Teléfono */}
                  <a
                    href={point.phone ? `tel:${point.phone}` : "#"}
                    className={`text-blue-600 hover:text-blue-800 ${
                      point.phone ? "" : "cursor-not-allowed opacity-50"
                    }`}
                    title={point.phone ? "Llamar" : "Teléfono no disponible"}
                  >
                    <img
                      src="/images/telefono.png"
                      alt="Teléfono"
                      className="h-8 w-8 object-contain"
                    />
                  </a>

                  {/* Google Maps */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${point.latitud},${point.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <img
                      src="/images/google.png"
                      alt="Google Maps"
                      className="h-8 w-8 object-contain"
                    />
                  </a>

                  {/* Compartir */}
                  <button
                    onClick={() => handleShare(point)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <img
                      src="/images/compartir-info.png"
                      alt="Compartir"
                      className="h-8 w-8 object-contain"
                    />
                  </button>

                  {loggedInUser && (
                    <DropdownButton
                      onEdit={() => handleEdit(point)}
                      onDelete={() => onDeletePoint(point.id, point.name)}
                      pointName={point.name}
                    />

                  )}
                </div>
              </div>

              <div className="mb-2 text-sm font-medium text-gray-700">
                {typeMapping[point.type] || "Tipo desconocido"}
              </div>

              <div className="flex items-center mb-6">
                <img
                  src={point.photo_url}
                  alt={point.name}
                  className="h-20 w-20 rounded-md object-cover mr-4"
                />
                <div>
                  <p className="text-sm text-gray-600">
                    {point.address}, {point.region}
                  </p>
                  <p className="text-sm text-blue-700 font-semibold">Servicios:</p>
                  <p className="text-sm text-gray-600">
                    {point.services.join(", ") || "No especificados"}
                  </p>
                </div>
              </div>

              {/* Redes sociales */}
              <div className="mt-4">
                {point.rrss?.facebook && (
                  <a
                    href={point.rrss.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline block"
                  >
                    <img
                      src="/images/facebook.png"
                      alt="Facebook"
                      className="h-8 w-8 object-contain"
                    />
                    Facebook
                  </a>
                )}
                <a
                  href={point.rrss?.other || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline block"
                >
                  <img
                    src="/images/sitio-web-pin.png"
                    alt="Sitio web"
                    className="h-8 w-8 object-contain"
                  />
                  Sitio Web: {point.rrss?.other || "No especificado"}
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarMenu;