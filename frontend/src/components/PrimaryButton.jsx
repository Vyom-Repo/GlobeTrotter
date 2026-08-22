import React from 'react';
import { Loader2 } from 'lucide-react';

export default function PrimaryButton({
  children,
  onClick,
  type = 'submit',
  isLoading = false,
  disabled = false,
  fullWidth = true,
  className = '',
  icon: Icon
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative py-3 px-6 rounded-xl font-medium tracking-wide text-sm transition-all duration-200 shadow-md shadow-accent-500/20
        bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 active:scale-[0.99]
        focus:outline-none focus:ring-4 focus:ring-accent-200
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-accent-500 disabled:active:scale-100
        flex items-center justify-center space-x-2
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span className="italic">Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 stroke-[1.75]" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
