import React, { useContext, useState, useRef } from "react";
import { Pointdata } from "../hooks/UseFetchPoints";
import DropdownButton from "./DropdownButton";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import SearchBar from './SearchBar';
import useIsMobile from "../hooks/useIsMobile";

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

const categoriasSinServicios = [2, 3, 4];

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  points,
  onPointSelect,
  onDeletePoint,
  onSearch
}) => {
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPhoneModal, setShowPhoneModal] = useState<{ visible: boolean; phone: string | null }>({ visible: false, phone: null });
  const isMobileDevice = useIsMobile();
  //Drawer
  const [isExpanded, setIsExpanded] = useState(false); // Estado para controlar la expansión
  const minMenuHeight = window.innerHeight * 0.2;  // Altura contraída
  const maxMenuHeight = window.innerHeight * 0.7;  // Altura expandida
  const [menuHeight, setMenuHeight] = useState(minMenuHeight);

  const startYRef = useRef<number | null>(null);
  const startHeightRef = useRef<number>(menuHeight);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
    setMenuHeight(isExpanded ? minMenuHeight : maxMenuHeight);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    startHeightRef.current = menuHeight;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startYRef.current) return;
    const deltaY = startYRef.current - e.touches[0].clientY;
    let newHeight = startHeightRef.current + deltaY;

    if (newHeight < minMenuHeight) newHeight = minMenuHeight;
    if (newHeight > maxMenuHeight) newHeight = maxMenuHeight;

    setMenuHeight(newHeight);
  };

  const isMobile = () => {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const handlePhoneClick = (phone: string | null | undefined) => {
    if (!phone) {
      console.error("El número de teléfono no está disponible.");
      return;
    }

    if (isMobile()) {
      window.location.href = `tel:${phone}`;
    } else {
      setShowPhoneModal({ visible: true, phone });
    }
  };

  const handlePointClick = (point: Pointdata) => {
    if (point.latitud != null && point.longitude != null) {
      const coords: [number, number] = [point.latitud, point.longitude];
      onPointSelect(coords);
    } else {
      console.error(`El punto con id ${point.id} no tiene coordenadas válidas.`);
    }
  };

  const handleShare = (point: Pointdata) => {
    const shareURL = `${window.location.origin}/mapa?lat=${point.latitud}&lng=${point.longitude}&id=${point.id}`;

    const shareData = {
      title: point.name,
      text: `Revisa este lugar: ${point.name}, ubicado en ${point.address}\n\n${shareURL}`,
      url: shareURL,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error("Error al compartir", err));
    } else {
      navigator.clipboard.writeText(shareURL).then(() => {
        alert("Enlace copiado al portapapeles.");
      }).catch(err => {
        console.error("Error al copiar enlace", err);
        alert(`Copia este enlace para compartir: ${shareURL}`);
      });
    }
  };

  const handleEdit = (event: React.MouseEvent, point: Pointdata) => {
    event.stopPropagation();
    navigate("/edit-point", { state: { point } });
  };

  const sortedPoints = [...points].sort((a, b) => (b.highlighted ? 1 : 0) - (a.highlighted ? 1 : 0));

  return (
    <div
      className={`bg-white transition-all duration-300 ${isMobileDevice ? "fixed bottom-0 left-0 w-full shadow-lg" : "h-full w-full max-w-md mx-auto"} p-2`}
      style={isMobileDevice ? { height: `${menuHeight}px`, maxHeight: "90vh", minHeight: `${minMenuHeight}` } : {}}
    >
      {/* Barra de agarre */}
      <div className=" sticky top-0 bg-white z-10">
        {isMobileDevice && (
          <div
            className=" flex justify-center items-center cursor-pointer py-2 mb-2"
            onClick={toggleMenu}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div className="w-12 h-2 bg-gray-400 rounded-full"></div>
          </div>
        )}
      </div>
      <div className="overflow-y-auto h-[calc(100%-80px)] px-2">
        {/* Barra de busqueda */}
        <div className="sticky top-0 bg-white z-10 mb-4 flex justify-center">
          <div className="w-full max-w-md">
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
        {sortedPoints.length === 0 ? (
          <p className="text-gray-500 flex justify-center">No hay puntos disponibles cerca de tu ubicación.</p>
        ) : (
          <ul className="space-y-6">
            {sortedPoints
              .filter((point) => loggedInUser || point.isActive) // Solo mostramos puntos activos si no está logueado
              .map((point) => (

                <li
                  key={point.id}
                  className={`p-4 bg-white border shadow-lg rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200 w-full max-w-md mx-auto 
              ${point.highlighted ? "border-2 border-yellow-500" : "border border-gray-300"}`} // Cambia el borde si es destacado
                  onClick={() => handlePointClick(point)}
                  style={{ zIndex: 1000 }}
                >
                  {/* Contenedor superior: Nombre + Edición */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-[#146FB7] text-sm md:text-base">{point.name}</h3>
                    <div>
                      {loggedInUser && (
                        <DropdownButton
                          onEdit={(event) => handleEdit(event, point)}
                          onDelete={() => onDeletePoint(point.id, point.name)}
                          pointName={point.name}
                        />
                      )}
                    </div>
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
                        className="w-24 h-40 md:w-38 md:h-40 rounded-md object-cover"
                      />
                    </div>

                    {/* Contenedor del contenido textual (Dirección + Servicios + Galería y Local + Redes Sociales) */}
                    <div className="flex-1 flex flex-col justify-start ">
                      {/* Redes sociales (ahora dentro del mismo div y ARRIBA de la dirección) */}
                      <div className="flex space-x-6 md:space-x-8 mb-2">
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
                        <button
                          onClick={() => handlePhoneClick(point.phone)}
                          className={`${point.phone ? "opacity-100" : "cursor-not-allowed opacity-50"}`}
                          title={point.phone ? "Llamar" : "Teléfono no disponible"}
                        >
                          <img src="/images/telefono.png" alt="Teléfono" className="h-6 w-6 md:h-7 md:w-7 object-contain" />
                        </button>

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
                  <div className="mt-2 text-[#146FB7] text-sm flex flex-col w-full">
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
      {
        showPhoneModal.visible && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
            <div className="bg-white p-4 rounded-2xl shadow-lg text-center relative w-[320px]">

              {/* Botón de cerrar (X) en la esquina superior derecha */}
              <button
                onClick={() => setShowPhoneModal({ visible: false, phone: null })}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              >
                ✖
              </button>

              {/* Número de teléfono con icono */}
              <div className="flex items-center justify-center text-blue-600 text-lg font-semibold mt-2 ml-2">
                <img src="/images/telefono.png" alt="Teléfono" className="h-6 w-6 mr-2" />
                <a href={`tel:${showPhoneModal.phone}`} className="hover:underline">
                  {showPhoneModal.phone}
                </a>
              </div>

              {/* Botón "Cancelar" con efecto hover rojo */}
              <button
                onClick={() => setShowPhoneModal({ visible: false, phone: null })}
                className="mt-5 px-4 py-2 w-32 border border-blue-600 text-blue-600 rounded-lg 
             transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        )
      }
    </div >
  );

};

export default SidebarMenu;