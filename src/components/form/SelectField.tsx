import React, { useState } from "react";
import Select, { Props as ReactSelectProps } from "react-select";
import { customStyles } from "./utils";
import iconoTijeras from '/images/icon-scissors.png';
import iconoCanino from '/images/icono-canino.png';
import iconoCentroAcopio from '/images/icono-centro-acopio.png';
import iconoCentroEstudio from '/images/icono-centro-estudio.png';

interface SelectFieldProps extends ReactSelectProps {
  label: string;
  value: string | string[]; // Añadido para aceptar el valor seleccionado
  onChange: (selected: string | string[]) => void;
}


const iconMap: { [key: string]: string } = {
  "1": iconoTijeras,
  "2": iconoCanino,
  "3": iconoCentroAcopio,
  "4": iconoCentroEstudio,
};


const formatOptionLabel = ({ value, label }: { value: string, label: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-900">{label}</span>
    <img src={iconMap[value]} alt="Selected" className="w-9 h-9 p-1" />
  </div>
);

const SelectField: React.FC<SelectFieldProps> = ({ label, options, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | string []>(value);

  const handleChange = (selected: string | string[]) => {
    setSelectedOption(selected);
    onChange(selected.value);
  };

  return (
    <div className="relative">
      <label
        className={`absolute left-3 transition-all duration-150 ease-in-out ${
          isFocused || selectedOption
            ? "top-2 text-sm text-gray-500"
            : "top-1/2 transform -translate-y-1/2 text-base text-gray-400"
        } pointer-events-none`}
      >
        {label}
      </label>
      <Select
        options={options}
        styles={customStyles}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
        isClearable
        placeholder={label}
        value={selectedOption} // Añadido para pasar el valor seleccionado
        formatOptionLabel={label === 'Categoría' ? formatOptionLabel : null} // Usar formatOptionLabel para personalizar la etiqueta de la opción
      />
    </div>
  );
};

export default SelectField;