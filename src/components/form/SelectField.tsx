import React, { useState, useEffect } from "react";
import Select, { Props as ReactSelectProps, ActionMeta, SingleValue, MultiValue, GroupBase, components, OptionProps } from "react-select";
import { customStyles } from "./utils";
import iconoTijeras from '/images/icon-scissors.png';
import iconoCanino from '/images/icono-canino.png';
import iconoCentroAcopio from '/images/icono-centro-acopio.png';
import iconoCentroEstudio from '/images/icono-centro-estudio.png';
import iconoOtros from '/images/icono-otros.png';

interface OptionType {
  label: string;
  value: string;
}

interface SelectFieldProps extends ReactSelectProps<OptionType, true, GroupBase<OptionType>> {
  label: string;
  value: MultiValue<OptionType> | SingleValue<OptionType>; 
  onChange: (newValue: MultiValue<OptionType> | SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => void;
}

const iconMap: { [key: string]: string } = {
  "1": iconoTijeras,
  "2": iconoCanino,
  "3": iconoCentroAcopio,
  "4": iconoCentroEstudio,
  "5": iconoOtros
};

const CustomOption: React.FC<OptionProps<OptionType>> = (props) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
            className="mr-2"
          />
          <label>{props.label}</label>
        </div>
        <img src={iconMap[props.data.value]} alt={props.data.label} className="w-6 h-6 ml-2" />
      </div>
    </components.Option>
  );
};

const formatOptionLabel = ({ value, label }: OptionType) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-900">{label}</span>
    <img src={iconMap[value]} alt="Selected" className="w-9 h-9 p-1" />
  </div>
);

const SelectField: React.FC<SelectFieldProps> = ({ label, options, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedOption, setSelectedOption] = useState<MultiValue<OptionType> | SingleValue<OptionType>>(value);

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);  // Actualiza 'selectedOption' cuando 'value' cambie

  const handleChange = (newValue: MultiValue<OptionType> | SingleValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
    setSelectedOption(newValue);
    onChange(newValue, actionMeta);
  };

  return (
    <div className="relative">
      <label
        className={`absolute left-3 transition-all duration-150 ease-in-out ${isFocused || selectedOption ? "top-2 text-sm text-gray-500" : "top-1/2 transform -translate-y-1/2 text-base text-gray-400"}`}
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
        components={{ Option: CustomOption }}
        isMulti
        placeholder={label}
        value={selectedOption}  // Asegúrate de que este valor se sincronice con 'selectedOption'
        formatOptionLabel={label === 'Categoría' ? formatOptionLabel : undefined}
      />
    </div>
  );
};

export default SelectField;
