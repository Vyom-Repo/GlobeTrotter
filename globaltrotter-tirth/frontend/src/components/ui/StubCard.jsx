import React, { useState } from 'react';
import {
  GripVertical, ChevronDown, ChevronUp, Copy, Trash2, Plus, X, Check, MapPin, DollarSign, Calendar
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
  // Local state for inline activity form
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [actTitle, setActTitle] = useState('');
  const [actCost, setActCost] = useState('');

  // Local inline editing for stop title
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(title || '');

  // Calculate activity total cost vs stop budget
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
  // DESTINATION STUB CARD VARIANT (§2.3 D)
  // -------------------------------------------------------------
  if (variant === 'destination') {
    return (
      <div className="w-[260px] sm:w-[280px] shrink-0 bg-surface-raised rounded-lg border border-accent-200/60 shadow-neo-raised hover:shadow-neo-floating transition-all duration-200 overflow-hidden group flex flex-col justify-between">
        <div>
          {/* Cover image */}
          <div className="h-[150px] w-full relative overflow-hidden bg-surface-sunken">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent" />
            <span className="absolute bottom-2.5 left-3 text-white text-xs font-medium px-2 py-0.5 rounded-sm bg-ink-900/60 backdrop-blur-sm flex items-center gap-1">
              <MapPin className="w-3 h-3 text-accent-200" /> {subtitle}
            </span>
          </div>

          {/* Perforated Stub Divider line */}
          <div className="stub-perforated-line">
            <div className="stub-notch-left" />
            <div className="stub-notch-right" />
          </div>

          {/* Card Content */}
          <div className="px-4 pb-2">
            <h3 className="font-display font-medium text-[17px] text-ink-900 leading-snug line-clamp-1">
              {title}
            </h3>
            <p className="text-xs text-ink-500 font-sans mt-0.5">
              Est. budget <span className="font-semibold text-ink-700">{cost}</span>
            </p>
          </div>
        </div>

        {/* Card Footer CTA */}
        <div className="px-4 pb-4 pt-1 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase text-accent-700 bg-accent-50 px-2 py-0.5 rounded-full border border-accent-200/50">
            Suggested
          </span>
          <Button
            size="sm"
            variant={isAdded ? "secondary" : "primary"}
            onClick={onAdd}
            className={isAdded ? "!bg-semantic-success !text-white !border-emerald-600 shadow-sm" : ""}
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
  // ITINERARY STOP STUB CARD VARIANT (§3.3 B)
  // -------------------------------------------------------------
  const formattedStopNum = String(stopIndex).padStart(2, '0');

  return (
    <div className={`
      w-full bg-surface-raised rounded-lg border transition-all duration-200 relative overflow-hidden
      ${isOverBudget ? 'border-semantic-danger/70 shadow-neo-raised' : 'border-accent-200/70 shadow-neo-raised hover:border-accent-300'}
    `}>
      {/* 1. Header row */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between border-b border-ink-300/10">
        <div className="flex items-center gap-2">
          {/* Drag grip handle */}
          <div
            className="text-ink-300 hover:text-ink-700 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-surface-sunken transition-colors"
            title="Drag or use arrows to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Overline Label */}
          <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-500 font-sans">
            STOP {formattedStopNum}
          </span>

          {/* Mobile Up/Down controls */}
          <div className="flex items-center gap-0.5 sm:hidden ml-1">
            <button
              disabled={isFirst}
              onClick={onMoveUp}
              className="p-1 text-xs text-ink-500 disabled:opacity-30 hover:text-ink-900"
            >
              ↑
            </button>
            <button
              disabled={isLast}
              onClick={onMoveDown}
              className="p-1 text-xs text-ink-500 disabled:opacity-30 hover:text-ink-900"
            >
              ↓
            </button>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1 text-ink-500">
          <button
            onClick={onDuplicateStop}
            title="Duplicate stop"
            className="p-1.5 rounded-md hover:bg-accent-50 hover:text-accent-700 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDeleteStop}
            title="Delete stop"
            className="p-1.5 rounded-md hover:bg-red-50 hover:text-semantic-danger transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand stop details" : "Collapse stop"}
            className="p-1.5 rounded-md hover:bg-surface-sunken hover:text-ink-900 transition-colors ml-1"
          >
            {isCollapsed ? <ChevronDown className="w-4.5 h-4.5" /> : <ChevronUp className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* COLLAPSED SUMMARY VIEW (§3.3 B) */}
      {isCollapsed ? (
        <div className="px-5 py-3 flex items-center justify-between cursor-pointer" onClick={onToggleCollapse}>
          <div className="flex items-center gap-3">
            <h3 className="font-display font-medium text-base text-ink-900">
              {title || `Untitled Stop ${formattedStopNum}`}
            </h3>
            <span className="text-xs text-ink-500">
              · {dates || 'Dates not set'} · ¥{Number(budget).toLocaleString()}
            </span>
          </div>
          <span className="text-xs font-semibold text-accent-700 bg-accent-50 px-2 py-0.5 rounded">
            {activities.length} activities
          </span>
        </div>
      ) : (
        /* EXPANDED VIEW */
        <div className="p-4 sm:p-5 space-y-4">
          {/* 2. Inline Editable Title */}
          <div>
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
                className="w-full font-display text-lg sm:text-xl font-medium text-ink-900 bg-surface-sunken px-3 py-1.5 rounded-md shadow-neo-pressed border border-accent-400 outline-none"
              />
            ) : (
              <h3
                onClick={() => setIsEditingTitle(true)}
                title="Click to edit title"
                className="font-display text-lg sm:text-xl font-medium text-ink-900 cursor-pointer hover:text-accent-600 transition-colors flex items-center gap-2 group"
              >
                <span>{title || `Name this stop (e.g. Kyoto, Japan)`}</span>
                <span className="text-xs text-ink-500 font-sans opacity-0 group-hover:opacity-100 transition-opacity">✏️ edit</span>
              </h3>
            )}
          </div>

          {/* 3. Meta Row (Dates & Budget) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-ink-500 mb-1">Dates</label>
              <div className="flex items-center gap-2 bg-surface-sunken px-3 py-2 rounded-md shadow-neo-pressed border border-accent-200/50">
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
              <label className="block text-[11px] font-semibold uppercase text-ink-500 mb-1">
                Stop Budget (¥ / $)
              </label>
              <div className={`
                flex items-center gap-2 bg-surface-sunken px-3 py-2 rounded-md shadow-neo-pressed border
                ${isOverBudget ? 'border-semantic-danger text-semantic-danger' : 'border-accent-200/50'}
              `}>
                <DollarSign className="w-4 h-4 text-accent-400 shrink-0" />
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

          {/* 4. Perforated Divider */}
          <div className="stub-perforated-line">
            <div className="stub-notch-left" />
            <div className="stub-notch-right" />
          </div>

          {/* 5. Notes */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-ink-500 mb-1">Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => onUpdateStop({ notes: e.target.value })}
              placeholder="First time here, key highlights or packing reminders..."
              className="w-full bg-surface-sunken text-sm text-ink-900 p-3 rounded-md shadow-neo-pressed border border-accent-200/50 outline-none font-sans placeholder:text-ink-500/60 resize-y"
            />
          </div>

          {/* 6. Activities List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold uppercase text-ink-500">Activities & Expenses</label>
              <span className="text-xs font-semibold tabular-nums text-ink-700">
                Total: ¥{activitiesTotal.toLocaleString()}
              </span>
            </div>

            {activities.length > 0 && (
              <div className="space-y-1.5 mb-2.5">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between bg-surface-sunken/60 hover:bg-surface-sunken px-3 py-2 rounded-md text-sm transition-colors group"
                  >
                    <span className="text-ink-900 font-medium">{act.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-ink-700 tabular-nums">
                        ¥{Number(act.cost).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleRemoveActivity(act.id)}
                        className="text-ink-300 hover:text-semantic-danger p-0.5 rounded transition-colors opacity-80 group-hover:opacity-100"
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
              <form onSubmit={handleAddActivitySubmit} className="flex flex-col sm:flex-row gap-2 bg-surface-sunken p-2.5 rounded-md shadow-neo-pressed border border-accent-300 animate-fade-in-up">
                <input
                  type="text"
                  placeholder="Activity name (e.g. Senso-ji Temple)"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  autoFocus
                  className="bg-transparent text-sm text-ink-900 px-2 py-1 outline-none flex-1 border-b sm:border-b-0 sm:border-r border-ink-300/30 font-sans"
                />
                <input
                  type="number"
                  placeholder="Cost (¥)"
                  value={actCost}
                  onChange={(e) => setActCost(e.target.value)}
                  className="bg-transparent text-sm text-ink-900 px-2 py-1 outline-none w-full sm:w-28 font-sans tabular-nums"
                />
                <div className="flex items-center gap-1 justify-end">
                  <button
                    type="submit"
                    className="bg-accent-400 text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-accent-500"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingActivity(false)}
                    className="text-ink-500 hover:text-ink-900 px-2 py-1 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingActivity(true)}
                className="w-full border border-dashed border-accent-300/70 hover:border-accent-400 bg-surface-canvas/40 hover:bg-accent-50/60 text-accent-700 text-xs font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add activity
              </button>
            )}
          </div>

          {/* 7. Per-Stop Budget Progress Bar */}
          {numericBudget > 0 && (
            <div className="pt-2 border-t border-ink-300/10">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-ink-500 font-medium">Budget utilized</span>
                <span className={`font-semibold tabular-nums ${isOverBudget ? 'text-semantic-danger' : 'text-ink-700'}`}>
                  {budgetPercent}% ({activitiesTotal.toLocaleString()} / {numericBudget.toLocaleString()})
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-sunken overflow-hidden">
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
