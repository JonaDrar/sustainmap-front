import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setLoggedInUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'demo@gmail.com' && password === 'password1?') {
      setLoggedInUser(email);
      navigate('/map');
    } else {
      setError('Correo o contraseña inválidos.');
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

      <div className="mb-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 mt-5">
          ¿No tienes una cuenta?
          {' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Regístrate
          </Link>
        </p>
      </div>


      <form onSubmit={handleLogin}>
        <div className="form-field">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="submit-button">Iniciar sesión</button>
      </form>
    </div>

    </div>

  );
};

export default Login;
