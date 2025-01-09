import React, { useState } from "react";

interface DropdownButtonProps {
  onEdit: () => void;
  onDelete: () => void;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".dropdown")) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="dropdown" style={{ position: "relative", display: "inline-block" }}>
      <button onClick={toggleMenu} style={{ cursor: "pointer" }}>
        ...
      </button>
      {isOpen && (
        <div
          className="dropdown-menu"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          <div
            onClick={onEdit}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
          >
            Editar
          </div>
          <div
            onClick={onDelete}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            Eliminar
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
