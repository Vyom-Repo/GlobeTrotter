import React from 'react';
import { X, MapPin, Calendar, Heart, Share2 } from 'lucide-react';
import { Button } from './Button';

export const ExploreModal = ({ isOpen, onClose, destination }) => {
  if (!isOpen || !destination) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-fade-in-up z-40"
      />

      <div className="relative bg-surface-raised border border-accent-200 shadow-neo-floating rounded-xl max-w-lg w-full overflow-hidden z-50 animate-fade-in-up">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-56 bg-slate-900">
          <img
            src={destination.coverUrl || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'}
            alt={destination.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 backdrop-blur-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-200 bg-slate-900/60 px-2.5 py-0.5 rounded backdrop-blur-xs">
              {destination.category || 'Featured Spot'}
            </span>
            <h3 className="font-display font-bold text-xl text-white mt-1 leading-tight">
              {destination.title}
            </h3>
          </div>
        </div>

        {/* Details */}
        <div className="p-5 space-y-4">
          <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
            {destination.description || 'Explore top rated attractions, local culinary tours, and scenic landmarks curated by fellow GlobeTrotter travelers.'}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs text-ink-600 bg-surface-sunken p-3 rounded-lg border border-accent-200/50">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-400 shrink-0" />
              <span>{destination.location || 'Kyoto, Japan'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-400 shrink-0" />
              <span>Best: Autumn / Spring</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={Heart}>
                Bookmark
              </Button>
              <Button variant="ghost" size="sm" icon={Share2}>
                Share
              </Button>
            </div>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
