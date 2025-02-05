import React from "react";

interface CategoryFilterProps {
  selectedTypes: number[];
  onCategoryChange: (selectedTypes: number[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedTypes, onCategoryChange }) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, value: number) => {
    // Actualizamos el filtro de tipos
    const newSelectedTypes = e.target.checked
      ? [...selectedTypes, value]  // Agregamos el tipo seleccionado
      : selectedTypes.filter((type) => type !== value);  // Eliminamos el tipo deseleccionado
    onCategoryChange(newSelectedTypes);  // Llamamos a onCategoryChange con el nuevo arreglo
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Renderiza los checkboxes de tipos de categorías */}
      <label>
        <input
          type="checkbox"
          value={1}
          checked={selectedTypes.includes(1)}
          onChange={(e) => handleFilterChange(e, 1)}
        />
        Peluquerías
      </label>
      <label>
        <input
          type="checkbox"
          value={2}
          checked={selectedTypes.includes(2)}
          onChange={(e) => handleFilterChange(e, 2)}
        />
        Peluquerías Caninas
      </label>
      <label>
        <input
          type="checkbox"
          value={3}
          checked={selectedTypes.includes(3)}
          onChange={(e) => handleFilterChange(e, 3)}
        />
        Centros de Acopio
      </label>
      <label>
        <input
          type="checkbox"
          value={4}
          checked={selectedTypes.includes(4)}
          onChange={(e) => handleFilterChange(e, 4)}
        />
        Centros de Estudio
      </label>
      <label>
        <input
          type="checkbox"
          value={5}
          checked={selectedTypes.includes(5)}
          onChange={(e) => handleFilterChange(e, 5)}
        />
        Otros
      </label>
    </div>
  );
};

export default CategoryFilter;
