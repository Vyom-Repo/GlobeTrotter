import React from 'react';
import { User, MapPin, Compass, Award, LogOut, X, Sparkles, FolderHeart } from 'lucide-react';
import { Button } from './Button';

export const ProfileModal = ({ isOpen, onClose, onViewSavedTrips }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-ink-900/40 backdrop-blur-xs animate-fade-in-up" />

      <div className="relative bg-surface-raised border border-accent-200 shadow-neo-floating rounded-xl max-w-sm w-full p-6 z-10 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-500 hover:text-ink-900 p-1 rounded-full hover:bg-surface-sunken"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Card Header */}
        <div className="flex items-center gap-4 border-b border-ink-300/20 pb-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-accent-400 text-white font-bold text-lg flex items-center justify-center border-2 border-white shadow-neo-raised shrink-0">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-ink-900 leading-snug">
              Alex Mercer
            </h3>
            <span className="text-xs text-accent-700 font-semibold bg-accent-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-0.5">
              <Award className="w-3 h-3 text-accent-600" /> GlobeTrotter Pro Explorer
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-center mb-5">
          <div className="bg-surface-sunken p-2.5 rounded-lg border border-accent-200/40">
            <span className="block font-display font-bold text-lg text-ink-900">12</span>
            <span className="text-[11px] text-ink-500 font-medium">Trips Planned</span>
          </div>
          <div className="bg-surface-sunken p-2.5 rounded-lg border border-accent-200/40">
            <span className="block font-display font-bold text-lg text-accent-600">8</span>
            <span className="text-[11px] text-ink-500 font-medium">Countries Visited</span>
          </div>
        </div>

        {/* Quick Menu */}
        <div className="space-y-2 text-xs font-semibold">
          <button
            onClick={() => { onClose(); onViewSavedTrips && onViewSavedTrips(); }}
            className="w-full flex items-center justify-between p-2.5 rounded-md bg-surface-raised hover:bg-accent-50 text-ink-900 border border-accent-200/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <FolderHeart className="w-4 h-4 text-accent-400" /> My Saved Trips
            </span>
            <span className="text-xs font-bold text-accent-700 bg-accent-100 px-2 py-0.5 rounded">3 Active</span>
          </button>

          <button
            onClick={() => { alert("Travel stats report generated!"); onClose(); }}
            className="w-full flex items-center justify-between p-2.5 rounded-md bg-surface-raised hover:bg-accent-50 text-ink-900 border border-accent-200/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-accent-400" /> Passport Stamp Collection
            </span>
            <span className="text-xs text-ink-500">View →</span>
          </button>
        </div>

        {/* Sign out */}
        <div className="mt-5 pt-3 border-t border-ink-300/20">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            icon={LogOut}
            onClick={() => { alert("Signed out of GlobeTrotter session."); onClose(); }}
            className="!text-semantic-danger hover:!bg-red-50"
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};
