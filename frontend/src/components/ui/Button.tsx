import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "inverse" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-hidden focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 min-h-[44px] cursor-pointer";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs md:text-sm gap-1.5",
    md: "px-4 py-2.5 text-sm md:text-base gap-2",
    lg: "px-6 py-3.5 text-base md:text-lg gap-2.5",
  };

  const variantClasses = {
    primary: "bg-emerald-800 text-white hover:bg-emerald-900 focus:ring-emerald-700 shadow-xs",
    secondary: "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 focus:ring-emerald-300",
    outline: "border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 focus:ring-stone-400",
    inverse: "border border-white/40 text-white bg-white/15 hover:bg-white/25 focus:ring-white/50 shadow-xs backdrop-blur-xs",
    danger: "bg-red-700 text-white hover:bg-red-800 focus:ring-red-600 shadow-xs",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
