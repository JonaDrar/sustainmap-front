import React, { useContext } from "react";
import { Pointdata } from "../hooks/UseFetchPoints";
import DropdownButton from "./DropdownButton";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import SearchBar from './SearchBar';

interface SidebarMenuProps {
  points: Pointdata[];
  onPointSelect: (coords: [number, number]) => void;
  userCoords: { lat: number; lng: number } | null;
  onDeletePoint: (id: string, name: string) => void;
  onSearch: (searchTerm: string) => void; 
}

const typeMapping: { [key: number]: string } = {
  1: "Peluquería",
  2: "Peluquería Canina",
  3: "Centro de Acopio",
  4: "Centro de Estudio",
  5: "Otros",
};

const categoriasSinServicios = [2, 3, 4]; // IDs de las categorías sin servicios

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  points,
  onPointSelect,
  onDeletePoint,
  onSearch
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

  const sortedPoints = [...points].sort((a, b) => (b.highlighted ? 1 : 0) - (a.highlighted ? 1 : 0));


  return (
    <div className="bg-white p-4 h-full w-full overflow-y-auto z-20">
      {/* Barra de búsqueda - Ahora dentro del sidebar */}
      <div className="mb-4">
      <SearchBar onSearch={onSearch} />
      </div>
      {sortedPoints.length === 0 ? (
        <p className="text-gray-500">No hay puntos disponibles cerca de tu ubicación.</p>
      ) : (
        <ul className="space-y-6">
          {sortedPoints.map((point) => (
            <li
              key={point.id}
              className={`p-4 bg-white border shadow-lg rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200 w-full max-w-md mx-auto 
              ${point.highlighted ? "border-2 border-yellow-600" : "border border-gray-300"}`} // Cambia el borde si es destacado
              onClick={() => handlePointClick(point)}
              style={{ zIndex: 1000 }}
            >
              {/* Contenedor superior: Nombre + Edición */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-blue-600 text-sm md:text-base">{point.name}</h3>
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

              {/* Contenedor para tipo de negocio con iconos */}
              <div className="flex items-center space-x-2 text-xs md:text-sm font-medium">
                {Array.isArray(point.type) &&
                  point.type.map((t) => {
                    let iconPath = "";
                    switch (t) {
                      case 1:
                        iconPath = "/images/icon-scissors.png";
                        break;
                      case 2:
                        iconPath = "/images/icono-canino.png";
                        break;
                      case 3:
                        iconPath = "/images/icono-centro-acopio.png";
                        break;
                      case 4:
                        iconPath = "/images/centro-estudio-g.png";
                        break;
                      case 5:
                        iconPath = "/images/icono-otros.png";
                        break;
                      default:
                        iconPath = "";
                    }

                    return iconPath ? (
                      <img
                        key={t}
                        src={iconPath}
                        alt={typeMapping[t]}
                        className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 object-contain"
                      />
                    ) : null;
                  })}

                <span className="text-xs md:text-sm text-gray-400 font-normal">
                  {Array.isArray(point.type)
                    ? point.type.map((t) => typeMapping[t] || "Tipo desconocido").join(", ")
                    : "Tipo desconocido"}
                </span>
              </div>

              {/* Contenedor flexible con imagen y contenido textual alineado */}
              <div className="flex items-start gap-2 md:gap-4 mt-4">
                {/* Contenedor de la imagen */}
                <div className="flex-shrink-0">
                  <img
                    src={typeof point.photo_url === "string" ? point.photo_url : point.photo_url ? URL.createObjectURL(point.photo_url) : ""}
                    alt={point.name}
                    className="w-24 h-40 md:w-32 md:h-40 rounded-md object-cover"
                  />
                </div>

                {/* Contenedor del contenido textual (Dirección + Servicios + Galería y Local + Redes Sociales) */}
                <div className="flex-1 flex flex-col justify-start">
                  {/* Redes sociales (ahora dentro del mismo div y ARRIBA de la dirección) */}
                  <div className="flex space-x-4 md:space-x-6 mb-2">
                    {/* Instagram */}
                    <a
                      href={point.rrss?.instagram || "#"}
                      target={point.rrss?.instagram ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className={`${point.rrss?.instagram ? "opacity-100" : "cursor-not-allowed opacity-50"
                        }`}
                      title={point.rrss?.instagram ? "Visitar perfil de Instagram" : "Instagram no disponible"}
                    >
                      <img src="/images/instagram.png" alt="Instagram" className="h-6 w-6 md:h-7 md:w-7 object-contain" />
                    </a>

                    {/* Teléfono */}
                    <a
                      href={point.phone ? `tel:${point.phone}` : "#"}
                      className={`${point.phone ? "opacity-100" : "cursor-not-allowed opacity-50"
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
                      className={`${point.latitud && point.longitude ? "opacity-100" : "cursor-not-allowed opacity-50"
                        }`}
                      title={point.latitud && point.longitude ? "Ver en Google Maps" : "Ubicación no disponible"}
                    >
                      <img src="/images/google.png" alt="Google Maps" className="h-6 w-6 md:h-7 md:w-7 object-contain" />
                    </a>

                    {/* Compartir */}
                    <button
                      onClick={() => (point.name ? handleShare(point) : null)}
                      className={`${point.name ? "opacity-100" : "cursor-not-allowed opacity-50"
                        }`}
                      title={point.name ? "Compartir ubicación" : "No disponible para compartir"}
                    >
                      <img src="/images/compartir-info.png" alt="Compartir" className="h-6 w-6 md:h-7 md:w-7 object-contain" />
                    </button>
                  </div>

                  {/* Dirección */}
                  <p className="text-sm text-gray-600">
                    {point.address}, {point.region}
                  </p>

                  {/* Galería y Local (Solo se renderiza si existe) */}
                  {point.gallery && (point.gallery.galleryName || point.gallery.localNumber) && (
                    <div className="flex flex-col text-green-600 text-xs md:text-sm mt-1">
                      {point.gallery.galleryName && (
                        <div className="whitespace-nowrap">
                          <span className="font-semibold text-green-600 mr-1">Galería:</span> {point.gallery.galleryName}
                        </div>
                      )}
                      {point.gallery.localNumber && (
                        <div className="whitespace-nowrap">
                          <span className="font-semibold text-green-600 mr-1">Local:</span> {point.gallery.localNumber}
                        </div>
                      )}
                    </div>
                  )}
                  {(point.services.length > 0 || !point.type.some(t => categoriasSinServicios.includes(t))) && (
                    <>
                      <p className="text-sm text-gray-600 semi-bold mt-1">Especialistas en:</p>
                      <p className="text-sm text-gray-600">{point.services.join(", ")}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Facebook y Sitio Web - Ahora debajo de la imagen */}
              <div className="mt-2 text-blue-600 text-sm flex flex-col w-full">
                {point.rrss?.facebook && (
                  <a
                    href={point.rrss.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center space-x-1"
                  >
                    <img src="/images/sitio-web.png" alt="Facebook" className="h-5 w-5 object-contain opacity-80" />
                    <span>{point.rrss.facebook}</span>
                  </a>
                )}

                {point.rrss?.other && (
                  <a
                    href={point.rrss.other}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center space-x-1"
                  >
                    <img src="/images/sitio-web.png" alt="Sitio Web" className="h-5 w-5 object-contain opacity-80" />
                    <span>{point.rrss.other}</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

};

export default SidebarMenu;