import React from 'react';

export default function Button({ children, onClick, variant = 'primary', className = '', type = 'button' }) {
  const baseStyle = 'px-4 py-2 rounded-lg font-medium transition focus:outline-none';
  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
