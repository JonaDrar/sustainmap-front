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
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
    <header className="bg-white border-b border-gray-200 p-4">
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src="images/logo-mott_int.png" alt="Matter of Trust Logo" className="h-8" />
          <span className="ml-2 text-lg font-semibold text-[#146FB7]">Matter of Trust</span>
        </div>

        {/* Menú en pantallas grandes */}
        <div className="hidden md:flex items-center space-x-6 text-[#146FB7]">
          <span>Bienvenido, {loggedInUser}</span>
          <Link to="/AdminLogin" className={getLinkClass("/AdminLogin")}>Registrar Usuario</Link>
          <Link to="/create-point" className={getLinkClass("/create-point")}>Crear puntos de interés</Link>
          {showMapLink && <Link to="/" className={getLinkClass("/")}>Ver mapa</Link>}
          <button onClick={() => setIsModalOpen(true)}>Cerrar sesión</button>
        </div>

        {/* Menú hamburguesa en pantallas pequeñas */}
        <div className="md:hidden relative">
          <button onClick={toggleMenu} className="focus:outline-none">
            <img src="/images/menu-hamburguesa.png" alt="Menú" className="w-6 h-6" />
          </button>

          {/* Menú desplegable hamburguesa */}
          {menuOpen && (
            <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-3 w-52 z-50">
              <button onClick={toggleMenu} className="absolute top-2 right-2 text-gray-500 text-sm"><img src="/images/x-cerrar.png" alt="cerrar" className="w-4 h-4 mr-2" /></button>
              <p className="text-lg font-semibold text-[#146FB7] mb-2">Menú</p>
              <ul className="space-y-2">
                <li>
                  <Link to="/AdminLogin" className={`flex items-center text-gray-400 ${getLinkClass("/AdminLogin")}`}>
                    <img src="/images/adm-pin.png" alt="Registro" className="w-4 h-4 mr-2" />
                    Registro
                  </Link>
                </li>
                <li>
                  <Link to="/" className={`flex items-center text-gray-400 ${getLinkClass("/")}`}>
                    <img src="/images/mapa-menu.png" alt="Ver mapa" className="w-4 h-4 mr-2" />
                    Ver mapa
                  </Link>
                </li>
                <li>
                  <Link to="/create-point" className={`flex items-center text-gray-400 ${getLinkClass("/create-point")}`}>
                    <img src="/images/crearpto-menu.png" alt="Crear punto de intéres" className="w-4 h-4 mr-2" />
                    Crear puntos de interés
                  </Link>
                </li>
                <li>
                  <button onClick={() => setIsModalOpen(true)} className="flex items-center text-red-500 w-full">
                    <img src="/images/cierre-sesion.png" alt="Cerrar sesión" className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      <LogoutModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleLogout} />
    </header>
  );
};

export default Navbar;
