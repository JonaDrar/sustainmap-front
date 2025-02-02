import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface SuccessModalProps {
    name: string;
    isOpen: boolean;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    name,
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 sm:w-96 lg:w-[500px] text-center">
                {/* Ícono de Éxito */}
                <div className="flex justify-center mb-4">
                    <CheckCircleIcon className="h-12 w-12 text-green-500" />
                </div>

                {/* Mensaje */}
                <p className="text-gray-700 text-center mb-6">
                  <span className="text-blue-600 font-bold">{name}</span> se eliminó correctamente.
                </p>

                {/* Botón de cierre */}
                <div>
                    <button
                        onClick={onClose}
                        className="border border-blue-500 text-blue-500 rounded-lg px-6 py-2 sm:px-8 sm:py-3 hover:bg-red-500 hover:text-white hover:border-red-500 transition duration-200"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;