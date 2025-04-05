import React from "react";

type InputProps = {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputType?: string;
  name?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
};

const BaseInput: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  name,
  placeholder,
  inputType,
  error = false,
  errorMessage = "",
}) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <input
      type={inputType}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        w-full
        border
        border-gray-300
        rounded-md
        px-3
        py-2
        text-gray-700
        ${error ? "border-red-500" : "border-gray-300"} 
      focus:outline-none
      focus:ring
      focus:border-black`}
    />
    {error && <p className="text-sm text-red-500 mt-1">{errorMessage}</p>}
  </div>
);

export const TextInput: React.FC<InputProps> = (props) => (
  <BaseInput {...props} inputType="text" />
);

export const EmailInput: React.FC<InputProps> = (props) => (
  <BaseInput {...props} inputType="email" />
);

export const NumberInput: React.FC<InputProps> = (props) => (
  <BaseInput {...props} inputType="number" />
);

export const PasswordInput: React.FC<InputProps> = (props) => (
  <BaseInput {...props} inputType="password" />
);
