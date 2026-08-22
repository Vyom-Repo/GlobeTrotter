import React, { useState, useRef, useEffect } from 'react';
import { Compass, Settings, Bell, User } from 'lucide-react';
import { SettingsModal } from './ui/SettingsModal';
import { NotificationsPopover } from './ui/NotificationsPopover';

export const Navbar = ({ currentScreen, onNavigate }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifRef = useRef(null);

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

  const navItems = [
    { id: 'screen6', label: 'My Trips' },
    { id: 'screen4', label: 'Plan Trip' },
    { id: 'screen5', label: 'Build Itinerary' },
    { id: 'screen8', label: 'Activity Search' },
    { id: 'screen9', label: 'Itinerary & Budget' },
    { id: 'screen10', label: 'Community' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface-canvas/95 backdrop-blur-md border-b border-accent-200/50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Navigation */}
          <div className="flex items-center gap-4 lg:gap-8">
            <div
              onClick={() => onNavigate('screen6')}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-accent-400" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-xl text-ink-900 tracking-tight">
                  Globe<span className="text-accent-400">Trotter</span>
                </span>
                <span className="block text-[10px] text-slate-500 font-sans tracking-widest uppercase font-semibold">
                  Smart Trip Planner
                </span>
              </div>
            </div>

            {/* Navigation Links for All Screens */}
            <nav className="flex items-center gap-1 overflow-x-auto max-w-[50vw] sm:max-w-none scrollbar-none">
              {navItems.map((item) => {
                const isActive = currentScreen === item.id || (item.id === 'screen6' && currentScreen === 'screen6-detail');
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-accent-100 text-accent-800 border border-accent-200 shadow-xs font-bold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons (Settings, Notifications, Avatar Profile -> Screen 07) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* 1. Settings Button (⚙) */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              title="Open Settings"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-xs hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-700 hover:text-accent-700" />
            </button>
            
            {/* 2. Notifications Button (🔔) */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                title="Notifications"
                className="relative w-9 h-9 rounded-full bg-white border border-slate-200 shadow-xs hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
              >
                <Bell className="w-4 h-4 text-slate-700 hover:text-accent-700" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-semantic-danger rounded-full ring-2 ring-surface-canvas" />
              </button>

              <NotificationsPopover
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>

            {/* 3. Profile Avatar Button (👤) -> Navigates to Screen 07 */}
            <button
              type="button"
              onClick={() => onNavigate('screen7')}
              title="User Profile & Settings (Screen 07)"
              className={`w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs transition-all cursor-pointer ${
                currentScreen === 'screen7'
                  ? 'bg-accent-700 ring-2 ring-accent-400'
                  : 'bg-accent-400 hover:bg-accent-500'
              }`}
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
