import React from 'react';

export default function ItineraryItem({ title, time, location, cost }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 mb-2">
      <div>
        <h4 className="font-medium text-gray-800 text-sm">{title || 'Activity'}</h4>
        <p className="text-xs text-gray-400">{location || 'Location'} • {time || 'All Day'}</p>
      </div>
      <span className="text-xs font-semibold text-brand-600">${cost || 0}</span>
    </div>
  );
}
