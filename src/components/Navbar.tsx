import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import CreatePointButton from './CreatePointButton';

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
            <>
              <CreatePointButton />
              <span className="welcome-message">Bienvenido, {loggedInUser}</span>
            </>
          ) : (
            <>
              <Link to="/">Iniciar sesión</Link>
              <Link to="/signup">Registrarse</Link>
              <Link to="/form">Form</Link>
            </>
          )}
        </div>
      </nav>


      
    </header>
  );
};

export default Navbar;


