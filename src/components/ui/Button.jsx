import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'dashed' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  type = 'button',
  icon: Icon = null,
  iconPosition = 'left',
  title,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-sans font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 select-none cursor-pointer";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-md gap-1.5 min-h-[36px]",
    md: "px-5 py-2.5 text-sm rounded-md gap-2 min-h-[42px]",
    lg: "px-6 py-3.5 text-base rounded-lg gap-2.5 min-h-[50px]"
  };

  const variantStyles = {
    primary: disabled
      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
      : "bg-accent-400 text-white hover:bg-accent-500 active:bg-accent-600 shadow-sm hover:shadow active:scale-[0.99]",
    
    secondary: disabled
      ? "bg-transparent text-slate-400 border border-slate-200 cursor-not-allowed"
      : "bg-white text-ink-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-sm active:scale-[0.99]",

    ghost: disabled
      ? "text-slate-400 cursor-not-allowed"
      : "bg-transparent text-ink-700 hover:bg-accent-50 hover:text-accent-700 active:bg-accent-100/50",

    dashed: disabled
      ? "bg-transparent text-slate-400 border-2 border-dashed border-slate-200 cursor-not-allowed"
      : "bg-slate-50/50 text-ink-700 border-2 border-dashed border-slate-300 hover:border-accent-400 hover:bg-accent-50/50 active:scale-[0.99]",

    danger: disabled
      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
      : "bg-semantic-danger text-white hover:bg-red-600 shadow-sm active:scale-[0.99]"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};
