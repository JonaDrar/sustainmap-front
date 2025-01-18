import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { login} from '../authentication/auth';


const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setLoggedInUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidInput = Boolean(email.length && password.length);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      setLoggedInUser(user.user.email);
      console.log(`Usuario logeado con éxito: ${user.user.email}`);

      navigate('/map');
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/user-disabled') {
        setError('Usuario desabilitado');
      } else if (firebaseError.code === 'auth/invalid-credential') {
        setError('Credenciales inválidas. Por favor, intenta de nuevo.');
      } else {
        setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
      }
    }finally{
      setLoading(false);
    }
  };

  

  return (
    <div className="gradient-background min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-xxl p-8 w-full max-w-md login-card">
        <div className="mb-6 text-center">
          <img
            src="public\logo-mot.png"
            alt="Matter of Trust Logo"
            className="mx-auto login-logo"
          />
          <h2 className="login-header">Iniciar sesión</h2>
          <p className="text-sm text-gray-700 login-sub-header">Bienvenido/a<br /> Ingresa tus datos para comenzar.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => {setEmail(e.target.value);setError('')}}
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {setPassword(e.target.value);setError('')}}
              required
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
            >
              {showPassword ? (
                <EyeIcon className=" h-5 text-gray-500" />
              ) : (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={!isValidInput || loading}
            className={`submit-button w-full flex justify-center py-2 px-4 border border-transparent transition-colors duration-300 focus:outline-none ${isValidInput
                ? "bg-[var(--Azul-activado,#146FB7)] cursor-not-allowed text-white"
                : "bg-[var(--Azul-desactivado,#E1F4FE)] text-gray-700"
              }`} 
              >
            {loading ? 'Cargando...' : 'Confirmar'}
          </button>
        </form>

        <p className="mt-4 text-center text-md text-gray-400">
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
