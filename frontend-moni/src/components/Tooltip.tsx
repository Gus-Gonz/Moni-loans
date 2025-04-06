import React from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <span
        className={`
          absolute
          bottom-full
          left-1/2
          transform
          -translate-x-1/2
          -translate-y-1
          whitespace-nowrap
          text-s
          text-white
          bg-black
          p-1
          rounded
          opacity-0
          group-hover:opacity-100
          transition-opacity
          z-10
        `}
      >
        {text}
      </span>
    </div>
  );
};
