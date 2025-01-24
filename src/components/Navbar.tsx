import { useContext } from "react";
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from "../contexts/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../authentication/auth";

const Navbar: React.FC = () => {
  const { loggedInUser } = useContext(UserContext);
  const { pathname } = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logout exitoso");
    } catch (error) {
      console.error("Error al hacer logout", error);
    }
  };

  if (!loggedInUser) {
    return null; 
  }
  
  const showMapLink = pathname !== "/";
  const getLinkClass = (path: string) => pathname === path ? 'font-bold' : '';

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
          <span className="ml-2 text-lg font-semibold">Matter of Trust</span>
        </div>

        <div className="flex items-center space-x-6">
          {loggedInUser ? (
            <>
              <Link to="/signup" className={getLinkClass('/signup')}>Registrar Usuario</Link>
              <Link to="/create-point" className={getLinkClass('/create-point')}>Crear puntos de interés</Link>
              { showMapLink ? <Link to="/" className={getLinkClass('/')}>Ver mapa</Link> : null}
              <button onClick={handleLogout} className="logout-button">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={getLinkClass('/login')}>Iniciar sesión</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;