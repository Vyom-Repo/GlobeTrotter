import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Label } from './Input';

export const DateRangePicker = ({
  startDate,
  endDate,
  onChange, // ({ startDate, endDate }) => void
  error,
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('start'); // 'start' | 'end'
  const [viewMonth, setViewMonth] = useState(() => {
    return startDate ? new Date(startDate) : new Date(2026, 8, 1); // Default Sept 2026
  });

  const popoverRef = useRef(null);

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return 'Select date';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calendar matrix generator
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewMonth(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (dayNum) => {
    const selectedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    
    if (activeTab === 'start') {
      let newEnd = endDate;
      if (endDate && new Date(selectedDateStr) > new Date(endDate)) {
        newEnd = selectedDateStr; // auto adjust
      }
      onChange({ startDate: selectedDateStr, endDate: newEnd });
      setActiveTab('end'); // move to end date selection
    } else {
      if (startDate && new Date(selectedDateStr) < new Date(startDate)) {
        // If end date picked is before start date, set as start date
        onChange({ startDate: selectedDateStr, endDate: '' });
        setActiveTab('end');
      } else {
        onChange({ startDate: startDate || selectedDateStr, endDate: selectedDateStr });
        setIsOpen(false);
      }
    }
  };

  // Quick preset helper
  const handleQuickPreset = (days) => {
    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + days);

    const sStr = start.toISOString().split('T')[0];
    const eStr = end.toISOString().split('T')[0];

    onChange({ startDate: sStr, endDate: eStr });
    setIsOpen(false);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="w-full relative" ref={popoverRef}>
      {label && <Label required={required}>{label}</Label>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Start Date Trigger */}
        <div>
          <span className="block text-[11px] font-medium text-ink-500 uppercase tracking-wider mb-1">Start date</span>
          <button
            type="button"
            onClick={() => {
              setActiveTab('start');
              setIsOpen(true);
            }}
            className={`
              w-full flex items-center justify-between bg-surface-sunken text-left px-3.5 py-2.5 rounded-md min-h-[44px]
              shadow-neo-pressed border transition-all duration-150 outline-none
              ${activeTab === 'start' && isOpen ? 'border-accent-400 ring-2 ring-accent-400/30' : 'border-accent-200/50 hover:border-accent-300'}
              ${startDate ? 'text-ink-900 font-semibold' : 'text-ink-500/70 font-normal'}
            `}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <CalendarIcon className="w-4 h-4 text-accent-400 shrink-0" />
              <span className="text-sm truncate">{formatDateLabel(startDate)}</span>
            </div>
          </button>
        </div>

        {/* End Date Trigger */}
        <div>
          <span className="block text-[11px] font-medium text-ink-500 uppercase tracking-wider mb-1">End date</span>
          <button
            type="button"
            onClick={() => {
              setActiveTab('end');
              setIsOpen(true);
            }}
            className={`
              w-full flex items-center justify-between bg-surface-sunken text-left px-3.5 py-2.5 rounded-md min-h-[44px]
              shadow-neo-pressed border transition-all duration-150 outline-none
              ${activeTab === 'end' && isOpen ? 'border-accent-400 ring-2 ring-accent-400/30' : 'border-accent-200/50 hover:border-accent-300'}
              ${endDate ? 'text-ink-900 font-semibold' : 'text-ink-500/70 font-normal'}
              ${error ? 'border-semantic-danger ring-1 ring-semantic-danger' : ''}
            `}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <CalendarIcon className="w-4 h-4 text-accent-400 shrink-0" />
              <span className="text-sm truncate">{formatDateLabel(endDate)}</span>
            </div>
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-semantic-danger font-medium flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}

      {/* Connected Floating Calendar Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-full sm:w-[340px] bg-surface-raised border border-accent-200 shadow-neo-floating rounded-xl p-4 animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-ink-300/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-accent-700 bg-accent-100 px-2 py-0.5 rounded-sm">
                Selecting {activeTab === 'start' ? 'Start Date' : 'End Date'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ink-500 hover:text-ink-900 p-1 rounded-full hover:bg-surface-sunken"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Month controls */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-md bg-surface-raised shadow-neo-raised hover:bg-accent-50 active:shadow-neo-pressed text-ink-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-display font-semibold text-ink-900">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-md bg-surface-raised shadow-neo-raised hover:bg-accent-50 active:shadow-neo-pressed text-ink-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-semibold text-ink-500">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Blank offset days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8 text-xs text-ink-300 flex items-center justify-center opacity-30">
                {prevMonthDays - firstDayOfMonth + i + 1}
              </div>
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              
              const isStart = startDate === dateStr;
              const isEnd = endDate === dateStr;
              
              const inRange = startDate && endDate &&
                new Date(dateStr) > new Date(startDate) &&
                new Date(dateStr) < new Date(endDate);

              let cellStyle = "bg-surface-raised text-ink-900 hover:bg-accent-100 hover:text-accent-800";
              if (isStart || isEnd) {
                cellStyle = "bg-accent-400 text-white font-bold shadow-sm";
              } else if (inRange) {
                cellStyle = "bg-accent-100 text-accent-800 font-medium rounded-none";
              }

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-8 w-full text-xs rounded-md transition-all flex items-center justify-center ${cellStyle}`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Quick presets */}
          <div className="mt-3 pt-2.5 border-t border-ink-300/20 flex items-center justify-between text-xs">
            <span className="text-ink-500 font-medium">Quick pick:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => handleQuickPreset(3)}
                className="px-2 py-1 rounded bg-surface-sunken hover:bg-accent-100 text-ink-700 hover:text-accent-800 font-medium text-[11px]"
              >
                3 Days
              </button>
              <button
                onClick={() => handleQuickPreset(7)}
                className="px-2 py-1 rounded bg-surface-sunken hover:bg-accent-100 text-ink-700 hover:text-accent-800 font-medium text-[11px]"
              >
                1 Week
              </button>
              <button
                onClick={() => handleQuickPreset(14)}
                className="px-2 py-1 rounded bg-surface-sunken hover:bg-accent-100 text-ink-700 hover:text-accent-800 font-medium text-[11px]"
              >
                2 Weeks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
