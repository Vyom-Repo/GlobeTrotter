import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

export const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Discard",
  cancelLabel = "Keep Editing",
  onConfirm,
  onCancel,
  variant = "danger"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-fade-in-up z-40"
      />

      <div className="relative bg-white border border-slate-200 shadow-popover rounded-xl max-w-md w-full p-6 z-50 animate-fade-in-up">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
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
            <p className="text-sm text-slate-600 font-sans mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
