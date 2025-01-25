import React from "react";

interface CategoryFilterProps {
  activeCategories: number[];
  onCategoryChange: (category: number, add: boolean) => void;
  availableCategories: number[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategories,
  onCategoryChange,
  availableCategories,
}) => {
  const handleCategoryToggle = (category: number) => {
    if (activeCategories.includes(category)) {
      onCategoryChange(category, false); // Eliminar categoría
    } else {
      onCategoryChange(category, true); // Agregar categoría
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-lg mb-4">
      <h3 className="text-lg font-semibold">Filtrar por categoría</h3>
      {availableCategories.map((category) => (
        <div key={category} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={activeCategories.includes(category)}
            onChange={() => handleCategoryToggle(category)}
            className="h-4 w-4"
          />
          <label className="text-sm">{`Categoría ${category}`}</label>
        </div>
      ))}
    </div>
  );
};

export default CategoryFilter;
