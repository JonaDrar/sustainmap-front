import React from 'react';

interface ToggleFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  imageSrc: string;
}

const ToggleField: React.FC<ToggleFieldProps> = ({ label, value, onChange, imageSrc }) => {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center h-[52px] w-full border border-gray-300 rounded-md shadow-sm px-3 transition duration-150 ease-in-out sm:text-sm">
      <img src={imageSrc} alt="icon" className="w-[18px] h-[17px] mr-2 self-center" />
      <label className="self-center">{label}</label>
      <div
        className={`relative inline-flex items-center cursor-pointer w-[40px] h-[20px] rounded-full transition-all duration-300 ${
          value ? 'bg-blue-300' : 'bg-gray-200'
        }`}
      >
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          className="opacity-0 w-[40px] h-[20px] absolute z-10"
        />
        <span
          className={`absolute w-[16px] h-[16px] rounded-full transition-transform duration-300 ${
            value ? 'translate-x-[20px] bg-blue-500 border-blue-500' : 'translate-x-0 bg-white border-gray-300'
          } border-2 flex justify-center items-center`}
        >
          {value && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
};

export default ToggleField;
