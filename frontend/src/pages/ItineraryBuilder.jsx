import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import tripService from '../services/tripService';
import { Calendar, Clock, Plus, Trash2, ArrowLeft, Loader2, AlertCircle, Search, MapPin, DollarSign, Check, ChevronRight } from 'lucide-react';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  const [itineraryItems, setItineraryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Activity search state
  const [activitySearch, setActivitySearch] = useState('');
  const [activityType, setActivityType] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Add Item form state
  const [scheduledDate, setScheduledDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [addingItem, setAddingItem] = useState(false);

  useEffect(() => {
    loadTripAndStops();
  }, [tripId]);

  const loadTripAndStops = async () => {
    try {
      setLoading(true);
      setError('');
      const tripData = await tripService.getTrip(tripId);
      setTrip(tripData);

      const stopsRes = await tripService.getStops(tripId);
      if (stopsRes && stopsRes.data) {
        setStops(stopsRes.data);
        if (stopsRes.data.length > 0) {
          loadItineraryForStop(stopsRes.data[0].id);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  const loadItineraryForStop = async (stopId) => {
    try {
      const res = await tripService.getItineraryItems(stopId);
      if (res && res.data) {
        setItineraryItems(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentStop = stops[activeStopIndex];

  // Search Activities when currentStop, activitySearch, or activityType changes
  useEffect(() => {
    if (!currentStop) return;
    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await tripService.searchActivities({
          cityId: currentStop.city_id,
          search: activitySearch.trim(),
          activityType: activityType,
        });
        if (res && res.data) {
          setSearchResults(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [currentStop, activitySearch, activityType]);

  const handleSelectStop = (index) => {
    setActiveStopIndex(index);
    setSelectedActivity(null);
    loadItineraryForStop(stops[index].id);
  };

  const handleAddItineraryItem = async () => {
    if (!selectedActivity || !currentStop) return;
    if (!scheduledDate) {
      setError('Please select a scheduled date for the activity.');
      return;
    }

    try {
      setAddingItem(true);
      setError('');

      // Find current max item_order for scheduledDate
      const sameDayItems = itineraryItems.filter(i => i.scheduled_date === scheduledDate);
      const nextOrder = sameDayItems.length + 1;

      await tripService.addItineraryItem({
        trip_stop_id: currentStop.id,
        activity_id: selectedActivity.id,
        scheduled_date: scheduledDate,
        start_time: startTime || null,
        end_time: endTime || null,
        item_order: nextOrder,
        notes: notes,
        estimated_cost: selectedActivity.estimated_cost,
      });

      setSelectedActivity(null);
      setStartTime('');
      setEndTime('');
      setNotes('');
      loadItineraryForStop(currentStop.id);
    } catch (err) {
      setError(err.message || 'Failed to schedule activity');
    } finally {
      setAddingItem(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await tripService.deleteItineraryItem(itemId);
      loadItineraryForStop(currentStop.id);
    } catch (err) {
      setError(err.message || 'Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-12 text-center text-slate-500 flex items-center justify-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading Itinerary Builder...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/trips/${tripId}`)}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trip Destinations</span>
          </button>

          {trip && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/trips/${tripId}/budget`)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow flex items-center space-x-1"
              >
                <span>Budget & Expenses</span>
              </button>

              <div className="text-right">
                <h1 className="text-xl font-bold text-slate-900">{trip.name}</h1>
                <p className="text-xs text-slate-500">{trip.start_date} → {trip.end_date}</p>
              </div>
            </div>
          )}
        </div>

        {/* Errors */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Destination Stops Tabs */}
        {stops.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-2">No destination stops found</h3>
            <p className="text-xs text-slate-500 mb-4">Please add destination cities to your trip before scheduling activities.</p>
            <button
              onClick={() => navigate(`/trips/${tripId}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-xl transition"
            >
              Add Destinations
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6">
              {stops.map((stop, idx) => (
                <button
                  key={stop.id}
                  onClick={() => handleSelectStop(idx)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                    activeStopIndex === idx
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    activeStopIndex === idx ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {stop.stop_order}
                  </span>
                  <span>{stop.city ? stop.city.name : `Stop ${stop.stop_order}`}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Columns: Day-wise Scheduled Itinerary */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {currentStop?.city?.name || 'Destination'} Daily Itinerary
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {currentStop?.start_date} → {currentStop?.end_date}
                      </p>
                    </div>

                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      {itineraryItems.length} Activities Scheduled
                    </span>
                  </div>

                  {itineraryItems.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                      No activities scheduled for this stop. Select an activity from the offline catalog on the right to add it.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {itineraryItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start justify-between hover:border-slate-300 transition"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                                {item.scheduled_date}
                              </span>
                              {item.start_time && (
                                <span className="text-xs font-medium text-slate-500 flex items-center space-x-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{item.start_time.slice(0, 5)}</span>
                                </span>
                              )}
                            </div>

                            <h4 className="font-bold text-sm text-slate-900 pt-1">
                              {item.activity ? item.activity.name : 'Scheduled Activity'}
                            </h4>

                            {item.activity && item.activity.description && (
                              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                {item.activity.description}
                              </p>
                            )}

                            {item.notes && (
                              <p className="text-xs text-slate-700 italic bg-white p-2 rounded-xl border border-slate-100 mt-2">
                                Note: {item.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col items-end space-y-2">
                            {item.estimated_cost && (
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                ₹ {parseFloat(item.estimated_cost).toLocaleString()}
                              </span>
                            )}
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                              title="Remove Activity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Offline Activity Catalog & Scheduling */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-sm text-slate-900 mb-1">
                    🎯 Offline Activity Catalog
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Explore 2,432 activities stored locally in PostgreSQL for {currentStop?.city?.name}.
                  </p>

                  <div className="space-y-3 mb-4">
                    <input
                      type="text"
                      placeholder="Search activity name..."
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <select
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">All Categories</option>
                      <option value="sightseeing">Sightseeing</option>
                      <option value="food">Food & Dining</option>
                      <option value="cultural">Historical & Cultural</option>
                      <option value="museum">Museums & Art</option>
                      <option value="adventure">Adventure & Nature</option>
                    </select>
                  </div>

                  {searchLoading ? (
                    <div className="p-4 text-xs text-slate-500 flex items-center justify-center space-x-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      <span>Loading activities...</span>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                      No activities found matching criteria.
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
                      {searchResults.map((act) => (
                        <div
                          key={act.id}
                          onClick={() => {
                            setSelectedActivity(act);
                            setScheduledDate(currentStop?.start_date || '');
                          }}
                          className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between ${
                            selectedActivity?.id === act.id
                              ? 'bg-blue-50 border border-blue-200'
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div>
                            <h5 className="font-bold text-xs text-slate-900">{act.name}</h5>
                            <span className="text-[10px] text-slate-500 capitalize">{act.activity_type} • ₹{parseFloat(act.estimated_cost).toLocaleString()}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add to Day Form */}
                  {selectedActivity && (
                    <div className="mt-4 bg-blue-50/70 p-4 rounded-2xl border border-blue-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-blue-900 line-clamp-1">
                          Schedule: {selectedActivity.name}
                        </span>
                        <button onClick={() => setSelectedActivity(null)} className="text-xs text-red-600">
                          Cancel
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1">Scheduled Date *</label>
                        <input
                          type="date"
                          required
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-700 mb-1">Start Time</label>
                          <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full px-2 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-700 mb-1">End Time</label>
                          <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full px-2 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Activity note..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none"
                      />

                      <button
                        onClick={handleAddItineraryItem}
                        disabled={addingItem}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 rounded-xl transition shadow flex items-center justify-center space-x-1.5"
                      >
                        {addingItem && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Add Activity to Day</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
