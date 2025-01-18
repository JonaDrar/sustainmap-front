import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../authentication/auth";
import CreatePointButton from './CreatePointButton';


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
      <nav className="navbar">
        <div className="logo">
          <Link to="/">MyApp</Link>
        </div>
        <div className="nav-links">
          {loggedInUser ? (
             <>        
             <span className="welcome-message">Bienvenido, {loggedInUser}</span>
             <CreatePointButton />
             <Link to="/signup">Registrar Usuario</Link>
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
