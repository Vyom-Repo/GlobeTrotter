import React from 'react';

export default function AuthCard({ children, className = '', maxWidth = 'max-w-md' }) {
  return (
    <div
      className={`w-full ${maxWidth} bg-white rounded-3xl shadow-xl shadow-accent-200/40 border border-accent-100/80 p-6 sm:p-10 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
