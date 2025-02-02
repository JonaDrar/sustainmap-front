import L from "leaflet"

const pointMarker = new L.Icon({
    iconUrl: 'images/icon-pin.png', // Ruta de tu imagen
    iconSize: [32, 32], // Tamaño del ícono [ancho, alto]
    iconAnchor: [16, 32], // Punto de anclaje del ícono [x, y]
    popupAnchor: [0, -32], // Punto donde se abrirá el popup en relación con el ícono
  });

  export default pointMarker