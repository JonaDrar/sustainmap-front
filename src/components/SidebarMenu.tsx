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
    <h2 className="text-lg font-bold text-black mb-4">Peluquerías Sustentables</h2>
    {points.length === 0 ? (
      <p className="text-gray-500">No hay puntos disponibles cerca de tu ubicación.</p>
    ) : (
      <ul className="space-y-6">
        {points.map((point) => (
          <li
            key={point.id}
            className="p-4 bg-white border border-gray-300 shadow-lg rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200 w-full max-w-md mx-auto"
            onClick={() => handlePointClick(point)}
            style={{ zIndex: 1000 }}
          >
            {/* Contenedor superior: Nombre + Edición (más compacto) */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-blue-500 text-sm md:text-base">{point.name}</h3>
              {loggedInUser && (
                <DropdownButton
                  onEdit={() => handleEdit(point)}
                  onDelete={() => onDeletePoint(point.id, point.name)}
                  pointName={point.name}
                />
              )}
            </div>

            {/* Línea divisoria */}
            <div className="border-b border-gray-300 my-2"></div>

            {/* Contenedor para tipo de negocio y redes sociales */}
            <div className="flex justify-between items-center mb-4 md:mb-6">
              {/* Tipo de negocio */}
              <span className="text-xs md:text-sm text-gray-800 font-medium">
                {typeMapping[point.type] || "Tipo desconocido"}
              </span>

              {/* Redes sociales (iconos más grandes) */}
              <div className="flex space-x-2 md:space-x-3">
                {/* Instagram */}
                <a
                  href={point.rrss?.instagram || "#"}
                  target={point.rrss?.instagram ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className={`${
                    point.rrss?.instagram ? "opacity-100" : "cursor-not-allowed opacity-50"
                  }`}
                  title={point.rrss?.instagram ? "Visitar perfil de Instagram" : "Instagram no disponible"}
                >
                  <img src="/images/instagram.png" alt="Instagram" className="h-6 w-6 md:h-7 md:w-7 object-contain" />
                </a>

                {/* Teléfono */}
                <a
                  href={point.phone ? `tel:${point.phone}` : "#"}
                  className={`${
                    point.phone ? "opacity-100" : "cursor-not-allowed opacity-50"
                  }`}
                  title={point.phone ? "Llamar" : "Teléfono no disponible"}
                >
                  <img src="/images/telefono.png" alt="Teléfono" className="h-6 w-6 md:h-7 md:w-7 object-contain" />
                </a>

                {/* Google Maps */}
                <a
                  href={
                    point.latitud && point.longitude
                      ? `https://www.google.com/maps/search/?api=1&query=${point.latitud},${point.longitude}`
                      : "#"
                  }
                  target={point.latitud && point.longitude ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className={`${
                    point.latitud && point.longitude ? "opacity-100" : "cursor-not-allowed opacity-50"
                  }`}
                  title={point.latitud && point.longitude ? "Ver en Google Maps" : "Ubicación no disponible"}
                >
                  <img src="/images/google.png" alt="Google Maps" className="h-6 w-6 md:h-7 md:w-7 object-contain" />
                </a>

                {/* Compartir */}
                <button
                  onClick={() => (point.name ? handleShare(point) : null)}
                  className={`${
                    point.name ? "opacity-100" : "cursor-not-allowed opacity-50"
                  }`}
                  title={point.name ? "Compartir ubicación" : "No disponible para compartir"}
                >
                  <img src="/images/compartir-info.png" alt="Compartir" className="h-6 w-6 md:h-7 md:w-7 object-contain" />
                </button>
              </div>
            </div>

            {/* Contenedor flexible con imagen y contenido */}
            <div className="flex items-start gap-4">
              {/* Imagen */}
              <img
                src={point.photo_url}
                alt={point.name}
                className="w-24 h-32 md:w-32 md:h-32 rounded-md object-cover"
              />

              {/* Contenido a la derecha */}
              <div className="flex-1">
                {/* Dirección */}
                <p className="text-sm text-gray-600">
                  {point.address}, {point.region}
                </p>

                {/* Servicios */}
                <p className="text-sm text-blue-700 font-semibold mt-2">Servicios:</p>
                <p className="text-sm text-gray-600">{point.services.join(", ") || "No especificados"}</p>

                {/* Facebook y Sitio Web - Se muestran solo si existen */}
                <div className="mt-3 space-y-2">
                  {/* Facebook */}
                  {point.rrss?.facebook && (
                    <a
                      href={point.rrss.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:underline"
                    >
                      <img src="/images/sitio-web-pin.png" alt="Facebook" className="h-5 w-5 object-contain" />
                      <span>Facebook</span>
                    </a>
                  )}

                  {/* Sitio Web */}
                  {point.rrss?.other && (
                    <a
                      href={point.rrss.other}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:underline"
                    >
                      <img src="/images/sitio-web-pin.png" alt="Sitio Web" className="h-5 w-5 object-contain" />
                      <span>Visitar sitio web</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
  );
};

export default SidebarMenu;