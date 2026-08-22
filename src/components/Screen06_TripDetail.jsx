import React, { useState } from 'react';
import {
  ArrowLeft, Calendar, MapPin, CheckCircle2, Share2, Printer, Compass, DollarSign,
  Layers, Edit2, Clock, Sparkles, PieChart, AlertTriangle, FileText, ArrowRight
} from 'lucide-react';
import { Button } from './ui/Button';

export const Screen06_TripDetail = ({
  tripData,
  onBack,
  onEditTrip
}) => {
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'budget' | 'overview'

  if (!tripData) return null;

  const stops = tripData.stops || [];

  // Total budget calculations
  const totalPlannedActivitiesCost = stops.reduce((acc, stop) => {
    const actSum = (stop.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
    return acc + actSum;
  }, 0);

  const totalStopsBudget = stops.reduce((acc, stop) => acc + (Number(stop.budget) || 0), 0);
  const displayTotalBudget = totalStopsBudget > 0 ? totalStopsBudget : tripData.targetBudget || 60000;
  const overallUsedPercent = Math.min(Math.round((totalPlannedActivitiesCost / displayTotalBudget) * 100), 150);
  const isOverBudget = overallUsedPercent > 100;

  const coverPhoto = tripData.coverUrl || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80';

  const categoryBreakdown = [
    { name: 'Accommodation (Hotels)', percent: 40, cost: Math.round(displayTotalBudget * 0.40) },
    { name: 'Food & Dining', percent: 20, cost: Math.round(displayTotalBudget * 0.20) },
    { name: 'Activities & Sightseeing', percent: 25, cost: Math.round(totalPlannedActivitiesCost) },
    { name: 'Transportation', percent: 15, cost: Math.round(displayTotalBudget * 0.15) }
  ];

  return (
    <div className="min-h-screen bg-surface-canvas pb-28 animate-fade-in-up">
      
      {/* 1. STICKY TOP HEADER NAV BAR */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-accent-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to My Trips
            </button>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <span className="font-display font-semibold text-sm text-ink-900 truncate max-w-xs hidden sm:inline">
              {tripData.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Itinerary link copied to clipboard!")}
              className="p-2 text-slate-500 hover:text-accent-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="Share Itinerary"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-500 hover:text-accent-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="Print Itinerary"
            >
              <Printer className="w-4.5 h-4.5" />
            </button>
            <Button
              size="sm"
              variant="primary"
              icon={Edit2}
              onClick={() => onEditTrip(tripData)}
              className="cursor-pointer"
            >
              Edit Trip
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">

        {/* 2. GORGEOUS HERO COVER BANNER */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 min-h-[280px] sm:min-h-[340px] flex flex-col justify-end p-6 sm:p-10 group">
          <img
            src={coverPhoto}
            alt={tripData.name}
            className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/40" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-200 bg-slate-950/80 px-3 py-1 rounded-md backdrop-blur-md border border-white/10">
              GlobeTrotter Journal
            </span>
            {tripData.status && (
              <span className="text-xs font-semibold capitalize px-3 py-1 rounded-md bg-emerald-600 text-white backdrop-blur-md shadow-xs">
                ● {tripData.status}
              </span>
            )}
          </div>

          {/* Banner Details */}
          <div className="relative z-10 space-y-3 text-white max-w-3xl">
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white drop-shadow-md leading-tight">
              {tripData.name || "Untitled Trip"}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-sans text-slate-200">
              <span className="flex items-center gap-1.5 font-medium bg-slate-950/50 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10">
                <MapPin className="w-4 h-4 text-accent-300" />
                {(tripData.destinations || []).join(', ') || 'Destinations TBD'}
              </span>
              <span className="flex items-center gap-1.5 font-medium bg-slate-950/50 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10">
                <Calendar className="w-4 h-4 text-accent-300" />
                {tripData.startDate || 'Start Date'} → {tripData.endDate || 'End Date'}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-300 bg-slate-950/50 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10">
                Est. Budget: ₹{displayTotalBudget.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* 3. NAVIGATION TABS FOR JOURNAL (Timeline / Budget / Overview) */}
        <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs flex items-center gap-2">
          {[
            { id: 'timeline', label: 'Itinerary Timeline', icon: Layers, count: stops.length },
            { id: 'budget', label: 'Budget & Expenses', icon: PieChart },
            { id: 'overview', label: 'Trip Overview', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-accent-50 text-accent-800 border border-accent-200 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-accent-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-xs opacity-70 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 4. TAB CONTENT VIEWS */}

        {/* TAB 1: ITINERARY TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Stops Timeline */}
            {stops.length > 0 ? (
              <div className="space-y-8 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-accent-200">
                {stops.map((stop, idx) => {
                  const stopActTotal = (stop.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
                  const stopBudget = Number(stop.budget) || 0;
                  const isStopOver = stopBudget > 0 && stopActTotal > stopBudget;

                  return (
                    <div key={stop.id} className="relative pl-12 group">
                      {/* Node badge */}
                      <div className="absolute left-2.5 top-2 -translate-x-1/2 w-8 h-8 rounded-full bg-accent-400 text-white font-bold text-sm flex items-center justify-center border-2 border-white shadow-sm ring-2 ring-accent-400/20">
                        {idx + 1}
                      </div>

                      {/* Card Container */}
                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                              STOP {String(idx + 1).padStart(2, '0')}
                            </span>
                            <h3 className="font-display font-semibold text-xl text-ink-900 mt-0.5">
                              {stop.title || `Stop ${idx + 1}`}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-accent-400" />
                              {stop.dates || 'Dates TBD'}
                            </p>
                          </div>

                          <div className="self-start sm:self-auto">
                            <span className={`text-xs font-bold px-3.5 py-1.5 rounded-lg tabular-nums border ${
                              isStopOver ? 'bg-red-50 text-semantic-danger border-red-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}>
                              Stop Budget: ₹{stopBudget.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Notes */}
                        {stop.notes && (
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                            <span className="font-semibold text-slate-900 block mb-1">Notes & Key Highlights:</span>
                            {stop.notes}
                          </div>
                        )}

                        {/* Scheduled Activities */}
                        {stop.activities && stop.activities.length > 0 && (
                          <div className="pt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Scheduled Activities ({stop.activities.length})
                              </span>
                              <span className="text-xs font-semibold tabular-nums text-slate-700">
                                Subtotal: ₹{stopActTotal.toLocaleString('en-IN')}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {stop.activities.map((act) => (
                                <div
                                  key={act.id}
                                  className="flex items-center justify-between text-xs bg-slate-50 hover:bg-slate-100 px-4 py-3 rounded-lg border border-slate-200 transition-colors"
                                >
                                  <span className="text-ink-900 font-medium flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    {act.name}
                                  </span>
                                  <span className="font-bold text-slate-800 tabular-nums">
                                    ₹{Number(act.cost).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
                No stops added to this itinerary yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BUDGET & EXPENSES */}
        {activeTab === 'budget' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Overall Track Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-display font-semibold text-lg text-ink-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent-400" /> Overall Trip Budget Breakdown
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Spent / Planned</span>
                  <span className={`font-bold tabular-nums ${isOverBudget ? 'text-semantic-danger' : 'text-slate-800'}`}>
                    ₹{totalPlannedActivitiesCost.toLocaleString('en-IN')} / ₹{displayTotalBudget.toLocaleString('en-IN')} ({overallUsedPercent}%)
                  </span>
                </div>
                <div className="w-full h-3.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${isOverBudget ? 'bg-danger-hatch' : 'bg-accent-400'}`}
                    style={{ width: `${Math.min(overallUsedPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Category Breakdown Grid */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h4 className="font-display font-semibold text-base text-ink-900">
                Budget Allocation by Category
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryBreakdown.map((cat, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{cat.name}</span>
                      <span className="text-accent-700 font-bold">₹{cat.cost.toLocaleString('en-IN')} ({cat.percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-accent-400 rounded-full" style={{ width: `${cat.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRIP OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6 animate-fade-in-up">
            <h3 className="font-display font-semibold text-xl text-ink-900 border-b border-slate-100 pb-3">
              Trip Overview & Notes
            </h3>

            {tripData.description ? (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-700 leading-relaxed italic font-display">
                "{tripData.description}"
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No overview description added yet.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="block font-display font-bold text-2xl text-ink-900">{stops.length}</span>
                <span className="text-xs text-slate-500 font-semibold uppercase">Total Stops</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="block font-display font-bold text-2xl text-accent-600">
                  {(tripData.destinations || []).length}
                </span>
                <span className="text-xs text-slate-500 font-semibold uppercase">Destinations</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="block font-display font-bold text-2xl text-emerald-600">
                  ₹{displayTotalBudget.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-semibold uppercase">Total Budget</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
