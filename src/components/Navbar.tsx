import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../authentication/auth";


const Navbar: React.FC = () => {
  const { loggedInUser } = useContext(UserContext);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logout exitoso");
    } catch (error) {
      console.error("Error al hacer logout", error);
    }
  };

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

        <div className="flex items-center space-x-6">
          {loggedInUser ? (
             <>        
             <span className="welcome-message">Bienvenido, {loggedInUser}</span>
            
             <Link to="/signup">Registrar Usuario</Link>
             <Link to="/form">Crear puntos de interés</Link>
             <Link to="/">Ver mapa</Link>
             <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
           </>
          ) : (
            <>
            
              <Link to="/login">Iniciar sesión</Link>
            </>
          )}

        </div>
      </nav>
    </header>
  );
};

export default Navbar;
