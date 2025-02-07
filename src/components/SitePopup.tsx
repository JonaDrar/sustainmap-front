import { Popup } from "react-leaflet";
import { Pointdata } from "../hooks/UseFetchPoints";
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
    <Popup 
      autoPan={true} 
      autoPanPadding={[80, 80]} 
      keepInView={true} 
      maxWidth={360} 
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[280px] sm:w-[320px] md:w-[360px]">
        {/* Imagen superior */}
        <div className="relative">
          <img
            src={typeof site.photo_url === 'string' ? site.photo_url : ''}
            alt={site.name}
            className="w-full h-32 sm:h-40 object-cover"
          />
        </div>
        {loggedInUser ? (
          <div className="ml-2 mt-2">
            <DropdownButton
              onEdit={handleEdit}
              onDelete={handleDelete}
              pointName={<span className="text-[#146FB7] font-bold">{site.name}</span>}
            />
          </div>
        ) : null}

        {/* Contenido del cuerpo */}
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
            <h3 className="text-[#146FB7] font-bold text-base md:text-lg">
              {site.name}
            </h3>

            {site.gallery && (
              <div className="flex flex-col md:flex-row md:items-center md:gap-3 text-green-600 font-medium text-xs md:text-sm mt-1 md:mt-0">
                {site.gallery.galleryName && (
                  <div className="whitespace-nowrap">
                    <span>Galería:</span> {site.gallery.galleryName}
                  </div>
                )}
                {site.gallery.localNumber && (
                  <div className="whitespace-nowrap">
                    <span>Local:</span> {site.gallery.localNumber}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dirección */}
          <div className="flex items-center text-gray-700 text-xs sm:text-sm font-sans mb-2">
            <img
              src="/images/location-popup.png"
              alt="Location"
              className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 sm:mr-3"
            />
            <p>{site.address}, {site.commune}. {site.region}.</p>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default SitePopup;
