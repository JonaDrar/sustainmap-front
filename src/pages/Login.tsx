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
    <div className="login-container min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md login-card">
        <div className="mb-6 text-center">
          <img
            src="src\assets\logo-mot.png"
            alt="Matter of Trust Logo"
            className="mx-auto login-logo"
          />
          <h2 className="login-header">Iniciar sesión</h2>
          <p className="text-sm text-gray-700 login-sub-header">Bienvenido/a<br /> Ingresa tus datos para comenzar.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 login-form">
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Siguiente
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          ¿No tienes una cuenta?
          <Link
            to="/signup"
            className="font-medium text-gray-700 hover:text-gray-500 ml-1"
          >
            Ingresa aquí!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
