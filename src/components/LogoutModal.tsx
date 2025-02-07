

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96 z-50">
        <h2 className="text-xl font-bold text-center text-[#146FB7]">Cerrar sesión</h2>
        <p className="text-gray-700 text-center mt-2">¿Estás seguro que deseas cerrar sesión?</p>

        <div className="flex flex-col gap-3 w-[70%] mx-auto mt-4">
          <button
            className="border border-[#146FB7] text-[#146FB7] rounded-lg px-3 py-2 text-sm sm:text-base hover:bg-red-500 hover:text-white hover:border-red-500 transition duration-200"
            onClick={onConfirm}
          >
            Cerrar sesión
          </button>
          <button
            className="border border-[#146FB7] text-[#146FB7] rounded-lg px-3 py-2 text-sm sm:text-base hover:bg-red-500 hover:text-white hover:border-red-500 transition duration-200"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal