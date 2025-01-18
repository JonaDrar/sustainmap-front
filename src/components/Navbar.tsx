import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import CreatePointButton from "./CreatePointButton";

const Navbar: React.FC = () => {
  const { loggedInUser } = useContext(UserContext);

  return (
    <header>
      <nav className="flex items-center justify-between p-4 bg-white border-b border-gray-200 text-[var(--Azul-activado,#146FB7)]">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/images/logo-mot.png"
            alt="Matter of Trust Logo"
            className="h-8"
          />
          <span className="ml-2 text-lg font-semibold">
            Matter of Trust
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6">
          <Link to="/map">Ver mapa</Link>

          {loggedInUser &&
            location.pathname === "/map" && (
              <Link to="/form">Crear puntos de interés</Link>

            )}
        </div>

        {loggedInUser ? (
          <Link to="/">Cerrar sesión</Link>
        ) : (
          <Link to="/">Iniciar sesión</Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
