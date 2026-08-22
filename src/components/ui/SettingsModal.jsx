import React, { useState } from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { Button } from './Button';

export const SettingsModal = ({ isOpen, onClose }) => {
  const [currency, setCurrency] = useState('INR');
  const [autosaveInterval, setAutosaveInterval] = useState('800ms');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-ink-900/40 backdrop-blur-xs animate-fade-in-up" />

      <div className="relative bg-surface-raised border border-accent-200 shadow-neo-floating rounded-xl max-w-md w-full p-6 z-10 animate-fade-in-up">
        <div className="flex items-center justify-between border-b border-ink-300/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-accent-400" />
            <h3 className="font-display font-semibold text-lg text-ink-900">
              App Settings & Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-ink-500 hover:text-ink-900 hover:bg-surface-sunken"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 text-sm">
          {/* Default Currency */}
          <div>
            <label className="block text-xs font-semibold uppercase text-ink-500 mb-1.5">
              Default Currency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'INR', symbol: '₹ INR (Rupees)' },
                { code: 'USD', symbol: '$ USD (Dollar)' },
                { code: 'EUR', symbol: '€ EUR (Euro)' }
              ].map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCurrency(c.code)}
                  className={`
                    px-3 py-2 rounded-md border text-xs font-semibold transition-all text-center
                    ${currency === c.code
                      ? 'bg-accent-100 text-accent-800 border-accent-400 shadow-xs'
                      : 'bg-surface-sunken text-ink-700 border-accent-200/50 hover:bg-accent-50'}
                  `}
                >
                  {c.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Autosave Frequency */}
          <div>
            <label className="block text-xs font-semibold uppercase text-ink-500 mb-1.5">
              Autosave Frequency
            </label>
            <select
              value={autosaveInterval}
              onChange={(e) => setAutosaveInterval(e.target.value)}
              className="w-full bg-surface-sunken text-ink-900 text-sm px-3.5 py-2 rounded-md shadow-neo-pressed border border-accent-200/60 outline-none"
            >
              <option value="500ms">Fast (500ms debounce)</option>
              <option value="800ms">Standard (800ms debounce)</option>
              <option value="2000ms">Relaxed (2s debounce)</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-ink-300/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-ink-900 block text-xs">Budget Limit Warnings</span>
                <span className="text-[11px] text-ink-500">Alert when a stop exceeds allocated budget</span>
              </div>
              <input
                type="checkbox"
                checked={budgetAlerts}
                onChange={(e) => setBudgetAlerts(e.target.checked)}
                className="w-4 h-4 accent-accent-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-ink-900 block text-xs">Push Notifications</span>
                <span className="text-[11px] text-ink-500">Flight & weather updates for destinations</span>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 accent-accent-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-ink-300/20 flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose} icon={Check}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};
