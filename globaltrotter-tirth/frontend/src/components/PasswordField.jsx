import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordField({
  id = 'password',
  label = 'Password',
  value,
  onChange,
  placeholder = '••••••••',
  error,
  required = false,
  autoComplete = 'current-password',
  className = ''
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 italic"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full pl-10 pr-12 py-3 rounded-xl border text-slate-800 text-sm font-sans transition duration-200
            placeholder:text-slate-400 placeholder:italic
            bg-slate-50/50 hover:bg-white
            focus:outline-none focus:ring-2 focus:bg-white
            ${error 
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200' 
              : 'border-accent-200/60 hover:border-accent-300 focus:border-accent-500 focus:ring-accent-100'}`}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-accent-600 focus:outline-none focus:text-accent-700"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 font-medium italic mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
