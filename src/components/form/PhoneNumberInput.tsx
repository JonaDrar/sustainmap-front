import React, { useState } from "react";
import Select, {
  components,
  ControlProps,
  OptionProps,
  SingleValue,
  SingleValueProps,
  StylesConfig,
} from "react-select";
import InputField from "./InputField";
import { CountryOption, COUNTRIES } from "./countries";

interface PhoneNumberInputProps {
  onChange: (value: string) => void;
}

const customStyles: StylesConfig<CountryOption, false> = {
  control: (provided) => ({
    ...provided,
    minHeight: "52px",
    border: "none",
    boxShadow: "none",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 6px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "52px",
    paddingLeft: "8px",
  }),
};

const CustomOption: React.FC<OptionProps<CountryOption>> = (props) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center">
        <img
          src={`https://flagcdn.com/w40/${props.data.flag}.png`}
          alt={`${props.data.name} flag`}
          className="w-9 h-5 mr-2"
        />
        <span>{props.data.code}</span>
      </div>
    </components.Option>
  );
};

const CustomSingleValue: React.FC<SingleValueProps<CountryOption>> = (props) => {
  return (
    <components.SingleValue {...props}>
      <span>{props.data.code}</span>
    </components.SingleValue>
  );
};

const CustomControl: React.FC<ControlProps<CountryOption, false>> = (props) => {
  return (
    <components.Control {...props}>
      <div className="flex items-center">
        {props.hasValue && (
          <img
            src={`https://flagcdn.com/w40/${props.getValue()[0].flag}.png`}
            alt={`${props.getValue()[0].name} flag`}
            className="w-9 h-5 mr-2"
          />
        )}
        {props.children}
      </div>
    </components.Control>
  );
};

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ onChange }) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]); // Default to United States
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only numbers
    setPhoneNumber(value);
    if (onChange) onChange(`${selectedCountry.code}${value}`);
  };

  const handleCountryChange = (
    newValue: SingleValue<CountryOption>,
  ) => {
    if (newValue) {
      setSelectedCountry(newValue as CountryOption);
      onChange(`${newValue.code}${phoneNumber}`);
    }
  };

  return (
    <div className="flex space-x-2 w-full">
      <div className="border border-gray-300 rounded-md pl-4 bg-white">
        {/* Country Code Input */}
        <Select
          className="bg-transparent text-sm font-medium focus:outline-none"
          value={selectedCountry}
          onChange={(value => handleCountryChange(value as CountryOption))}
          options={COUNTRIES}
          getOptionLabel={(option) => option.code}
          getOptionValue={(option) => option.code}
          styles={customStyles}
          components={{
            Control: CustomControl,
            Option: CustomOption,
            SingleValue: CustomSingleValue,
          }}
          isSearchable={true} // Allow input in the select field
        />
      </div>
      {/* Phone Number Input */}
      <div className="flex-1">
        <InputField
          label="Número de teléfono"
          placeholder="E.g: +56912345678"
          name="phone"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
        />
      </div>
    </div>
  );
};

export default PhoneNumberInput;