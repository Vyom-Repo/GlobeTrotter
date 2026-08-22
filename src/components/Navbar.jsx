import React, { useState, useRef, useEffect } from 'react';
import { Compass, Settings, Bell, User, LayoutDashboard, Map, Sparkles } from 'lucide-react';
import { SettingsModal } from './ui/SettingsModal';
import { NotificationsPopover } from './ui/NotificationsPopover';
import { ProfileModal } from './ui/ProfileModal';
import { ExploreModal } from './ui/ExploreModal';

export const Navbar = ({ currentScreen, onNavigate }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [exploreModalMode, setExploreModalMode] = useState(null); // 'dashboard' | 'my-trips' | 'explore' | null

  const notifRef = useRef(null);

  // Close notification popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationsOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface-canvas/90 backdrop-blur-md border-b border-accent-200/50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6 lg:gap-8">
            <div
              onClick={() => onNavigate('screen4')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-raised border border-accent-200 shadow-neo-raised flex items-center justify-center group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-ink-900 tracking-tight">
                  Globe<span className="text-accent-400">Trotter</span>
                </span>
                <span className="block text-[10px] text-ink-500 font-sans tracking-widest uppercase font-semibold">
                  Journal UI
                </span>
              </div>
            </div>

            {/* Main Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={() => setExploreModalMode('dashboard')}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-ink-700 hover:text-ink-900 hover:bg-surface-raised transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-accent-400" /> Dashboard
              </button>

              <button
                onClick={() => setExploreModalMode('my-trips')}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-ink-700 hover:text-ink-900 hover:bg-surface-raised transition-colors flex items-center gap-1.5"
              >
                <Map className="w-3.5 h-3.5 text-accent-400" /> My Trips
              </button>

              <button
                onClick={() => setExploreModalMode('explore')}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-ink-700 hover:text-ink-900 hover:bg-surface-raised transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-400" /> Explore
              </button>

              <span className="text-ink-300 mx-1">|</span>

              <button
                onClick={() => onNavigate('screen4')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  currentScreen === 'screen4'
                    ? 'bg-accent-100 text-accent-800 border border-accent-200/80 shadow-xs'
                    : 'text-ink-700 hover:text-ink-900 hover:bg-surface-raised'
                }`}
              >
                Plan Trip (Screen 04)
              </button>

              <button
                onClick={() => onNavigate('screen5')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  currentScreen === 'screen5'
                    ? 'bg-accent-100 text-accent-800 border border-accent-200/80 shadow-xs'
                    : 'text-ink-700 hover:text-ink-900 hover:bg-surface-raised'
                }`}
              >
                Build Itinerary (Screen 05)
              </button>
            </nav>
          </div>

          {/* Right Action Icons & Interactive Modals */}
          <div className="flex items-center gap-3">
            {/* Theme Indicator */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-50 text-accent-800 border border-accent-200">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              light-blue
            </span>

            {/* 1. Settings Button (⚙) */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              title="Open Settings"
              className="w-9 h-9 rounded-full bg-surface-raised border border-accent-200/60 shadow-neo-raised hover:bg-accent-50 active:shadow-neo-pressed text-ink-700 flex items-center justify-center transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-ink-700 hover:text-accent-700" />
            </button>
            
            {/* 2. Notifications Button (🔔) */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                title="Notifications"
                className="relative w-9 h-9 rounded-full bg-surface-raised border border-accent-200/60 shadow-neo-raised hover:bg-accent-50 active:shadow-neo-pressed text-ink-700 flex items-center justify-center transition-all cursor-pointer"
              >
                <Bell className="w-4 h-4 text-ink-700 hover:text-accent-700" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-semantic-danger rounded-full ring-2 ring-surface-canvas" />
              </button>

              <NotificationsPopover
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>

            {/* 3. Profile Avatar Button (👤) */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              title="User Profile"
              className="w-9 h-9 rounded-full bg-accent-400 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-neo-raised hover:bg-accent-500 transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onViewSavedTrips={() => setExploreModalMode('my-trips')}
      />

      <ExploreModal
        isOpen={Boolean(exploreModalMode)}
        mode={exploreModalMode}
        onClose={() => setExploreModalMode(null)}
      />
    </>
  );
};
