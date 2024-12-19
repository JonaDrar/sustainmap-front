import { Popup } from 'react-leaflet';

interface SitePopupProps {
  site: { position: [number, number]; name: string };
}

const SitePopup: React.FC<SitePopupProps> = ({ site }) => {
  const googleMapsLink = `https://www.google.com/maps?q=${site.position[0]},${site.position[1]}`;
  
  return (
    <Popup>
      <div className="bg-white border-2 border-blue-400 rounded-xl p-4 shadow-lg font-sans text-gray-800">
        <h3 className="text-blue-400 font-bold text-lg mb-2">{site.name}</h3>
        <p className="text-sm mb-2">
          Posición: {site.position[0].toFixed(5)}, {site.position[1].toFixed(5)}
        </p>
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline font-semibold hover:text-blue-700"
        >
          Ver en Google Maps
        </a>
      </div>
    </Popup>
  );
};

export default SitePopup;
