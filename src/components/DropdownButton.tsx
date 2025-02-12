import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Modal from "./ModalDelete";

interface DropdownButtonProps {
  onEdit: (event: React.MouseEvent) => void;
  onDelete: () => void;
  pointName: string | JSX.Element
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ onEdit, onDelete, pointName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
      const buttonRect = buttonRef.current?.getBoundingClientRect();
      setMenuPosition({
        top: (buttonRect?.bottom || 0) + window.scrollY, // Ajusta el top con el scroll vertical
        left: (buttonRect?.left || 0) + window.scrollX, // Ajusta el left con el scroll horizontal
      });
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowModal(false);
  };

  const dropdownMenu = (
    <div
      className=" bg-white  border border-gray-300 rounded-md shadow-lg z-28"
      style={{
        position: "absolute",
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
        minWidth: "120px", // Ancho mínimo para pantallas pequeñas
        maxWidth: "200px", // Límite máximo para pantallas grandes
        transform: menuPosition.left > window.innerWidth - 160 ? "translateX(-100%)" : "none", // Si está muy a la derecha, lo mueve a la izquierda
      }}
    >
      {/* Botón Editar */}
      <div
        onClick={(event) => onEdit(event)}
        className="flex items-center px-3 sm:px-2 py-2 text-gray-700 hover:bg-red-500 hover:text-white cursor-pointer transition duration-200"
      >
        <img
          src="/images/editar info.png"
          alt="Editar"
          className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 sm:mr-3" // Tamaños ajustables
        />
        <span className="text-xs sm:text-sm md:text-base font-medium">Editar</span>
      </div>

      {/* Línea divisora */}
      <div className="border-t border-gray-300"></div>

      {/* Botón Eliminar */}
      <div
        onClick={handleDeleteClick}
        className="flex items-center px-3 sm:px-2 py-2 text-gray-700  hover:bg-red-500 hover:text-white cursor-pointer transition duration-200"
      >
        <img
          src="/images/eliminar.png"
          alt="Eliminar"
          className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 sm:mr-3" // Tamaños ajustables
        />
        <span className="text-xs sm:text-sm md:text-base font-medium">Eliminar</span>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="text-gray-600 hover:text-gray-900 font-bold text-lg sm:text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <img
          src="/images/editar-info.png"
          alt="Opciones"
          className="h-5 w-5 sm:h-6 sm:w-6"
        />
      </button>
      {isOpen && ReactDOM.createPortal(dropdownMenu, document.body)}
      <Modal
        title="Eliminar"
        message={
          <>
            ¿Estás seguro que deseas eliminar{" "}
            <span className="text-[#146FB7] font-bold">{pointName}</span>?
          </>
        }
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </>
  );
};


export default DropdownButton;