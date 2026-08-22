import React from 'react';

export default function BudgetCard({ category, allocated, spent }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700">{category || 'General'}</span>
        <span className="text-sm text-gray-500">${spent || 0} / ${allocated || 0}</span>
      </div>
    </div>
  );
}
