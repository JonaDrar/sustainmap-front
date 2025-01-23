import React from "react";
import { Pointdata } from "../hooks/UseFetchPoints";
import { ShareIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";

interface SidebarMenuProps {
  points: Pointdata[];
  onPointSelect: (coords: [number, number]) => void;
  userCoords: { lat: number; lng: number } | null;
}

const typeMapping: { [key: number]: string } ={
  1:"Peluquería",
  2:"Peluquería Canina",
  3:"Centro de Acopio",
  4:"Centro de Estudio",
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ points, onPointSelect, userCoords }) => {
  const handlePointClick = (point: Pointdata) => {
    if (point.latitud != null && point.longitude != null) {
      const coords: [number, number] = [point.latitud, point.longitude];
      onPointSelect(coords);
    } else {
      console.error(`El punto con id ${point.id} no tiene coordenadas válidas.`);
    }
  };
  
  const handleShare= (point: Pointdata) => {
    const shareData = {
      title: point.name,
      text: `Revisa este lugar: ${point.name}, ubicado en ${point.address}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error("Error al compartir", err));
    } else {
      alert("La funcionalidad de compartir no esta soportada en este navegador.");
    }
  };

  return (
    <div className="bg-gray-100 p-4 h-full w-full overflow-y-auto">
    <h2 className="text-lg font-bold text-blue-600 mb-4">Lista de Puntos</h2>
    {points.length === 0 ? (
      <p className="text-gray-500">No hay puntos disponibles cerca de tu ubicación.</p>
    ) : (
      <ul className="space-y-4">
        {points.map((point) => (
          <li
            key={point.id}
            className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-blue-50 transition duration-200"
            onClick={() => handlePointClick(point)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-blue-700 text-lg">{point.name}</h3>
              <div className="flex space-x-2">
                {/* Icono de Instagram (sin funcionalidad por ahora) */}
                <button className="text-blue-600 hover:text-blue-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="..." /> {/* Ícono de Instagram */}
                  </svg>
                </button>

                {/* Teléfono (sin funcionalidad por ahora) */}
                <button className="text-blue-600 hover:text-blue-800">
                  <PhoneIcon className="h-5 w-5" />
                </button>

                {/* Google Maps */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${point.latitud},${point.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <MapPinIcon className="h-5 w-5" />
                </a>

                {/* Compartir */}
                <button
                  onClick={() => handleShare(point)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
              </div>
              <div className="mb-2 text-sm font-medium text-gray-700">
                {typeMapping[point.type] || "Tipo desconocido"}
              </div>
              <div className="flex items-center mb-2">
                <img
                  src={point.photo_url}
                  alt={point.name}
                  className="h-16 w-16 rounded-md object-cover mr-4"
                />
                <div>
                  <p className="text-sm text-gray-600">{point.address}</p>
                  <p className="text-sm text-blue-700 font-semibold">Servicios:</p>
                  <p className="text-sm text-gray-600">
                    {point.services.join(", ") || "No especificados"}
                  </p>
                </div>
              </div>
            <a
              href="#" // Reemplazar con enlace válido si se requiere
              className="text-sm text-blue-600 hover:underline"
            >
              {point.name}
            </a>
          </li>
        ))}
      </ul>
    )}
  </div>
  );
};

export default SidebarMenu;
