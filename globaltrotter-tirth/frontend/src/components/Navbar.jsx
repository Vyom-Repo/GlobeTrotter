import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold text-brand-600">GlobeTrotter</span>
      </div>
      <div className="flex items-center space-x-4">
        <a href="/" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</a>
        <a href="/cities" className="text-gray-600 hover:text-gray-900 font-medium">Cities</a>
        <a href="/login" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition">Login</a>
      </div>
    </nav>
  );
}
