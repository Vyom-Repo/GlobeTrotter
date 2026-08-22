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
  // Base classes for tactile neomorphism & accessibility
  const baseStyle = "inline-flex items-center justify-center font-sans font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 select-none cursor-pointer";
  
  // Radius mapping per design spec: md = 14px, lg = 20px
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-sm gap-1.5 min-h-[36px]",
    md: "px-5 py-2.5 text-sm rounded-md gap-2 min-h-[44px]",
    lg: "px-6 py-3.5 text-base rounded-lg gap-2.5 min-h-[52px]"
  };

  // Variant styling per design system
  const variantStyles = {
    primary: disabled
      ? "bg-surface-sunken text-ink-300 border border-ink-300/30 cursor-not-allowed shadow-none"
      : "bg-accent-400 text-white border border-accent-300/50 shadow-neo-raised hover:bg-accent-500 active:bg-accent-600 active:shadow-neo-pressed active:scale-[0.98]",
    
    secondary: disabled
      ? "bg-transparent text-ink-300 border border-ink-300/30 cursor-not-allowed"
      : "bg-surface-raised text-ink-700 border border-accent-200/80 shadow-neo-raised hover:bg-accent-50 hover:text-accent-700 active:shadow-neo-pressed active:scale-[0.98]",

    ghost: disabled
      ? "text-ink-300 cursor-not-allowed"
      : "bg-transparent text-ink-700 hover:bg-accent-50/70 hover:text-accent-700 active:bg-accent-100/50 active:scale-[0.98]",

    dashed: disabled
      ? "bg-transparent text-ink-300 border-2 border-dashed border-ink-300/40 cursor-not-allowed"
      : "bg-surface-canvas text-ink-700 border-2 border-dashed border-accent-300/80 hover:border-accent-400 hover:bg-accent-50/60 active:scale-[0.99]",

    danger: disabled
      ? "bg-surface-sunken text-ink-300 cursor-not-allowed"
      : "bg-semantic-danger text-white border border-red-400/30 shadow-neo-raised hover:bg-red-600 active:shadow-neo-pressed active:scale-[0.98]"
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

export default Button;
