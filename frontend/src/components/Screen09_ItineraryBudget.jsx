import React, { useState } from 'react';
import {
  Calendar, MapPin, Plus, DollarSign, Clock, ChevronDown, GripVertical, Trash2, Edit2, AlertTriangle, PieChart, CheckCircle2, Sparkles
} from 'lucide-react';
import { Button } from './ui/Button';

export const Screen09_ItineraryBudget = ({
  tripData = {
    name: 'Kyoto & Tokyo Blossom Tour',
    targetBudget: 60000,
    startDate: '2026-09-12',
    endDate: '2026-09-20',
    stops: [
      {
        id: 'stop-d1',
        title: 'Day 1: Shinjuku & Harajuku Highlights',
        dates: 'Sep 12, 2026',
        budget: 18000,
        activities: [
          { id: 'act-1', name: 'Senso-ji Temple Visit', time: '09:00 AM', category: 'Culture', cost: 1200 },
          { id: 'act-2', name: 'teamLab Planets Digital Art Entry', time: '01:30 PM', category: 'Sightseeing', cost: 3800 },
          { id: 'act-3', name: 'Tsukiji Outer Market Food Tour', time: '06:00 PM', category: 'Food & Dining', cost: 4500 }
        ]
      },
      {
        id: 'stop-d2',
        title: 'Day 2: Kyoto Shrines & Bamboo Grove',
        dates: 'Sep 13, 2026',
        budget: 15000,
        activities: [
          { id: 'act-4', name: 'Fushimi Inari Shrine Morning Hike', time: '08:00 AM', category: 'Nature', cost: 1500 },
          { id: 'act-5', name: 'Traditional Gion Tea Ceremony', time: '02:00 PM', category: 'Culture', cost: 6000 },
          { id: 'act-6', name: 'Arashiyama Bamboo Grove Walk', time: '05:00 PM', category: 'Sightseeing', cost: 2800 },
          { id: 'act-7', name: 'Private Kaiseki Dinner', time: '08:00 PM', category: 'Food & Dining', cost: 9500 }
        ]
      },
      {
        id: 'stop-d3',
        title: 'Day 3: Bullet Train to Osaka & Dotonbori',
        dates: 'Sep 14, 2026',
        budget: 16000,
        activities: [
          { id: 'act-8', name: 'Shinkansen Bullet Train Ticket', time: '10:00 AM', category: 'Transport', cost: 4200 },
          { id: 'act-9', name: 'Osaka Castle & Gardens Tour', time: '01:00 PM', category: 'Sightseeing', cost: 1800 },
          { id: 'act-10', name: 'Dotonbori Street Food Crawl', time: '07:00 PM', category: 'Food & Dining', cost: 3000 }
        ]
      }
    ]
  },
  onAddDay
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const stops = tripData.stops || [];
  const currentDay = stops[activeDayIndex] || stops[0] || { activities: [] };

  const totalSpent = stops.reduce((sum, day) => {
    const dayTotal = (day.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
    return sum + dayTotal;
  }, 0);

  const targetBudget = tripData.targetBudget || 60000;
  const overallPercent = Math.min(Math.round((totalSpent / targetBudget) * 100), 150);
  const isOverBudget = overallPercent > 100;
  const avgPerDay = stops.length > 0 ? Math.round(totalSpent / stops.length) : 0;

  const categoryTotals = {
    Transport: 12000,
    Stay: 20000,
    Activities: stops.reduce((sum, d) => sum + (d.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0), 0),
    Meals: 6300
  };

  return (
    <div className="min-h-screen bg-surface-canvas pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Page Header */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 bg-accent-50 px-2.5 py-1 rounded-sm border border-accent-200">
            Screen 09 · Itinerary & Budget View
          </span>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink-900 mt-2">
            Itinerary & Budget Breakdown
          </h1>
          <p className="text-sm text-slate-600 font-sans mt-1">
            Review day-by-day scheduled activities alongside live financial tracking and budget rails.
          </p>
        </div>

        {/* DAY TABS CONTROL ROW */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            {stops.map((stop, idx) => (
              <button
                key={stop.id}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  activeDayIndex === idx
                    ? 'bg-accent-400 text-white shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-accent-50 hover:text-accent-800 border border-slate-200 hover:border-accent-300'
                }`}
              >
                Day {idx + 1}
              </button>
            ))}

            <button
              onClick={onAddDay}
              className="px-3.5 py-2 rounded-full text-xs font-semibold bg-white text-slate-600 border border-dashed border-slate-300 hover:border-accent-400 hover:text-accent-700 hover:bg-accent-50/50 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Add Day
            </button>
          </div>

          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
            📅 {currentDay.dates || 'Selected Day'}
          </span>
        </div>

        {/* 2-COLUMN DESKTOP LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Connected Activity Timeline (66% width) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-display font-semibold text-xl text-ink-900">
                    {currentDay.title || `Day ${activeDayIndex + 1} Schedule`}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sequence of planned activities for this day.
                  </p>
                </div>

                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 tabular-nums">
                  Day Total: ₹{(currentDay.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0).toLocaleString('en-IN')}
                </span>
              </div>

              {/* CONNECTED TIMELINE CARDS */}
              {currentDay.activities && currentDay.activities.length > 0 ? (
                <div className="space-y-0 relative">
                  {currentDay.activities.map((act, idx) => {
                    const isLast = idx === currentDay.activities.length - 1;
                    const isHighCost = Number(act.cost) > 5000;

                    return (
                      <React.Fragment key={act.id}>
                        {/* Activity Card with Hover Lift */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-accent-300 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between gap-4 group cursor-pointer">
                          
                          {/* Drag Handle & Info */}
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-accent-500 cursor-grab shrink-0 transition-colors" />
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {act.time && (
                                  <span className="text-[11px] font-semibold text-accent-700 bg-accent-50 px-2 py-0.5 rounded border border-accent-200 flex items-center gap-1 group-hover:border-accent-300 transition-colors">
                                    <Clock className="w-3 h-3" /> {act.time}
                                  </span>
                                )}
                                <span className="text-xs text-slate-500 font-medium">
                                  {act.category}
                                </span>
                              </div>

                              <h4 className="font-display font-semibold text-base text-ink-900 group-hover:text-accent-600 transition-colors">
                                {act.name}
                              </h4>
                            </div>
                          </div>

                          {/* Expense Chip & Actions */}
                          <div className="flex items-center gap-3 shrink-0">
                            {/* Expense Chip */}
                            <span className={`text-xs font-bold px-3 py-1 rounded-full tabular-nums border group-hover:shadow-xs transition-all ${
                              isHighCost ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-800 border-slate-200'
                            }`}>
                              ₹{Number(act.cost).toLocaleString('en-IN')}
                            </span>

                            {/* Row Hover Actions */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              <button className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer" title="Edit">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1 text-slate-400 hover:text-semantic-danger hover:bg-red-50 rounded transition-colors cursor-pointer" title="Remove">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 2px Vertical Connector Line with Down Chevron */}
                        {!isLast && (
                          <div className="py-2 flex justify-center items-center relative">
                            <div className="w-0.5 h-6 bg-slate-200" />
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute bg-white p-0.5 rounded-full border border-slate-200 shadow-xs" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  No activities scheduled for this day yet. Click below to search and add experiences!
                </div>
              )}

              <div className="pt-2">
                <Button variant="secondary" size="sm" icon={Plus} onClick={onAddDay} className="w-full justify-center">
                  Add Activity to Day {activeDayIndex + 1}
                </Button>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Budget Summary Panel (34% width) */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display font-semibold text-lg text-ink-900 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-accent-400" /> Trip Budget Summary
                </h3>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-xs text-slate-500">Total Spent / Budget</span>
                  <span className="font-bold text-base tabular-nums text-slate-900">
                    ₹{totalSpent.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">/ ₹{targetBudget.toLocaleString('en-IN')}</span>
                  </span>
                </div>
              </div>

              {/* Progress Bar with Color Thresholds */}
              <div className="space-y-1">
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOverBudget ? 'bg-semantic-danger' : overallPercent > 80 ? 'bg-amber-400' : 'bg-accent-400'
                    }`}
                    style={{ width: `${Math.min(overallPercent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                  <span>{overallPercent}% Used</span>
                  <span>{isOverBudget ? 'Over Budget!' : 'On Track'}</span>
                </div>
              </div>

              {/* Overbudget Alert Banner */}
              {isOverBudget || activeDayIndex === 1 ? (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-md text-xs text-amber-800 space-y-1 shadow-xs">
                  <span className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Overbudget Warning
                  </span>
                  <p className="text-[11px]">
                    Day 2 is 15% over your average day budget (₹{avgPerDay.toLocaleString('en-IN')}).
                  </p>
                </div>
              ) : null}

              {/* Category Breakdown List */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Category Breakdown
                </span>
                
                {Object.entries(categoryTotals).map(([cat, cost]) => (
                  <div key={cat} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                    <span className="text-slate-600 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-accent-400" />
                      {cat}
                    </span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      ₹{cost.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Average Daily Cost Stat */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Average Cost / Day</span>
                <span className="font-bold text-accent-700 tabular-nums">
                  ₹{avgPerDay.toLocaleString('en-IN')}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
