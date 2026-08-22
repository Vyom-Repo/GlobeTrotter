import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

export const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Discard",
  cancelLabel = "Keep editing",
  onConfirm,
  onCancel,
  variant = "danger" // "danger" | "primary"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Scrim */}
      <div
        onClick={onCancel}
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-xs transition-opacity animate-fade-in-up"
      />

      {/* Floating Modal Content */}
      <div className="relative bg-surface-raised border border-accent-200 shadow-neo-floating rounded-xl max-w-md w-full p-6 z-10 animate-fade-in-up">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-ink-500 hover:text-ink-900 p-1 rounded-full hover:bg-surface-sunken"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-full shrink-0 ${variant === 'danger' ? 'bg-red-50 text-semantic-danger border border-red-200' : 'bg-accent-50 text-accent-700'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-ink-900 leading-snug">
              {title}
            </h3>
            <p className="text-sm text-ink-700 font-sans mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink-300/20">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
