import { Popup } from "react-leaflet";
import { Pointdata } from "../hooks/UseFetchPoints";
import { MapPinIcon } from "@heroicons/react/24/solid";
import DropdownButton from "./DropdownButton";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

interface SitePopupProps {
  site: Pointdata;
  onDeletePoint: (id: string) => void;
}

const SitePopup: React.FC<SitePopupProps> = ({ site, onDeletePoint }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/edit-point", { state: { point: site } });
  };

  const handleDelete = () => {
    onDeletePoint(site.id);
  };

  const { loggedInUser } = useContext(UserContext);
  return (
    <Popup>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[280px] sm:w-[320px] md:w-[360px]">
        {/* Imagen superior */}
        <div className="relative">
          <img
            src={site.photo_url}
            alt={site.name}
            className="w-full h-32 sm:h-40 object-cover"
          />
        </div>
        {loggedInUser ? (
          // Botón desplegable
          <div className="ml-2">
            <DropdownButton onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        ) : null}

        {/* Contenido del cuerpo */}
        <div className="p-4">
          {/* Nombre del salón y galería (opcional) */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-blue-700 font-bold text-base sm:text-lg">{site.name}</h3>
            {site.gallery && (
              <p className="text-green-600 font-thin text-xs sm:text-sm">
                {site.gallery.galleryName}. {site.gallery.localNumber}
              </p>
            )}
          </div>

          {/* Dirección */}
          <div className="flex items-center text-gray-700 text-xs sm:text-sm font-sans mb-2">
            <MapPinIcon className="h-5 w-5 sm:h-6 sm:w-6 text-black mr-1" />
            <p>
              {site.address}, {site.commune}. {site.region}.
            </p>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default SitePopup;
