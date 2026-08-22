import React from 'react';

export default function TripCard({ trip }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-900">{trip?.title || 'Trip Title'}</h3>
      <p className="text-sm text-gray-500 mt-1">{trip?.description || 'No description provided.'}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <span>{trip?.start_date || 'TBD'} - {trip?.end_date || 'TBD'}</span>
        <span className="font-semibold text-brand-600">${trip?.total_budget || '0'}</span>
      </div>
    </div>
  );
}
