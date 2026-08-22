import React from 'react';
import { X, Compass, MapPin, Calendar, Plus, Sparkles } from 'lucide-react';
import { Button } from './Button';

export const ExploreModal = ({ isOpen, onClose, mode = 'explore', onLoadTrip }) => {
  if (!isOpen) return null;

  const sampleTrips = [
    {
      id: 't1',
      name: 'Kyoto Cherry Blossom Special',
      destinations: ['Kyoto', 'Gion', 'Arashiyama'],
      dates: 'Sep 12 - Sep 20, 2026',
      stopsCount: 2,
      budget: '¥42,500',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 't2',
      name: 'Paris Art & Pastry Getaway',
      destinations: ['Paris', 'Versailles'],
      dates: 'Oct 04 - Oct 10, 2026',
      stopsCount: 3,
      budget: '€2,400',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 't3',
      name: 'Swiss Alpine Train Journey',
      destinations: ['Zurich', 'Zermatt', 'Lucerne'],
      dates: 'Nov 15 - Nov 22, 2026',
      stopsCount: 4,
      budget: '$3,100',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-ink-900/40 backdrop-blur-xs animate-fade-in-up" />

      <div className="relative bg-surface-raised border border-accent-200 shadow-neo-floating rounded-xl max-w-2xl w-full p-6 z-10 animate-fade-in-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-ink-300/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-accent-400" />
            <h3 className="font-display font-semibold text-xl text-ink-900">
              {mode === 'my-trips' ? 'My Saved Trips' : 'Explore Featured Itineraries'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-ink-500 hover:text-ink-900 hover:bg-surface-sunken"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sampleTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-surface-raised rounded-lg border border-accent-200 shadow-neo-raised overflow-hidden hover:shadow-neo-floating transition-all group flex flex-col justify-between"
            >
              <div className="h-32 w-full relative overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-3 text-white text-xs font-semibold px-2 py-0.5 rounded bg-ink-900/60 backdrop-blur-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-accent-200" /> {trip.destinations.join(', ')}
                </span>
              </div>

              <div className="p-3.5 space-y-2">
                <h4 className="font-display font-semibold text-base text-ink-900 leading-snug">
                  {trip.name}
                </h4>
                <div className="flex items-center justify-between text-xs text-ink-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-accent-400" /> {trip.dates}</span>
                  <span className="font-semibold text-ink-700">{trip.budget}</span>
                </div>
              </div>

              <div className="p-3.5 pt-0 flex justify-end">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    onLoadTrip && onLoadTrip(trip);
                    onClose();
                  }}
                >
                  Open Trip →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
