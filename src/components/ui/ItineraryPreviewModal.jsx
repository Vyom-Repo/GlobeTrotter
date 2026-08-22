import React from 'react';
import { X, Calendar, MapPin, DollarSign, CheckCircle2, Share2, Printer } from 'lucide-react';
import { Button } from './Button';

export const ItineraryPreviewModal = ({
  isOpen,
  onClose,
  tripData
}) => {
  if (!isOpen) return null;

  const totalCost = (tripData.stops || []).reduce((acc, stop) => {
    const actTotal = (stop.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
    return acc + Math.max(Number(stop.budget) || 0, actTotal);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm" />

      {/* Main Dialog */}
      <div className="relative bg-surface-raised border border-accent-200 shadow-neo-floating rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto z-10 animate-fade-in-up">
        {/* Modal Header */}
        <div className="sticky top-0 bg-surface-raised/95 backdrop-blur-md px-6 py-4 border-b border-ink-300/20 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-accent-700 bg-accent-100 px-2.5 py-1 rounded-full">
              Screen 06 Preview · Journal View
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Itinerary link copied to clipboard!")}
              className="p-2 text-ink-500 hover:text-accent-700 rounded-md hover:bg-accent-50"
              title="Share itinerary"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 text-ink-500 hover:text-accent-700 rounded-md hover:bg-accent-50"
              title="Print itinerary"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-ink-500 hover:text-ink-900 rounded-md hover:bg-surface-sunken"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Styled Travel Journal */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Hero Banner */}
          <div className="relative h-[220px] rounded-lg overflow-hidden shadow-neo-raised border border-accent-200/50">
            <img
              src={tripData.coverUrl || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'}
              alt={tripData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/30 to-transparent" />
            <div className="absolute bottom-5 left-6 right-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-200 bg-ink-900/60 px-2.5 py-0.5 rounded backdrop-blur-sm">
                GlobeTrotter Itinerary
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold mt-1.5 drop-shadow-md">
                {tripData.name || "Untitled Trip"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-sans mt-2 text-slate-200">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-accent-300" /> {(tripData.destinations || []).join(', ') || 'Various places'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-accent-300" /> {tripData.startDate} → {tripData.endDate}</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-300"><DollarSign className="w-3.5 h-3.5" /> Total Est. ¥{totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {tripData.description && (
            <div className="bg-surface-sunken p-4 rounded-md shadow-neo-pressed border border-accent-200/40 italic font-display text-ink-700 text-sm">
              "{tripData.description}"
            </div>
          )}

          {/* Stops Timeline */}
          <div className="space-y-6">
            <h2 className="font-display font-semibold text-xl text-ink-900 border-b border-ink-300/20 pb-2">
              Trip Timeline & Stops
            </h2>

            {tripData.stops && tripData.stops.length > 0 ? (
              <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-accent-300/40">
                {tripData.stops.map((stop, idx) => (
                  <div key={stop.id} className="relative pl-10">
                    {/* Timeline Node Badge */}
                    <div className="absolute left-1.5 top-1.5 w-6 h-6 rounded-full bg-accent-400 text-white font-bold text-xs flex items-center justify-center border-2 border-surface-raised shadow-sm">
                      {idx + 1}
                    </div>

                    {/* Timeline Card */}
                    <div className="bg-surface-raised border border-accent-200/70 rounded-lg p-5 shadow-neo-raised">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display font-semibold text-lg text-ink-900">
                            {stop.title || `Stop ${idx + 1}`}
                          </h3>
                          <p className="text-xs text-ink-500 mt-0.5">
                            📅 {stop.dates || 'Dates TBD'}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-ink-700 bg-surface-sunken px-2.5 py-1 rounded-md tabular-nums border border-accent-200/50">
                          Budget: ¥{Number(stop.budget).toLocaleString()}
                        </span>
                      </div>

                      {stop.notes && (
                        <p className="text-xs text-ink-700 font-sans mt-3 bg-surface-sunken/50 p-2.5 rounded border border-ink-300/10">
                          {stop.notes}
                        </p>
                      )}

                      {/* Activities */}
                      {stop.activities && stop.activities.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-ink-300/20 space-y-2">
                          <span className="text-[11px] font-semibold uppercase text-ink-500">Scheduled Activities</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {stop.activities.map((act) => (
                              <div key={act.id} className="flex items-center justify-between text-xs bg-surface-sunken px-3 py-2 rounded-md">
                                <span className="text-ink-900 font-medium flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success shrink-0" />
                                  {act.name}
                                </span>
                                <span className="font-semibold text-ink-700 tabular-nums">
                                  ¥{Number(act.cost).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-ink-500 py-6">No stops created yet.</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-surface-raised px-6 py-4 border-t border-ink-300/20 flex items-center justify-between">
          <span className="text-xs text-ink-500">Ready to travel? Save and export your itinerary.</span>
          <Button variant="primary" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
};
