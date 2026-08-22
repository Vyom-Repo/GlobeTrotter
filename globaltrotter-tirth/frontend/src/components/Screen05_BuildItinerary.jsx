import React, { useState } from 'react';
import {
  ArrowLeft, Plus, Eye, Save, AlertTriangle, ChevronUp, PieChart, Sparkles
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

  // Calculated stats
  const stops = tripData.stops || [];
  
  // Total budget vs total activities cost calculation
  const totalPlannedActivitiesCost = stops.reduce((acc, stop) => {
    const actSum = (stop.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
    return acc + actSum;
  }, 0);

  const totalStopsBudgetSum = stops.reduce((acc, stop) => acc + (Number(stop.budget) || 0), 0);
  
  // Overall trip budget target (e.g. 62,000)
  const overallTargetBudget = totalStopsBudgetSum > 0 ? totalStopsBudgetSum : 60000;
  const overallUsedPercent = Math.round((totalPlannedActivitiesCost / overallTargetBudget) * 100);

  const isOverallOverBudget = overallUsedPercent > 100;
  const isApproachingBudget = overallUsedPercent >= 85 && overallUsedPercent <= 100;

  // Category breakdown mock estimations per design spec §3.3 D
  const categoryBreakdown = [
    { name: 'Stay (Hotels)', percent: 40, cost: Math.round(overallTargetBudget * 0.40) },
    { name: 'Food & Dining', percent: 20, cost: Math.round(overallTargetBudget * 0.20) },
    { name: 'Activities & Attractions', percent: 25, cost: Math.round(totalPlannedActivitiesCost) },
    { name: 'Transport', percent: 15, cost: Math.round(overallTargetBudget * 0.15) }
  ];

  // Stop mutation handlers
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
      title: `Stop ${String(nextNum).padStart(2, '0')} — New Destination`,
      dates: 'Sep 16 → Sep 20',
      budget: 20000,
      notes: '',
      activities: [
        { id: Date.now().toString() + 'a', name: 'Guided Walking Tour', cost: 3500 }
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

  // Find over-budget stops for warning alert
  const overBudgetStop = stops.find(s => {
    const actTotal = (s.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
    return Number(s.budget) > 0 && actTotal > Number(s.budget);
  });

  return (
    <div className="min-h-screen bg-surface-canvas pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* A. Context Header (§3.3 A) */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-700 hover:text-accent-600 transition-colors bg-surface-raised px-2.5 py-1 rounded-md border border-accent-200/50 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to trip details
            </button>
            <span className="text-ink-300">·</span>
            <span className="font-display font-medium text-sm text-ink-700 truncate max-w-xs">
              {tripData.name || 'Kyoto in cherry blossom season'}
            </span>
          </div>

          <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 bg-accent-100 px-2.5 py-1 rounded-sm">
            Screen 05 · Step 2 of 2
          </span>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink-900 mt-2">
            Build itinerary
          </h1>
          <p className="text-sm sm:text-base text-ink-700 font-sans mt-1">
            Break your trip into stops. Add dates, budget and activities to each one.
          </p>
        </div>

        {/* Desktop 2-Column Grid Layout (§3.2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Stops Column (66% width on desktop) */}
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
              /* Empty state (§3.4) */
              <div className="bg-surface-raised rounded-xl border border-accent-200 p-8 text-center shadow-neo-raised">
                <Sparkles className="w-10 h-10 text-accent-300 mx-auto mb-3" />
                <h3 className="font-display font-semibold text-lg text-ink-900 mb-1">
                  No stops yet
                </h3>
                <p className="text-sm text-ink-500 max-w-md mx-auto mb-6">
                  Add your first stop to start building your itinerary journal with dates and budget items.
                </p>
                <Button variant="primary" onClick={handleAddStop} icon={Plus}>
                  Add your first section
                </Button>
              </div>
            )}

            {/* C. "Add another section" Dashed Button (§3.3 C) */}
            <button
              onClick={handleAddStop}
              className="
                w-full py-4 rounded-lg bg-surface-canvas text-ink-700 font-semibold text-sm
                border-2 border-dashed border-accent-300/80 hover:border-accent-400 hover:bg-accent-50/60
                transition-all duration-150 flex items-center justify-center gap-2 group cursor-pointer
              "
            >
              <div className="w-6 h-6 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center group-hover:bg-accent-400 group-hover:text-white transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <span>Add another section</span>
            </button>
          </div>

          {/* D. Trip Summary Panel — Sticky Desktop Rail (§3.3 D) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="bg-surface-raised rounded-xl border border-accent-200/80 p-6 shadow-neo-raised space-y-6">
              
              {/* Header stats */}
              <div className="flex items-center justify-between border-b border-ink-300/20 pb-3">
                <h3 className="font-display font-semibold text-lg text-ink-900 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-accent-400" /> Trip Summary
                </h3>
                <span className="text-xs font-semibold text-ink-500">
                  8 days · {stops.length} stops
                </span>
              </div>

              {/* Overall Budget Progress */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-ink-500 font-medium">Overall Budget</span>
                  <span className={`font-semibold tabular-nums ${isOverallOverBudget ? 'text-semantic-danger' : 'text-ink-900'}`}>
                    ¥{totalPlannedActivitiesCost.toLocaleString()} / ¥{overallTargetBudget.toLocaleString()} ({overallUsedPercent}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-sunken overflow-hidden p-0.5 border border-accent-200/40">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOverallOverBudget ? 'bg-danger-hatch' : isApproachingBudget ? 'bg-semantic-warning' : 'bg-accent-400'
                    }`}
                    style={{ width: `${Math.min(overallUsedPercent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Budget by Category Mini Bars (§3.3 D) */}
              <div className="space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                  Budget by category
                </span>
                {categoryBreakdown.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-ink-700 font-medium">{cat.name}</span>
                      <span className="text-ink-500 font-semibold tabular-nums">{cat.percent}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-sunken overflow-hidden">
                      <div
                        className="h-full bg-accent-400/80 rounded-full"
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Contextual Alert Banner (§3.3 D) */}
              {overBudgetStop && (
                <div className="bg-red-50/90 border-l-4 border-semantic-danger p-3.5 rounded-r-md text-xs text-semantic-danger flex items-start gap-2 animate-fade-in-up">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-semantic-danger" />
                  <div>
                    <span className="font-semibold block">{overBudgetStop.title || 'A stop'} is over budget</span>
                    <span className="text-[11px] opacity-90">Planned activities exceed this stop's set allocation.</span>
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
                Preview itinerary
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Floating Summary Pill (<768px) (§3.4) */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsMobileSummaryOpen(true)}
          className="bg-accent-400 text-white font-semibold text-xs px-4 py-2.5 rounded-full shadow-neo-floating flex items-center gap-2 border border-accent-300"
        >
          <PieChart className="w-4 h-4" />
          <span>Trip summary · {overallUsedPercent}%</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet Modal */}
      {isMobileSummaryOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div onClick={() => setIsMobileSummaryOpen(false)} className="fixed inset-0 bg-ink-900/40 backdrop-blur-xs" />
          <div className="relative bg-surface-raised rounded-t-2xl p-6 border-t border-accent-200 shadow-neo-floating z-10 space-y-5 animate-fade-in-up">
            <div className="w-12 h-1 bg-ink-300/40 rounded-full mx-auto mb-2" />
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg text-ink-900">Trip Summary</h3>
              <button onClick={() => setIsMobileSummaryOpen(false)} className="text-ink-500 font-semibold text-xs">
                Close ✕
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span>Budget utilized</span>
                <span className="tabular-nums">¥{totalPlannedActivitiesCost.toLocaleString()} / ¥{overallTargetBudget.toLocaleString()}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-surface-sunken overflow-hidden">
                <div
                  className={`h-full ${isOverallOverBudget ? 'bg-semantic-danger' : 'bg-accent-400'}`}
                  style={{ width: `${Math.min(overallUsedPercent, 100)}%` }}
                />
              </div>
            </div>

            <Button variant="secondary" fullWidth icon={Eye} onClick={() => { setIsMobileSummaryOpen(false); setIsPreviewOpen(true); }}>
              Preview itinerary
            </Button>
          </div>
        </div>
      )}

      {/* Sticky Footer Action Bar (§3.3 E) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-raised/95 backdrop-blur-md border-t border-accent-200/80 shadow-neo-floating py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onSaveAndExit} icon={Save}>
            Save & exit
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => alert("Itinerary saved successfully! Proceeding to travel booking...")}
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Stop Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Remove this stop?"
        message="Its associated activities and notes will be permanently removed from this itinerary."
        confirmLabel="Remove stop"
        cancelLabel="Keep stop"
        onConfirm={handleConfirmDeleteStop}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Itinerary Preview Modal (Screen 06 View) */}
      <ItineraryPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        tripData={tripData}
      />
    </div>
  );
};
