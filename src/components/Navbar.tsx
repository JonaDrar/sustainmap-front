import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../authentication/auth";
import LogoutModal from "./LogoutModal";

const Navbar: React.FC = () => {
  const { loggedInUser } = useContext(UserContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('userPassword');
      sessionStorage.removeItem('userRole');
      console.log("Logout exitoso");
      handleCloseModal();
      navigate("/logout-success");
    } catch (error) {
      console.error("Error al hacer logout", error);
    }
  };

  if (!loggedInUser) {
    return null;
  }
    
  const showMapLink = pathname !== "/mapa";
  const getLinkClass = (path: string) => pathname === path ? 'font-bold' : '';



  return (
    <header>
      <nav className="flex items-center justify-between p-4 bg-white border-b border-gray-200 text-[var(--Azul-activado,#146FB7)]">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="images/logo-mott_int.png"
            alt="Matter of Trust Logo"
            className="h-8"
          />
          <span className="ml-2 text-lg font-semibold">Matter of Trust</span>
        </div>

        <div className="flex items-center space-x-6">
          {loggedInUser ? (
            <>
              <span className="welcome-message">
                Bienvenido, {loggedInUser}
              </span>
              <Link to="/AdminLogin" className={getLinkClass('/signup')}>Registrar Usuario</Link>
              <Link
                to="/create-point"
                className={getLinkClass("/create-point")}
              >
                Crear puntos de interés
              </Link>
              {showMapLink ? (
                <Link to="/" className={getLinkClass("/")}>
                  Ver mapa
                </Link>
              ) : null}
              <button
                onClick={() => setIsModalOpen(true)}
                className="logout-button"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={getLinkClass("/login")}>
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </nav>
      <LogoutModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleLogout}
      />
    </header>
  );
};

export default Navbar;
