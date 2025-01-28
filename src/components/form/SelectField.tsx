import React, { useState } from "react";
import Select, { Props as ReactSelectProps, ActionMeta, SingleValue, MultiValue, GroupBase } from "react-select";
import { customStyles } from "./utils";
import iconoTijeras from '/images/icon-scissors.png';
import iconoCanino from '/images/icono-canino.png';
import iconoCentroAcopio from '/images/icono-centro-acopio.png';
import iconoCentroEstudio from '/images/icono-centro-estudio.png';

interface OptionType {
  label: string;
  value: string;
}

interface SelectFieldProps extends ReactSelectProps<OptionType, false, GroupBase<OptionType>> {
  label: string;
  value: OptionType | null; // Ajustado para aceptar el valor seleccionado
  onChange: (newValue: SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => void;
}

const iconMap: { [key: string]: string } = {
  "1": iconoTijeras,
  "2": iconoCanino,
  "3": iconoCentroAcopio,
  "4": iconoCentroEstudio,
};

const formatOptionLabel = ({ value, label }: OptionType) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-900">{label}</span>
    <img src={iconMap[value]} alt="Selected" className="w-9 h-9 p-1" />
  </div>
);

const SelectField: React.FC<SelectFieldProps> = ({ label, options, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(value);

  const handleChange = (newValue: SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
    setSelectedOption(newValue);
    onChange(newValue, actionMeta);
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
        formatOptionLabel={label === 'Categoría' ? formatOptionLabel : undefined} // Usar formatOptionLabel para personalizar la etiqueta de la opción
      />
    </div>
  );
};

export default SelectField;