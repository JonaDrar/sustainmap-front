import React, { useState } from "react";
import CreatableSelect, { Props as ReactSelectProps } from "react-select/creatable";
import { components } from "react-select";
import { customStyles } from "./utils";

interface CreatableSelectFieldProps extends ReactSelectProps {
  label: string;
  value: string | string[];
  options: any[];
  onChange: (selected: string | string[]) => void;
}

const CustomOption = (props: any) => {



  return (
    <components.Option {...props}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
          className="mr-2 bg-white-500 rounded-md"
        />
        <label>{props.label}</label>
      </div>
    </components.Option>
  );
};

const CreatableSelectField: React.FC<CreatableSelectFieldProps> = ({ label, options, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(value);

  const handleChange = (selected: any) => {
    setSelectedOption(selected);
    onChange(selected.map(({ value }) => value));
  };

  const styles = {
    ...customStyles,
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'white' : provided.backgroundColor,
      color: state.isSelected ? 'black' : provided.color,
    }),
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
      <CreatableSelect
        isMulti={true}
        options={options}
        styles={styles}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
        isClearable
        placeholder={label}
        value={selectedOption}
        components={{ Option: CustomOption }}
        hideSelectedOptions={false} // No mostrar los valores seleccionados cuando el menú está cerrado
        closeMenuOnSelect={false} // Mantener el menú abierto al seleccionar una opción
      />
    </div>
  );
};

export default CreatableSelectField;