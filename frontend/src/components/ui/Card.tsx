import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
  hoverable = false,
}) => {
  const hoverClasses = hoverable
    ? "hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer"
    : "";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-stone-200 shadow-xs p-4 md:p-6 ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};

