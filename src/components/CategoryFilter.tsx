import React, { useState } from "react";
import iconoTijeras from '/images/icon-scissors.png';
import iconoCanino from '/images/icono-canino.png';
import iconoCentroAcopio from '/images/icono-centro-acopio.png';
import iconoCentroEstudio from '/images/icono-centro-estudio.png';
import iconoOtros from '/images/icono-otros.png';

const iconMap = {
  1: iconoTijeras,
  2: iconoCanino,
  3: iconoCentroAcopio,
  4: iconoCentroEstudio,
  5: iconoOtros,
};

interface CategoryFilterProps {
  selectedTypes: number[];
  onCategoryChange: (selectedTypes: number[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedTypes, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, value: number) => {
    const newSelectedTypes = e.target.checked
      ? [...selectedTypes, value]
      : selectedTypes.filter((type) => type !== value);
    onCategoryChange(newSelectedTypes);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm"
      >
        Categorías
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-md p-2 z-10">
          {Object.entries(iconMap).map(([key, icon]) => (
            <label key={key} className="flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer w-full">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  value={key}
                  checked={selectedTypes.includes(Number(key))}
                  onChange={(e) => handleFilterChange(e, Number(key))}
                  className="mr-2"
                />
                <span>{key}. {getCategoryLabel(Number(key))}</span>
              </div>
              <img src={icon} alt={`Icono ${key}`} className="w-6 h-6" />
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const getCategoryLabel = (type: number): string => {
  const labels: { [key: number]: string } = {
    1: "Peluquería",
    2: "Peluquería Canina",
    3: "Centro de Acopio",
    4: "Centro de Estudio",
    5: "Otros",
  };
  return labels[type] || "Desconocido";
};

export default CategoryFilter;
