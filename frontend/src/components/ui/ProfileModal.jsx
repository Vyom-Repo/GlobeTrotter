import React from 'react';
import { X, User, Mail, Phone, MapPin, Award } from 'lucide-react';
import { Button } from './Button';

export const ProfileModal = ({ isOpen, onClose, userProfile }) => {
  if (!isOpen || !userProfile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-fade-in-up z-40"
      />

      <div className="relative bg-surface-raised border border-accent-200 shadow-neo-floating rounded-xl max-w-sm w-full p-6 z-50 animate-fade-in-up text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-ink-500 hover:text-ink-900 p-1 rounded-full hover:bg-surface-sunken cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-20 h-20 mx-auto rounded-full bg-accent-400 text-white font-bold text-2xl flex items-center justify-center border-4 border-white shadow-md mb-3">
          {userProfile.avatarUrl ? (
            <img src={userProfile.avatarUrl} alt="User" className="w-full h-full object-cover rounded-full" />
          ) : (
            <span>{userProfile.firstName?.[0] || 'U'}{userProfile.lastName?.[0] || ''}</span>
          )}
        </div>

        <h3 className="font-display font-semibold text-lg text-ink-900">
          {userProfile.firstName} {userProfile.lastName}
        </h3>
        <p className="text-xs text-accent-700 font-semibold mt-0.5 flex items-center justify-center gap-1">
          <Award className="w-3.5 h-3.5" /> GlobeTrotter Explorer
        </p>

        <div className="mt-4 pt-4 border-t border-accent-200/50 space-y-2 text-xs text-left">
          <div className="flex items-center gap-2.5 text-ink-700">
            <Mail className="w-4 h-4 text-accent-400 shrink-0" />
            <span>{userProfile.email || 'user@example.com'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-ink-700">
            <Phone className="w-4 h-4 text-accent-400 shrink-0" />
            <span>{userProfile.phone || '+91 98765 43210'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-ink-700">
            <MapPin className="w-4 h-4 text-accent-400 shrink-0" />
            <span>{userProfile.city || 'Ahmedabad'}, {userProfile.country || 'India'}</span>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-accent-200/50 flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose} className="w-full">
            Close Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
