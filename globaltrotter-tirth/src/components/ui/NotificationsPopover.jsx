import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Trash2, X } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'warning',
    title: 'Budget Alert',
    message: 'Stop 01 (Tokyo) is 8% over its set activity budget.',
    time: '5m ago',
    unread: true
  },
  {
    id: 'n2',
    type: 'success',
    title: 'Draft Autosaved',
    message: 'Your Kyoto cherry blossom trip itinerary was saved to cloud.',
    time: '12m ago',
    unread: true
  },
  {
    id: 'n3',
    type: 'info',
    title: 'Price Drop Alert',
    message: 'Bullet train tickets from Tokyo → Kyoto dropped by 15%.',
    time: '1h ago',
    unread: false
  }
];

export const NotificationsPopover = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 bg-surface-raised border border-accent-200 shadow-neo-floating rounded-xl p-4 animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-ink-300/20 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent-400" />
          <h4 className="font-display font-semibold text-sm text-ink-900">Notifications</h4>
          {notifications.some(n => n.unread) && (
            <span className="text-[10px] font-bold bg-semantic-danger text-white px-1.5 py-0.2 rounded-full">
              {notifications.filter(n => n.unread).length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={markAllRead}
            className="text-accent-700 hover:text-accent-800 font-semibold"
          >
            Mark read
          </button>
          <button
            onClick={onClose}
            className="text-ink-500 hover:text-ink-900 p-0.5 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-lg border text-xs transition-colors flex items-start gap-2.5 ${
                n.unread
                  ? 'bg-accent-50/70 border-accent-200 text-ink-900'
                  : 'bg-surface-sunken/40 border-ink-300/10 text-ink-700'
              }`}
            >
              {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-semantic-warning shrink-0 mt-0.5" />}
              {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />}
              {n.type === 'info' && <Info className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />}

              <div className="flex-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>{n.title}</span>
                  <span className="text-[10px] text-ink-500 font-normal">{n.time}</span>
                </div>
                <p className="text-[11px] text-ink-700 mt-0.5 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-ink-500 text-xs">
            No new notifications.
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="mt-3 pt-2 border-t border-ink-300/20 text-center">
          <button
            onClick={clearAll}
            className="text-[11px] text-ink-500 hover:text-semantic-danger font-medium flex items-center justify-center gap-1 mx-auto"
          >
            <Trash2 className="w-3 h-3" /> Clear notification history
          </button>
        </div>
      )}
    </div>
  );
};
