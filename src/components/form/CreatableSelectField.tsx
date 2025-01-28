import React, { useState } from "react";
import CreatableSelect, { Props as ReactSelectProps } from "react-select/creatable";
import { customStyles } from "./utils";

interface CreatableSelectFieldProps extends ReactSelectProps {
  label: string;
  value: string | string[];
  options: any[];
  onChange: (selected: string | string[]) => void;
}

const CreatableSelectField: React.FC<CreatableSelectFieldProps> = ({ label, options, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(value);

  const handleChange = (selected: any) => {
    console.log(selected);
    setSelectedOption(selected);
    onChange(selected.map(({ value }) => value));
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
        styles={customStyles}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
        isClearable
        placeholder={label}
        value={selectedOption}
      />
    </div>
  );
};

export default CreatableSelectField;