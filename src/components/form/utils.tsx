import { components, OptionProps, StylesConfig, GroupBase } from "react-select";

interface Option {
  label: string;
  value: string;
}

export const customStyles: StylesConfig<Option, false, GroupBase<Option>> = {
  control: (base, state) => ({
    ...base,
    minHeight: 52,
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px #93c5fd" : undefined,
    "&:hover": {
      borderColor: state.isFocused ? "#3b82f6" : "#9ca3af",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#374151",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "white" : provided.backgroundColor,
    color: state.isSelected ? "black" : provided.color,
  }),
};


export interface OptionType {
  label: string;
  value: string;
}

export const CustomOption: React.FC<OptionProps<OptionType>> = (props) => {
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
