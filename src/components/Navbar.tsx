import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Navbar: React.FC = () => {
  const { loggedInUser } = useContext(UserContext);

  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">MyApp</Link>
        </div>
        <div className="nav-links">
          {loggedInUser ? (
            <span className="welcome-message">Bienvenido, {loggedInUser}</span>
          ) : (
            <>
              <Link to="/">Iniciar sesión</Link>
              <Link to="/signup">Registrarse</Link>
            </>
          )}
        </div>
      </nav>


      
    </header>
  );
};

export default Navbar;


