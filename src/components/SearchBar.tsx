import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Manejo de cambio en el input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Manejo de envío del formulario
  const handleSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    onSearch(searchTerm.trim() === "" ? "" : searchTerm);
  };

    // Manejo de la tecla Enter en el input
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
    };

  // Función para borrar el contenido del input
  const handleClear = () => {
    setSearchTerm("");
    // onSearch(""); // Llama a la búsqueda con una cadena vacía
  };

  return (
    <div className="relative p-3  bg-white shadow-md border border-gray-900/30 rounded-lg flex items-center w-full max-w-md mx-auto h-12">
      {/* Campo de entrada */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Buscar"
        className="pl-2 pr-20 py-2 w-full border-none focus:ring-0 outline-none bg-transparent text-gray-800 placeholder-[#146FB7]"
      />

      {/* Contenedor de íconos (Lupa + X) */}
      <div className="absolute right-3 flex items-center space-x-3">
        {/* Botón de búsqueda (Lupa) - Ahora va primero */}
        <button type="submit" onClick={handleSubmit}>
          <img src="/images/lupa-busqueda.png" alt="Buscar" className="w-5 h-5 opacity-80 hover:opacity-100" />
        </button>

        {/* Botón para limpiar (X) */}
        <button type="button" onClick={handleClear}>
          <img src="/images/close.png" alt="Limpiar" className="w-5 h-5 opacity-80 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;