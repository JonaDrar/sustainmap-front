import React from "react";

interface ModalProps {
  title: string;
  message: string | JSX.Element
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
  title,
  message,
  isOpen,
  onClose,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[85%] sm:w-[320px] md:w-[400px] lg:w-[450px] text-center relative">
        {/* Título */}
        <h2 className="text-xl font-bold text-blue-600 mb-4">{title}</h2>

        {/* Mensaje */}
        <p className="text-gray-700 mb-6 text-sm sm:text-base">
          {typeof message === "string" ? message : message}
        </p>

        {/* Botones */}
        <div className="flex flex-col gap-3 w-[70%] mx-auto">
          {/* Botón Confirmar */}
          <button
            onClick={onConfirm}
            className="border border-blue-500 text-blue-500 rounded-lg px-3 py-2 text-sm sm:text-base hover:bg-red-500 hover:text-white hover:border-red-500 transition duration-200"
          >
            {confirmText}
          </button>

          {/* Botón Cancelar */}
          <button
            onClick={onClose}
            className="border border-blue-500 text-blue-500 rounded-lg px-3 py-2 text-sm sm:text-base hover:bg-red-500 hover:text-white hover:border-red-500 transition duration-200"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;