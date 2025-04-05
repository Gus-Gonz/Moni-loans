import React from "react";

type RadioOption = {
  option: string;
  key: string;
};

type RadioInputProps = {
  label: string;
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
};

type BaseInputProps = {
    inputKey: string;
  name: string;
  value: string;
  option: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
};

const BaseRadioInput: React.FC<BaseInputProps> = ({
    inputKey,
  name,
  value,
  onChange,
  option,
}) => (
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="radio"
      name={name}
      value={inputKey}
      checked={value === inputKey}
      onChange={onChange}
      className={`
        appearance-none
        w-3.5
        h-3.5
        border-2
        border-gray-400
        rounded-full
        checked:border-black
        checked:bg-black
        focus:outline-none
        transition
        duration-200
      `}
    />
    <span className="ml-2 capitalize">{option}</span>
  </label>
);

export const RadioInputs: React.FC<RadioInputProps> = (props) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium text-gray-700">
      {props.label}
    </label>
    <div className="flex gap-4 justify-center">
      {props.options.map(({ option, key }) => (
        <BaseRadioInput
          onChange={props.onChange}
          name={props.name}
          inputKey={key}
          option={option}
          value={props.value}
        />
      ))}
    </div>
    {props.error && (
      <p className="text-sm text-red-500 mt-1">{props.errorMessage}</p>
    )}
  </div>
);
