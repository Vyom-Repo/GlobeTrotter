import React, { useState, useEffect } from 'react';
import {
  X, Calendar, MapPin, CheckCircle2, Share2, Printer, DollarSign, BookOpen, Layers, ZoomIn
} from 'lucide-react';
import { Button } from './Button';

export const ItineraryPreviewModal = ({
  isOpen,
  onClose,
  tripData
}) => {
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);

  // Lock outer page background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !tripData) return null;

  const stops = tripData.stops || [];

  const totalPlannedActivitiesCost = stops.reduce((acc, stop) => {
    const actSum = (stop.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
    return acc + actSum;
  }, 0);

  const totalStopsBudget = stops.reduce((acc, stop) => acc + (Number(stop.budget) || 0), 0);
  const displayTotalBudget = totalStopsBudget > 0 ? totalStopsBudget : tripData.targetBudget || 60000;

  const coverPhoto = tripData.coverUrl || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md">

      {/* Backdrop Click */}
      <div onClick={onClose} className="fixed inset-0" />

      {/* Main Journal Modal Card */}
      <div className="relative bg-white border border-slate-200 shadow-2xl rounded-2xl max-w-4xl w-full my-auto z-10 animate-fade-in-up overflow-hidden flex flex-col">

        {/* Sticky Header Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-700 bg-accent-50 px-3 py-1 rounded-full border border-accent-200">
              <BookOpen className="w-3.5 h-3.5 text-accent-600" /> Travel Journal Timeline
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Itinerary share link copied to clipboard!")}
              className="p-2 text-slate-500 hover:text-accent-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Share Itinerary"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-500 hover:text-accent-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Print Itinerary"
            >
              <Printer className="w-4.5 h-4.5" />
            </button>
            <div className="w-px h-5 bg-slate-200 mx-1" />
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* GORGEOUS JOURNAL CONTENT BODY */}
        <div className="p-6 sm:p-10 space-y-8">

          {/* HERO PICTURE SECTION WITH ZOOM-IN PHOTO & LIGHTBOX CLICK */}
          <div
            onClick={() => setIsPhotoZoomed(true)}
            className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 min-h-[250px] sm:min-h-[300px] flex flex-col justify-end p-6 sm:p-8 group cursor-pointer"
            title="Click to zoom image"
          >
            <img
              src={coverPhoto}
              alt={tripData.name}
              className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/40" />

            {/* Picture Zoom Hint Overlay */}
            <div className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-sm">
              <ZoomIn className="w-3.5 h-3.5 text-accent-300" />
              <span>Expand Photo</span>
            </div>

            <div className="relative z-10 space-y-2 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-accent-200 bg-slate-950/70 px-3 py-1 rounded-md backdrop-blur-xs border border-white/10">
                  GlobeTrotter Journal
                </span>
                {tripData.status && (
                  <span className="text-xs font-semibold capitalize px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white backdrop-blur-xs shadow-xs">
                    ● {tripData.status}
                  </span>
                )}
              </div>

              <h1 className="font-display font-bold text-2xl sm:text-4xl text-white drop-shadow-md leading-snug">
                {tripData.name || "Untitled Trip"}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-slate-200 pt-1">
                <span className="flex items-center gap-1.5 font-medium bg-slate-950/50 px-3 py-1 rounded-md backdrop-blur-xs border border-white/10">
                  <MapPin className="w-4 h-4 text-accent-300" />
                  {(tripData.destinations || []).join(', ') || 'Destinations TBD'}
                </span>
                <span className="flex items-center gap-1.5 font-medium bg-slate-950/50 px-3 py-1 rounded-md backdrop-blur-xs border border-white/10">
                  <Calendar className="w-4 h-4 text-accent-300" />
                  {tripData.startDate || 'Start Date'} → {tripData.endDate || 'End Date'}
                </span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-300 bg-slate-950/50 px-3 py-1 rounded-md backdrop-blur-xs border border-white/10">
                  Est. Budget: ₹{displayTotalBudget.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* TRIP OVERVIEW / NOTES QUOTE */}
          {tripData.description && (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 relative">
              <span className="text-3xl text-accent-300 font-display absolute top-2 left-4 select-none">“</span>
              <p className="font-display italic text-slate-700 text-sm sm:text-base pl-5 pr-2 leading-relaxed">
                {tripData.description}
              </p>
            </div>
          )}

          {/* BUDGET SUMMARY BAR */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-display font-semibold text-ink-900 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-accent-400" /> Total Budget Utilization
              </span>
              <span className="font-bold tabular-nums text-slate-800">
                ₹{totalPlannedActivitiesCost.toLocaleString('en-IN')} spent of ₹{displayTotalBudget.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200 p-0.5">
              <div
                className="h-full rounded-full bg-accent-400 transition-all duration-300"
                style={{ width: `${Math.min(Math.round((totalPlannedActivitiesCost / displayTotalBudget) * 100), 100)}%` }}
              />
            </div>
          </div>

          {/* INTERACTIVE STOPS TIMELINE SECTION */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="font-display font-semibold text-xl text-ink-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-accent-400" /> Itinerary Timeline & Stops
              </h2>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {stops.length} Stops Total
              </span>
            </div>

            {stops.length > 0 ? (
              <div className="space-y-8 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-accent-200/80">
                {stops.map((stop, idx) => {
                  const stopActTotal = (stop.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
                  const stopBudget = Number(stop.budget) || 0;
                  const isOver = stopBudget > 0 && stopActTotal > stopBudget;

                  return (
                    <div key={stop.id} className="relative pl-12 group">
                      {/* Timeline Node Badge */}
                      <div className="absolute left-2.5 top-1.5 -translate-x-1/2 w-7 h-7 rounded-full bg-accent-400 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm ring-2 ring-accent-400/20">
                        {idx + 1}
                      </div>

                      {/* Timeline Card Container */}
                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="font-display font-semibold text-lg sm:text-xl text-ink-900">
                              {stop.title || `Stop ${idx + 1}`}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-accent-400" />
                              {stop.dates || 'Dates TBD'}
                            </p>
                          </div>

                          <div className="self-start sm:self-auto">
                            <span className={`text-xs font-bold px-3 py-1 rounded-md tabular-nums border ${
                              isOver ? 'bg-red-50 text-semantic-danger border-red-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              Budget: ₹{stopBudget.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Notes */}
                        {stop.notes && (
                          <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans">
                            <span className="font-semibold text-slate-900 block mb-0.5">Notes:</span>
                            {stop.notes}
                          </div>
                        )}

                        {/* Activities Grid */}
                        {stop.activities && stop.activities.length > 0 && (
                          <div className="pt-2 space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                              Scheduled Activities ({stop.activities.length})
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {stop.activities.map((act) => (
                                <div
                                  key={act.id}
                                  className="flex items-center justify-between text-xs bg-slate-50 hover:bg-slate-100/80 px-3.5 py-2.5 rounded-lg border border-slate-200 transition-colors"
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
              <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl border border-slate-200 text-sm">
                No stops added to this itinerary yet.
              </div>
            )}
          </div>

        </div>

        {/* Sticky Footer Bar */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-slate-100 flex items-center justify-between z-30 shadow-lg">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Export or view your itinerary journal anytime.
          </span>
          <Button variant="primary" onClick={onClose} className="ml-auto cursor-pointer">
            Close Journal
          </Button>
        </div>

      </div>

      {/* FULLSCREEN PHOTO ZOOM LIGHTBOX MODAL */}
      {isPhotoZoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in-up">
          <button
            onClick={() => setIsPhotoZoomed(false)}
            className="absolute top-4 right-4 p-2.5 text-white bg-slate-800/80 hover:bg-slate-700 rounded-full border border-white/20 cursor-pointer z-50"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20 relative">
            <img
              src={coverPhoto}
              alt={tripData.name}
              className="w-full h-full object-contain max-h-[85vh] mx-auto"
            />
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-lg border border-white/10">
              {tripData.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
