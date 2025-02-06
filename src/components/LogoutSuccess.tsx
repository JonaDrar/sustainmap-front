import { Link } from "react-router-dom";

const LogoutSuccess: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl px-8 py-10 text-center w-96">
        <img src="images/logo-mott_int.png" alt="Matter of Trust Logo" className="w-40 mx-auto mb-10" />
        <h2 className="text-xl font-bold text-blue-700">Sesión cerrada exitosamente</h2>
        <p className="text-gray-700 mt-2">Tu sesión ha sido cerrada correctamente.</p>
        <Link to="/login" className="text-blue-700 font-semibold mt-4 inline-block hover:underline">
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
};

export default LogoutSuccess;
