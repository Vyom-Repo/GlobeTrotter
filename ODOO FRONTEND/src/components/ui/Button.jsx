import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out outline-none select-none rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";

  const variantStyles = {
    primary: "bg-accent-400 text-white border border-transparent hover:bg-accent-500 hover:shadow-md hover:shadow-accent-400/25 hover:-translate-y-0.5 active:translate-y-0",
    secondary: "bg-white text-accent-800 border border-slate-200 hover:border-accent-300 hover:bg-accent-50/60 hover:text-accent-900 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:-translate-y-0.5 active:translate-y-0",
    danger: "bg-white text-semantic-danger border border-red-200 hover:bg-red-50 hover:border-red-300 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0"
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
    md: "text-xs sm:text-sm px-4 py-2 gap-2 h-10",
    lg: "text-sm sm:text-base px-6 py-3 gap-2.5 h-12"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />}
    </button>
  );
};
