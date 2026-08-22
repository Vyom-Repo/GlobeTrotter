import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import sharingService from '../services/sharingService';
import { ArrowLeft, Globe, Calendar, MapPin, Clock, DollarSign, Loader2, AlertCircle, Compass, Share2 } from 'lucide-react';

export default function PublicTripDetails() {
  const { tripId, token } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPublicTrip();
  }, [tripId, token]);

  const loadPublicTrip = async () => {
    try {
      setLoading(true);
      setError('');

      let res;
      if (token) {
        res = await sharingService.getSharedTrip(token);
      } else if (tripId) {
        res = await sharingService.getPublicTripDetail(tripId);
      }

      if (res && res.data) {
        setTrip(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load public trip. The share token or trip may be expired or private.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-12 text-center text-slate-500 flex items-center justify-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading Shared Trip Itinerary...</span>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-3xl mx-auto p-8 pt-12">
          <div className="bg-white p-8 rounded-3xl border border-red-200 shadow-sm text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Public Trip Unavailable</h2>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              {error || 'This trip is private or the share token has expired.'}
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow"
            >
              Explore Public Trips
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation */}
        <button
          onClick={() => navigate('/explore')}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Community Explore</span>
        </button>

        {/* Hero Header */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="capitalize">{trip.visibility} Trip</span>
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">{trip.name}</h1>
            </div>

            <div className="flex items-center space-x-4 text-xs font-semibold text-slate-600 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{trip.start_date} → {trip.end_date}</span>
              </div>
              {trip.budget_limit && (
                <div className="flex items-center space-x-1.5 border-l border-slate-200 pl-4">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Budget: {trip.currency} {parseFloat(trip.budget_limit).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {trip.description && (
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {trip.description}
            </p>
          )}
        </div>

        {/* Destination Stops & Itineraries */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <span>Destination Stops & Activities</span>
          </h2>

          {(!trip.stops || trip.stops.length === 0) ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
              No destination stops have been added to this trip yet.
            </div>
          ) : (
            trip.stops.map((stop, idx) => (
              <div key={stop.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                {/* Stop Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">
                        {stop.city ? `${stop.city.name}` : `Stop ${stop.stop_order}`}
                      </h3>
                      <p className="text-xs text-slate-500">
                        📍 {stop.start_date} to {stop.end_date}
                      </p>
                    </div>
                  </div>
                  {stop.notes && (
                    <span className="text-xs italic text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 max-w-xs truncate">
                      "{stop.notes}"
                    </span>
                  )}
                </div>

                {/* Itinerary Items for Stop */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Scheduled Activities
                  </h4>

                  {(!stop.itinerary_items || stop.itinerary_items.length === 0) ? (
                    <p className="text-xs text-slate-400 italic">No scheduled activities for this stop.</p>
                  ) : (
                    <div className="space-y-3">
                      {stop.itinerary_items.map((item) => (
                        <div key={item.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <h5 className="font-bold text-sm text-slate-900">
                                {item.activity ? item.activity.name : 'Custom Activity'}
                              </h5>
                              <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                                <span>📅 {item.scheduled_date}</span>
                                {item.start_time && (
                                  <span>⏰ {item.start_time} {item.end_time ? `- ${item.end_time}` : ''}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {item.activity?.estimated_cost && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                              ~{trip.currency} {parseFloat(item.activity.estimated_cost).toLocaleString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
