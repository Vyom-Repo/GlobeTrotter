import React, { useState } from 'react';
import {
  ArrowLeft, Plus, Eye, Save, AlertTriangle, PieChart, Sparkles
} from 'lucide-react';
import { StubCard } from './ui/StubCard';
import { Button } from './ui/Button';
import { ConfirmModal } from './ui/ConfirmModal';
import { ItineraryPreviewModal } from './ui/ItineraryPreviewModal';

export const Screen05_BuildItinerary = ({
  tripData,
  onUpdateTripData,
  onBack,
  onSaveAndExit
}) => {
  const [collapsedStops, setCollapsedStops] = useState({});
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  const stops = tripData.stops || [];
  
  const totalPlannedActivitiesCost = stops.reduce((acc, stop) => {
    const actSum = (stop.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
    return acc + actSum;
  }, 0);

  const totalStopsBudgetSum = stops.reduce((acc, stop) => acc + (Number(stop.budget) || 0), 0);
  
  const overallTargetBudget = totalStopsBudgetSum > 0 ? totalStopsBudgetSum : 60000;
  const overallUsedPercent = Math.round((totalPlannedActivitiesCost / overallTargetBudget) * 100);

  const isOverallOverBudget = overallUsedPercent > 100;
  const isApproachingBudget = overallUsedPercent >= 85 && overallUsedPercent <= 100;

  const categoryBreakdown = [
    { name: 'Accommodation (Hotels)', percent: 40, cost: Math.round(overallTargetBudget * 0.40) },
    { name: 'Food & Dining', percent: 20, cost: Math.round(overallTargetBudget * 0.20) },
    { name: 'Activities & Attractions', percent: 25, cost: Math.round(totalPlannedActivitiesCost) },
    { name: 'Transportation', percent: 15, cost: Math.round(overallTargetBudget * 0.15) }
  ];

  const handleUpdateStop = (stopId, updatedFields) => {
    const newStops = stops.map(s => s.id === stopId ? { ...s, ...updatedFields } : s);
    onUpdateTripData({ stops: newStops });
  };

  const handleDuplicateStop = (stopToDup) => {
    const newStop = {
      ...stopToDup,
      id: Date.now().toString(),
      title: `${stopToDup.title} (Copy)`,
      activities: stopToDup.activities ? [...stopToDup.activities] : []
    };
    onUpdateTripData({ stops: [...stops, newStop] });
  };

  const handleAddStop = () => {
    const nextNum = stops.length + 1;
    const newStop = {
      id: Date.now().toString(),
      title: `Stop ${String(nextNum).padStart(2, '0')} — New Location`,
      dates: 'Sep 16 → Sep 20',
      budget: 20000,
      notes: '',
      activities: [
        { id: Date.now().toString() + 'a', name: 'City Sightseeing Tour', cost: 3500 }
      ]
    };
    onUpdateTripData({ stops: [...stops, newStop] });
  };

  const handleConfirmDeleteStop = () => {
    if (!deleteTargetId) return;
    const newStops = stops.filter(s => s.id !== deleteTargetId);
    onUpdateTripData({ stops: newStops });
    setDeleteTargetId(null);
  };

  const handleMoveStop = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= stops.length) return;
    const updated = [...stops];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onUpdateTripData({ stops: updated });
  };

  const overBudgetStop = stops.find(s => {
    const actTotal = (s.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
    return Number(s.budget) > 0 && actTotal > Number(s.budget);
  });

  return (
    <div className="min-h-screen bg-surface-canvas pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Context Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-accent-600 transition-colors bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Trip Details
            </button>
            <span className="text-slate-300">·</span>
            <span className="font-display font-medium text-sm text-slate-700 truncate max-w-xs">
              {tripData.name || 'Kyoto Cherry Blossom Special'}
            </span>
          </div>

          <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 bg-accent-50 px-2.5 py-1 rounded-sm border border-accent-200">
            Step 2 of 2 · Build Itinerary
          </span>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink-900 mt-2">
            Build Itinerary
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-sans mt-1">
            Organize your trip into stops, set travel dates, manage budgets, and list planned activities.
          </p>
        </div>

        {/* Desktop 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Stops Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {stops.length > 0 ? (
              stops.map((stop, idx) => (
                <StubCard
                  key={stop.id}
                  variant="itinerary"
                  stopIndex={idx + 1}
                  title={stop.title}
                  dates={stop.dates}
                  budget={stop.budget}
                  notes={stop.notes}
                  activities={stop.activities || []}
                  isCollapsed={Boolean(collapsedStops[stop.id])}
                  onToggleCollapse={() => setCollapsedStops(prev => ({ ...prev, [stop.id]: !prev[stop.id] }))}
                  onUpdateStop={(fields) => handleUpdateStop(stop.id, fields)}
                  onDuplicateStop={() => handleDuplicateStop(stop)}
                  onDeleteStop={() => setDeleteTargetId(stop.id)}
                  onMoveUp={() => handleMoveStop(idx, -1)}
                  onMoveDown={() => handleMoveStop(idx, 1)}
                  isFirst={idx === 0}
                  isLast={idx === stops.length - 1}
                />
              ))
            ) : (
              /* Empty state */
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
                <Sparkles className="w-10 h-10 text-accent-300 mx-auto mb-3" />
                <h3 className="font-display font-semibold text-lg text-ink-900 mb-1">
                  No itinerary stops added yet
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Click the button below to create your first stop with travel dates, allocated budget, and activities.
                </p>
                <Button variant="primary" onClick={handleAddStop} icon={Plus}>
                  Add Your First Stop
                </Button>
              </div>
            )}

            {/* "Add Another Stop" Button */}
            <button
              onClick={handleAddStop}
              className="
                w-full py-4 rounded-xl bg-white text-ink-700 font-semibold text-sm
                border-2 border-dashed border-slate-300 hover:border-accent-400 hover:bg-accent-50/40
                transition-all duration-150 flex items-center justify-center gap-2 group cursor-pointer shadow-xs
              "
            >
              <div className="w-6 h-6 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center group-hover:bg-accent-400 group-hover:text-white transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <span>Add Another Stop</span>
            </button>
          </div>

          {/* Trip Summary Panel — Sticky Desktop Rail */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              {/* Header stats */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-semibold text-lg text-ink-900 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-accent-400" /> Trip Budget Summary
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  8 Days · {stops.length} Stops
                </span>
              </div>

              {/* Overall Budget Progress */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Overall Budget Utilized</span>
                  <span className={`font-semibold tabular-nums ${isOverallOverBudget ? 'text-semantic-danger' : 'text-ink-900'}`}>
                    ₹{totalPlannedActivitiesCost.toLocaleString('en-IN')} / ₹{overallTargetBudget.toLocaleString('en-IN')} ({overallUsedPercent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOverallOverBudget ? 'bg-danger-hatch' : isApproachingBudget ? 'bg-semantic-warning' : 'bg-accent-400'
                    }`}
                    style={{ width: `${Math.min(overallUsedPercent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Budget by Category Mini Bars */}
              <div className="space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Budget Allocation by Category
                </span>
                {categoryBreakdown.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">{cat.name}</span>
                      <span className="text-slate-500 font-semibold tabular-nums">{cat.percent}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-accent-400/80 rounded-full"
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Contextual Alert Banner */}
              {overBudgetStop && (
                <div className="bg-red-50 border-l-4 border-semantic-danger p-3.5 rounded-r-md text-xs text-semantic-danger flex items-start gap-2 animate-fade-in-up">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-semantic-danger" />
                  <div>
                    <span className="font-semibold block">{overBudgetStop.title || 'A stop'} is over budget</span>
                    <span className="text-[11px] opacity-90">Activity costs exceed the budget set for this stop.</span>
                  </div>
                </div>
              )}

              {/* Preview CTA */}
              <Button
                variant="secondary"
                fullWidth
                icon={Eye}
                onClick={() => setIsPreviewOpen(true)}
              >
                Preview Timeline Journal
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Floating Summary Pill */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsMobileSummaryOpen(true)}
          className="bg-accent-400 text-white font-semibold text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <PieChart className="w-4 h-4" />
          <span>Trip Summary · {overallUsedPercent}%</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet Modal */}
      {isMobileSummaryOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div onClick={() => setIsMobileSummaryOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative bg-white rounded-t-2xl p-6 border-t border-slate-200 shadow-xl z-10 space-y-5 animate-fade-in-up">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-2" />
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg text-ink-900">Trip Budget Summary</h3>
              <button onClick={() => setIsMobileSummaryOpen(false)} className="text-slate-500 font-semibold text-xs cursor-pointer">
                Close ✕
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span>Budget Utilized</span>
                <span className="tabular-nums">₹{totalPlannedActivitiesCost.toLocaleString('en-IN')} / ₹{overallTargetBudget.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full ${isOverallOverBudget ? 'bg-semantic-danger' : 'bg-accent-400'}`}
                  style={{ width: `${Math.min(overallUsedPercent, 100)}%` }}
                />
              </div>
            </div>

            <Button variant="secondary" fullWidth icon={Eye} onClick={() => { setIsMobileSummaryOpen(false); setIsPreviewOpen(true); }}>
              Preview Timeline Journal
            </Button>
          </div>
        </div>
      )}

      {/* Sticky Footer Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onSaveAndExit} icon={Save}>
            Save & Exit
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => alert("Itinerary saved successfully! Proceeding to itinerary overview...")}
            >
              Save & Complete Itinerary →
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Stop Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Remove this stop?"
        message="All associated activities and notes will be permanently removed from this itinerary."
        confirmLabel="Remove Stop"
        cancelLabel="Keep Stop"
        onConfirm={handleConfirmDeleteStop}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Itinerary Preview Modal */}
      <ItineraryPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        tripData={tripData}
      />
    </div>
  );
};
