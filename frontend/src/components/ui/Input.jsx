import React from 'react';

export const Label = ({ children, required = false, className = '' }) => (
  <label className={`block text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-500 mb-1.5 ${className}`}>
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
    ? 'placeholder:font-display placeholder:italic placeholder:text-ink-500/70 font-sans'
    : 'placeholder:font-sans placeholder:text-ink-500/70 font-sans';

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && <Label required={required}>{label}</Label>}
      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3.5 text-ink-500 pointer-events-none flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-surface-sunken text-ink-900 text-[15px] leading-relaxed rounded-md px-4 py-2.5 min-h-[44px]
            shadow-neo-pressed border transition-all duration-150 outline-none
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-semantic-danger ring-1 ring-semantic-danger' : 'border-accent-200/50 hover:border-accent-300 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30'}
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
          w-full bg-surface-sunken text-ink-900 text-[15px] leading-relaxed rounded-md px-4 py-3
          shadow-neo-pressed border transition-all duration-150 outline-none resize-y
          placeholder:font-sans placeholder:text-ink-500/70 font-sans
          ${error ? 'border-semantic-danger ring-1 ring-semantic-danger' : 'border-accent-200/50 hover:border-accent-300 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30'}
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
