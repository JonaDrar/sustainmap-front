import React from "react";
import { useNavigate } from "react-router-dom";

const CreatePointButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/edit");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
    >
      Crear Punto
    </button>
  );
};

export default CreatePointButton;
