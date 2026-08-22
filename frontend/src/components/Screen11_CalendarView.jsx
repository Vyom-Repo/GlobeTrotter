import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Search, Plus, MapPin, Clock, ArrowRight, List, Grid } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function Screen11_CalendarView({ trips = [], onViewTrip, onPlanNewTrip }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // Default Sep 2026
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'agenda'
  const [searchQuery, setSearchQuery] = useState('');

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthYearLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Grid dates math
  const gridDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay(); // 0-6 (Sun-Sat)
    const daysInMonth = lastDayOfMonth.getDate();

    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days = [];

    // Leading days from prev month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        dayNum: prevMonthLastDay - i
      });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        dayNum: i
      });
    }

    // Trailing days for next month to complete 35 or 42 grid cells
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        dayNum: i
      });
    }

    return days;
  }, [currentDate]);

  // Filter trips matching search query
  const filteredTrips = useMemo(() => {
    if (!searchQuery.trim()) return trips;
    const q = searchQuery.toLowerCase();
    return trips.filter(t => (
      t.name?.toLowerCase().includes(q) ||
      (t.destinations || []).some(d => d.toLowerCase().includes(q))
    ));
  }, [trips, searchQuery]);

  // Find trips that fall on a specific date
  const getTripsForDate = (dateObj) => {
    const dStr = dateObj.toISOString().split('T')[0];
    return filteredTrips.filter(t => {
      if (!t.startDate || !t.endDate) return false;
      return dStr >= t.startDate && dStr <= t.endDate;
    });
  };

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="min-h-screen bg-surface-canvas pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 bg-accent-50 px-2.5 py-1 rounded-sm border border-accent-200">
              Screen 11 · Timeline View
            </span>
            <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink-900 mt-2">
              Trip Calendar & Timeline
            </h1>
            <p className="text-sm text-slate-600 font-sans mt-1">
              Visualize your upcoming, ongoing, and planned travel dates across time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon={viewMode === 'month' ? List : Grid}
              onClick={() => setViewMode(viewMode === 'month' ? 'agenda' : 'month')}
              className="cursor-pointer"
            >
              {viewMode === 'month' ? 'Agenda View' : 'Month Grid'}
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={onPlanNewTrip}
              className="cursor-pointer"
            >
              Plan Trip
            </Button>
          </div>
        </div>

        {/* Search & Navigation Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Month Stepper */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              <button
                onClick={nextMonth}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            <h2 className="font-display font-semibold text-xl text-ink-900 px-2 min-w-[180px] text-center md:text-left">
              {monthYearLabel}
            </h2>

            <Button variant="ghost" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72">
            <Input
              icon={Search}
              placeholder="Search trips or cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* View Content */}
        {viewMode === 'month' ? (
          /* 7-Column Month Grid */
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
              {weekDays.map((day) => (
                <div key={day} className="py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Date Cells Grid */}
            <div className="grid grid-cols-7 border-collapse">
              {gridDays.map((dayObj, idx) => {
                const dayTrips = getTripsForDate(dayObj.date);
                const isToday = new Date().toDateString() === dayObj.date.toDateString();

                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] p-2 border-r border-b border-slate-200 flex flex-col justify-between transition-colors ${
                      !dayObj.isCurrentMonth ? 'bg-slate-50/60 text-slate-400' : 'bg-white text-ink-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold tabular-nums w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-accent-400 text-white font-bold' : ''
                      }`}>
                        {dayObj.dayNum}
                      </span>
                    </div>

                    {/* Trip Bars in Cell */}
                    <div className="space-y-1 mt-1">
                      {dayTrips.slice(0, 2).map((trip) => (
                        <div
                          key={trip.id}
                          onClick={() => onViewTrip && onViewTrip(trip)}
                          className="bg-accent-400 hover:bg-accent-500 text-white text-[11px] font-semibold px-2 py-1 rounded truncate cursor-pointer shadow-xs transition-all flex items-center gap-1"
                          title={`${trip.name} (${trip.startDate} - ${trip.endDate})`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                          <span className="truncate">{trip.name}</span>
                        </div>
                      ))}
                      {dayTrips.length > 2 && (
                        <div className="text-[10px] text-accent-700 font-semibold px-1">
                          +{dayTrips.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Agenda Vertical List View */
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="font-display font-semibold text-xl text-ink-900 mb-4">
              Agenda View · {monthYearLabel}
            </h2>

            {filteredTrips.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-8 text-center">
                No trips scheduled for this view.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => onViewTrip && onViewTrip(trip)}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 px-4 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent-50 border border-accent-200 flex items-center justify-center shrink-0">
                        <CalendarIcon className="w-6 h-6 text-accent-400" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-lg text-ink-900">
                          {trip.name}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-accent-400" />
                            {trip.startDate} → {trip.endDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-accent-400" />
                            {(trip.destinations || []).join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Screen11_CalendarView;
