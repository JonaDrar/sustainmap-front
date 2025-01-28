import React, { useState } from "react";
import CreatableSelect, { CreatableProps } from "react-select/creatable";
import {
  components,
  OptionProps,
  StylesConfig,
  MultiValue,
  CSSObjectWithLabel,
  SingleValue,
  ActionMeta,
  GroupBase,
} from "react-select";
import { customStyles } from "./utils";

interface OptionType {
  label: string;
  value: string;
}

interface CreatableSelectFieldProps
  extends CreatableProps<OptionType, true, GroupBase<OptionType>> {
  label: string;
  value: OptionType[];
  options: OptionType[];
  onChange: (
    newValue: MultiValue<OptionType> | SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void;
}

const CustomOption: React.FC<OptionProps<OptionType>> = (props) => {
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

const CreatableSelectField: React.FC<CreatableSelectFieldProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType[]>(value);

  const handleChange = (
    newValue: MultiValue<OptionType> | SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    const selected = newValue ? (newValue as OptionType[]) : [];
    setSelectedOption(selected);
    onChange(newValue, actionMeta);
  };

  const styles = {
    ...customStyles,
    option: (
      provided: CSSObjectWithLabel,
      state: OptionProps<OptionType, true, GroupBase<OptionType>>
    ) => ({
      ...provided,
      backgroundColor: state.isSelected ? "white" : provided.backgroundColor,
      color: state.isSelected ? "black" : provided.color,
    }),
  } as StylesConfig<OptionType, true>;

  return (
    <div className="relative">
      <label
        className={`absolute left-3 transition-all duration-150 ease-in-out ${
          isFocused || selectedOption.length
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
