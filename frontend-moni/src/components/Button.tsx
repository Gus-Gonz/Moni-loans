import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "black" | "white";
  className?: string;
  disabled?: boolean;
};

const buttonClass = {
  black: "bg-black text-white hover:bg-gray-600 cursor-pointer",
  white: "bg-white text-black border border-black hover:bg-gray-300 cursor-pointer",
};

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "black",
  className = "",
  disabled = false,
}: ButtonProps) => {
  const baseClasses = "py-2 px-4 rounded transition disabled:opacity-50";
  const variantClass = buttonClass[variant] || "";

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};
