import React from 'react';

export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  autoComplete,
  isTextArea = false,
  rows = 3,
  className = '',
  icon: Icon
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const baseInputStyles = `
    w-full px-4 py-3 rounded-xl border text-slate-800 text-sm font-sans transition duration-200
    placeholder:text-slate-400 placeholder:italic
    bg-slate-50/50 hover:bg-white
    focus:outline-none focus:ring-2 focus:bg-white
    ${error 
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
      : 'border-accent-200/60 hover:border-accent-300 focus:border-accent-500 focus:ring-accent-100'}
  `;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 italic"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {isTextArea ? (
          <textarea
            id={inputId}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`${baseInputStyles} ${Icon ? 'pl-10' : ''}`}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`${baseInputStyles} ${Icon ? 'pl-10' : ''}`}
          />
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500 font-medium italic mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
