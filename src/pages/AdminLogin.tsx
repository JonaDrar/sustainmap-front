import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { loginAdmin } from "../authentication/auth";
import axios from "axios";
import { backendUrlBase } from "../utils/environment";
import { AdminContext } from "../contexts/AdminContext";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setLoggedInAdmin } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidInput = Boolean(email.length && password.length);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
        const user = await loginAdmin(email, password);
        console.log("UID del usuario:", user.uid);
  
        const response = await axios.get(`${backendUrlBase}/user/${user.uid}`);
        const userData = response.data;
        
        console.log("Datos del usuario:", userData);
  
        // Verificar si el usuario es admin
        if (!userData.roles || !userData.roles.includes("admin")) {
          setError("No tienes permisos de administrador.");
          return; // Detener ejecución aquí
        }
        sessionStorage.setItem('userRole', userData.roles);
        sessionStorage.setItem("userPassword", password);
        console.log("Usuario autenticado como administrador");
        setLoggedInAdmin(true);
        navigate("/signup"); 
  
      } catch (error: unknown) {
        console.error("Error de inicio de sesión:", error);
        setLoggedInAdmin(false); 
        const firebaseError = error as { code?: string };
        if (firebaseError.code === "auth/user-disabled") {
          setError("Usuario desabilitado");
        } else if (firebaseError.code === "auth/invalid-credential") {
          setError("Credenciales inválidas. Por favor, intenta de nuevo.");
        } else {
          setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
        }
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <div className="gradient-background flex items-center justify-center p-4 h-screen">
      <div className="bg-white shadow-md rounded-xxl px-6 py-8 w-full max-w-xs sm:max-w-sm md:max-w-md login-card">
        <div className="mb-6 text-center">
          <img
            src="/images/logo-mot.png"
            alt="Matter of Trust Logo"
            className="w-24 sm:w-28 lg:w-36 mx-auto mb-4 login-logo"
          />
          <h2 className="text-lg md:text-2xl font-bold text-blue-700 login-header">Iniciar sesión de Administrador</h2>
          
        </div>

        <form onSubmit={handleLogin} className=" space-y-2 login-form">
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
              className="w-full px-4 py-2 text-sm border rounded-md"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
              className="w-full px-4 py-2 border rounded-lg text-gray-700"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 mb-4 flex items-center pr-3 focus:outline-none"
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
            className={`submit-button w-full flex justify-center py-2 px-4 border border-transparent transition-colors duration-300 focus:outline-none ${
              isValidInput
                ? "bg-[var(--Azul-activado,#146FB7)] cursor-not-allowed text-white"
                : "bg-[var(--Azul-desactivado,#E1F4FE)] text-gray-700"
            }`}
          >
            {loading ? "Cargando..." : "Siguiente"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
