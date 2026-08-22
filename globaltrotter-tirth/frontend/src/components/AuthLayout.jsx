import React from 'react';
import { Compass } from 'lucide-react';

export default function AuthLayout({ children, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-accent-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Branding Header */}
      <div className="mb-6 sm:mb-8 text-center flex flex-col items-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-accent-500 text-white flex items-center justify-center shadow-md shadow-accent-200">
            <Compass className="w-6 h-6 animate-spin-slow stroke-[1.5]" />
          </div>
          <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-accent-900 italic">
            GlobeTrotter
          </span>
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 italic max-w-md font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Main Content / Auth Card */}
      <div className="w-full flex justify-center">
        {children}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-slate-500 italic font-normal">
        © {new Date().getFullYear()} GlobeTrotter. Plan your next adventure seamlessly.
      </footer>
    </div>
  );
}
