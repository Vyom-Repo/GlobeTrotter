import React from 'react';

export const Label = ({ children, required = false, className = '' }) => (
  <label className={`block text-xs font-semibold uppercase tracking-wider text-ink-700 mb-1.5 ${className}`}>
    {children} {required && <span className="text-semantic-danger font-bold">*</span>}
  </label>
);

export const Input = React.forwardRef(({
  label,
  required,
  error,
  helperText,
  icon: Icon,
  placeholderFont = 'sans', // 'sans' | 'display'
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const placeholderStyle = placeholderFont === 'display'
    ? 'placeholder:font-display placeholder:italic placeholder:text-slate-400 font-sans'
    : 'placeholder:font-sans placeholder:text-slate-400 font-sans';

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && <Label required={required}>{label}</Label>}
      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            <Icon className="w-4 h-4 text-accent-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-white text-ink-900 text-sm leading-relaxed rounded-md px-3.5 py-2.5 min-h-[42px]
            border border-slate-300 shadow-sm transition-all duration-150 outline-none
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-semantic-danger ring-1 ring-semantic-danger' : 'hover:border-slate-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20'}
            ${placeholderStyle}
            ${className}
          `}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-semantic-danger font-medium flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-ink-500 font-normal">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = React.forwardRef(({
  label,
  required,
  error,
  helperText,
  rows = 3,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && <Label required={required}>{label}</Label>}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full bg-white text-ink-900 text-sm leading-relaxed rounded-md px-3.5 py-2.5
          border border-slate-300 shadow-sm transition-all duration-150 outline-none resize-y
          placeholder:font-sans placeholder:text-slate-400 font-sans
          ${error ? 'border-semantic-danger ring-1 ring-semantic-danger' : 'hover:border-slate-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20'}
          ${className}
        `}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-semantic-danger font-medium flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-ink-500 font-normal">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
