import React, { useState } from 'react';
import {
  GripVertical, ChevronDown, ChevronUp, Copy, Trash2, Plus, X, Check, MapPin, Calendar, Edit2
} from 'lucide-react';
import { Button } from './Button';

export const StubCard = ({
  variant = 'destination', // 'destination' | 'itinerary'
  // Destination variant props
  title,
  subtitle,
  image,
  cost,
  isAdded = false,
  onAdd,
  
  // Itinerary variant props
  stopIndex = 1,
  dates = '',
  startDate = '',
  endDate = '',
  budget = 0,
  notes = '',
  activities = [],
  isCollapsed = false,
  onToggleCollapse,
  onUpdateStop,
  onDuplicateStop,
  onDeleteStop,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false
}) => {
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [actTitle, setActTitle] = useState('');
  const [actCost, setActCost] = useState('');

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(title || '');

  const activitiesTotal = activities.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
  const numericBudget = Number(budget) || 0;
  const isOverBudget = numericBudget > 0 && activitiesTotal > numericBudget;
  const budgetPercent = numericBudget > 0 ? Math.min(Math.round((activitiesTotal / numericBudget) * 100), 150) : 0;

  const handleAddActivitySubmit = (e) => {
    e.preventDefault();
    if (!actTitle.trim()) return;
    const newAct = {
      id: Date.now().toString(),
      name: actTitle.trim(),
      cost: Number(actCost) || 0
    };
    if (onUpdateStop) {
      onUpdateStop({
        activities: [...activities, newAct]
      });
    }
    setActTitle('');
    setActCost('');
    setIsAddingActivity(false);
  };

  const handleRemoveActivity = (actId) => {
    if (onUpdateStop) {
      onUpdateStop({
        activities: activities.filter(a => a.id !== actId)
      });
    }
  };

  // -------------------------------------------------------------
  // DESTINATION STUB CARD VARIANT
  // -------------------------------------------------------------
  if (variant === 'destination') {
    return (
      <div className="w-[260px] sm:w-[280px] shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col justify-between">
        <div>
          <div className="h-[150px] w-full relative overflow-hidden bg-slate-100">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
            <span className="absolute bottom-2.5 left-3 text-white text-xs font-medium px-2 py-0.5 rounded bg-slate-900/60 backdrop-blur-xs flex items-center gap-1">
              <MapPin className="w-3 h-3 text-accent-200" /> {subtitle}
            </span>
          </div>

          <div className="stub-perforated-line">
            <div className="stub-notch-left" />
            <div className="stub-notch-right" />
          </div>

          <div className="px-4 pb-2">
            <h3 className="font-display font-medium text-[17px] text-ink-900 leading-snug line-clamp-1">
              {title}
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Est. budget <span className="font-semibold text-slate-700">{cost}</span>
            </p>
          </div>
        </div>

        <div className="px-4 pb-4 pt-1 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase text-accent-700 bg-accent-50 px-2 py-0.5 rounded-full border border-accent-200">
            Suggested
          </span>
          <Button
            size="sm"
            variant={isAdded ? "secondary" : "primary"}
            onClick={onAdd}
            className={isAdded ? "!bg-semantic-success !text-white !border-emerald-600 shadow-xs" : ""}
          >
            {isAdded ? (
              <span className="flex items-center gap-1">Added <Check className="w-3.5 h-3.5" /></span>
            ) : (
              <span className="flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add</span>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ITINERARY STOP STUB CARD VARIANT
  // -------------------------------------------------------------
  const formattedStopNum = String(stopIndex).padStart(2, '0');

  return (
    <div className={`
      w-full bg-white rounded-xl border transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow
      ${isOverBudget ? 'border-semantic-danger' : 'border-slate-200'}
    `}>
      {/* 1. Header Row */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div
            className="text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-slate-200/60 transition-colors"
            title="Drag or use arrows to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
            STOP {formattedStopNum}
          </span>

          <div className="flex items-center gap-0.5 sm:hidden ml-1">
            <button
              disabled={isFirst}
              onClick={onMoveUp}
              className="p-1 text-xs text-slate-500 disabled:opacity-30 hover:text-slate-900 cursor-pointer"
            >
              ↑
            </button>
            <button
              disabled={isLast}
              onClick={onMoveDown}
              className="p-1 text-xs text-slate-500 disabled:opacity-30 hover:text-slate-900 cursor-pointer"
            >
              ↓
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <button
            onClick={onDuplicateStop}
            title="Duplicate stop"
            className="p-1.5 rounded-md hover:bg-accent-50 hover:text-accent-700 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDeleteStop}
            title="Delete stop"
            className="p-1.5 rounded-md hover:bg-red-50 hover:text-semantic-danger transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand stop details" : "Collapse stop"}
            className="p-1.5 rounded-md hover:bg-slate-200/60 hover:text-slate-900 transition-colors ml-1 cursor-pointer"
          >
            {isCollapsed ? <ChevronDown className="w-4.5 h-4.5" /> : <ChevronUp className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* COLLAPSED SUMMARY VIEW */}
      {isCollapsed ? (
        <div className="px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50" onClick={onToggleCollapse}>
          <div className="flex items-center gap-3">
            <h3 className="font-display font-medium text-base text-ink-900">
              {title || `Untitled Stop ${formattedStopNum}`}
            </h3>
            <span className="text-xs text-slate-500">
              · {dates || 'Dates TBD'} · ₹{Number(budget).toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-xs font-semibold text-accent-700 bg-accent-50 px-2.5 py-0.5 rounded-full border border-accent-200">
            {activities.length} activities
          </span>
        </div>
      ) : (
        /* EXPANDED FORM VIEW */
        <div className="p-5 sm:p-6 space-y-5">
          {/* Stop Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Stop Title / Location Name
            </label>
            {isEditingTitle ? (
              <input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={() => {
                  setIsEditingTitle(false);
                  onUpdateStop({ title: localTitle });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingTitle(false);
                    onUpdateStop({ title: localTitle });
                  }
                }}
                autoFocus
                className="w-full font-display text-lg font-medium text-ink-900 bg-white px-3.5 py-2 rounded-md border border-accent-400 outline-none ring-2 ring-accent-400/20"
              />
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                title="Click to edit stop title"
                className="font-display text-lg font-semibold text-ink-900 cursor-pointer hover:text-accent-600 transition-colors flex items-center gap-2 group border border-dashed border-transparent hover:border-slate-300 p-1.5 -ml-1.5 rounded-md"
              >
                <span>{title || `Name this stop (e.g. Tokyo & Shinjuku)`}</span>
                <Edit2 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>

          {/* Dates & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Travel Dates
              </label>
              <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-md border border-slate-300 shadow-xs">
                <Calendar className="w-4 h-4 text-accent-400 shrink-0" />
                <input
                  type="text"
                  value={dates}
                  onChange={(e) => onUpdateStop({ dates: e.target.value })}
                  placeholder="e.g. Sep 12 → Sep 16"
                  className="bg-transparent text-sm text-ink-900 outline-none w-full font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Allocated Stop Budget (₹ INR)
              </label>
              <div className={`
                flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-md border shadow-xs
                ${isOverBudget ? 'border-semantic-danger text-semantic-danger' : 'border-slate-300'}
              `}>
                <span className="text-sm font-bold text-accent-400 shrink-0">₹</span>
                <input
                  type="number"
                  value={budget || ''}
                  onChange={(e) => onUpdateStop({ budget: e.target.value })}
                  placeholder="25,000"
                  className="bg-transparent text-sm text-ink-900 outline-none w-full font-sans tabular-nums font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="stub-perforated-line" />

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Notes & Key Details
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => onUpdateStop({ notes: e.target.value })}
              placeholder="Add packing reminders, hotel info, or key sights to visit..."
              className="w-full bg-white text-sm text-ink-900 p-3 rounded-md border border-slate-300 shadow-xs outline-none font-sans placeholder:text-slate-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20"
            />
          </div>

          {/* Activities List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Planned Activities & Expenses
              </label>
              <span className="text-xs font-semibold tabular-nums text-slate-700">
                Subtotal: ₹{activitiesTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {activities.length > 0 && (
              <div className="space-y-2 mb-3">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 px-3.5 py-2.5 rounded-md text-sm border border-slate-200 transition-colors group"
                  >
                    <span className="text-ink-900 font-medium">{act.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-700 tabular-nums">
                        ₹{Number(act.cost).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleRemoveActivity(act.id)}
                        className="text-slate-400 hover:text-semantic-danger p-0.5 rounded transition-colors cursor-pointer"
                        title="Remove activity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Inline Add Activity Form */}
            {isAddingActivity ? (
              <form onSubmit={handleAddActivitySubmit} className="flex flex-col sm:flex-row gap-2 bg-slate-50 p-3 rounded-md border border-accent-300 animate-fade-in-up">
                <input
                  type="text"
                  placeholder="Activity Title (e.g. Temple Visit)"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  autoFocus
                  className="bg-white text-sm text-ink-900 px-3 py-1.5 rounded border border-slate-300 outline-none flex-1 font-sans"
                />
                <div className="flex items-center bg-white px-3 py-1.5 rounded border border-slate-300 w-full sm:w-32">
                  <span className="text-xs font-bold text-slate-400 mr-1">₹</span>
                  <input
                    type="number"
                    placeholder="Cost"
                    value={actCost}
                    onChange={(e) => setActCost(e.target.value)}
                    className="bg-transparent text-sm text-ink-900 outline-none w-full font-sans tabular-nums"
                  />
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <button
                    type="submit"
                    className="bg-accent-400 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-accent-500 cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingActivity(false)}
                    className="text-slate-500 hover:text-slate-900 px-2 py-1.5 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingActivity(true)}
                className="w-full border border-dashed border-slate-300 hover:border-accent-400 bg-slate-50/50 hover:bg-accent-50/50 text-accent-700 text-xs font-semibold py-2.5 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Activity or Expense
              </button>
            )}
          </div>

          {/* Per-Stop Budget Bar */}
          {numericBudget > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500 font-medium">Stop Budget Utilized</span>
                <span className={`font-semibold tabular-nums ${isOverBudget ? 'text-semantic-danger' : 'text-slate-700'}`}>
                  {budgetPercent}% (₹{activitiesTotal.toLocaleString('en-IN')} / ₹{numericBudget.toLocaleString('en-IN')})
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOverBudget ? 'bg-danger-hatch' : budgetPercent > 85 ? 'bg-semantic-warning' : 'bg-accent-400'
                  }`}
                  style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
