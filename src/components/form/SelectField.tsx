import React from "react";

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  placeholder = "Seleccione una opción",
  ...props
}) => (
  <div className="relative h-[52px]">
    <label className="absolute left-3 top-2 text-sm text-gray-500 pointer-events-none">
      {label}
    </label>
    <select
      className="w-full h-[52px] pt-7 px-3 pb-2 border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm appearance-none"
      {...props}
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <span className="absolute right-3 top-2/4 transform -translate-y-2/4 pointer-events-none text-gray-500">
      ▼
    </span>
  </div>
);

export default SelectField;