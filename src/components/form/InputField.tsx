import React, { ReactNode } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  prefixIcon,
  suffixIcon,
  placeholder,
  ...props
}) => {

  if (type === "file") {
    return (
      <div className="flex items-center justify-between border border-gray-300 rounded-lg bg-white shadow-sm p-2 h-[52px]">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center w-10 h-[40px] text-blue-500 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M16.707 10.707a1 1 0 01-1.414 0L11 6.414V15a1 1 0 11-2 0V6.414L4.707 10.707a1 1 0 01-1.414-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 010 1.414z" />
          </svg>
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          {...props}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="absolute left-3 top-2 text-sm text-gray-500 pointer-events-none">
        {label}
      </label>
      <div className="flex items-center">
        {prefixIcon && (
          <span className="absolute left-3 text-gray-500">{prefixIcon}</span>
        )}
        <input
          type={type}
          className={`h-[52px] w-full pt-7 ${suffixIcon ? "pl-10" : "pl-3"} pb-2 ${suffixIcon ? "pr-10" : "pr-3"} border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm`}
          placeholder={placeholder || label}
          {...props}
        />
        {suffixIcon && (
          <span className="absolute right-3 text-blue-500">{suffixIcon}</span>
        )}
      </div>
    </div>
  );
};

export default InputField;