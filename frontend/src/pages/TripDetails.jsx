import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import tripService from '../services/tripService';
import { Search, MapPin, Calendar, Plus, Trash2, ArrowRight, ArrowLeft, Loader2, AlertCircle, MoveUp, MoveDown, Check, Globe, Lock } from 'lucide-react';

export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const isNew = !tripId || tripId === 'new';

  // Trip form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [visibility, setVisibility] = useState('private');

  // Active saved trip data & stops
  const [savedTrip, setSavedTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Offline City Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  // New Stop form state
  const [stopStartDate, setStopStartDate] = useState('');
  const [stopEndDate, setStopEndDate] = useState('');
  const [stopNotes, setStopNotes] = useState('');
  const [addingStop, setAddingStop] = useState(false);

  useEffect(() => {
    if (!isNew && tripId) {
      loadTripData();
    }
  }, [tripId]);

  const loadTripData = async () => {
    try {
      setLoading(true);
      setError('');
      const tripData = await tripService.getTrip(tripId);
      setSavedTrip(tripData);
      setName(tripData.name || '');
      setDescription(tripData.description || '');
      setStartDate(tripData.start_date || '');
      setEndDate(tripData.end_date || '');
      setBudgetLimit(tripData.budget_limit || '');
      setCurrency(tripData.currency || 'USD');
      setVisibility(tripData.visibility || 'private');
      if (tripData.stops) {
        setStops(tripData.stops);
      } else {
        fetchStops();
      }
    } catch (err) {
      setError(err.message || 'Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const fetchStops = async () => {
    try {
      const res = await tripService.getStops(tripId);
      if (res && res.data) {
        setStops(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Search Offline Cities
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 1) {
        try {
          setSearchLoading(true);
          const res = await tripService.searchCities(searchQuery.trim());
          if (res && res.data) {
            setSearchResults(res.data);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Trip Create or Update
  const handleSaveTrip = async (e) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      setError('Please fill in required fields: Name, Start Date, End Date');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before start date');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccessMsg('');
      const payload = {
        name,
        description,
        start_date: startDate,
        end_date: endDate,
        budget_limit: budgetLimit ? parseFloat(budgetLimit) : null,
        currency,
        visibility,
      };

      if (isNew) {
        const newTrip = await tripService.createTrip(payload);
        setSuccessMsg('Trip created! You can now add destination stops.');
        navigate(`/trips/${newTrip.id}`, { replace: true });
      } else {
        const updated = await tripService.updateTrip(tripId, payload);
        setSavedTrip(updated);
        setSuccessMsg('Trip details saved successfully.');
      }
    } catch (err) {
      setError(err.message || 'Failed to save trip');
    } finally {
      setSaving(false);
    }
  };

  // Add Stop
  const handleAddStop = async () => {
    if (!selectedCity) return;
    if (!stopStartDate || !stopEndDate) {
      setError('Please specify start and end dates for the destination stop.');
      return;
    }

    try {
      setAddingStop(true);
      setError('');
      const nextOrder = stops.length + 1;
      await tripService.addStop({
        trip_id: tripId,
        city_id: selectedCity.id,
        start_date: stopStartDate,
        end_date: stopEndDate,
        stop_order: nextOrder,
        notes: stopNotes,
      });

      setSelectedCity(null);
      setSearchQuery('');
      setStopStartDate('');
      setStopEndDate('');
      setStopNotes('');
      fetchStops();
    } catch (err) {
      setError(err.message || 'Failed to add destination stop');
    } finally {
      setAddingStop(false);
    }
  };

  // Delete Stop
  const handleDeleteStop = async (stopId) => {
    try {
      await tripService.deleteStop(stopId);
      fetchStops();
    } catch (err) {
      setError(err.message || 'Failed to delete stop');
    }
  };

  // Move Stop Up/Down
  const handleMoveStop = async (index, direction) => {
    const newStops = [...stops];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newStops.length) return;

    // Swap
    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    const reorderPayload = newStops.map((s, idx) => ({
      stop_id: s.id,
      stop_order: idx + 1,
    }));

    try {
      setStops(newStops);
      await tripService.reorderStops(tripId, reorderPayload);
      fetchStops();
    } catch (err) {
      setError(err.message || 'Failed to reorder stops');
      fetchStops();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-12 text-center text-slate-500 flex items-center justify-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading trip details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Trips</span>
        </button>

        {/* Notifications */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl flex items-center space-x-3 text-sm">
            <Check className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Trip Details Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {isNew ? 'New Journey Details' : 'Trip Settings'}
            </h2>

            <form onSubmit={handleSaveTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trip Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto & Tokyo Autumn Escapade"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief travel notes or objective..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Budget Limit</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Visibility</label>
                <div className="flex items-center space-x-3 text-xs">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={visibility === 'private'}
                      onChange={() => setVisibility('private')}
                    />
                    <span>Private</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={visibility === 'public'}
                      onChange={() => setVisibility('public')}
                    />
                    <span>Public</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 rounded-xl transition shadow flex items-center justify-center space-x-2"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isNew ? 'Create & Continue' : 'Save Settings'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Destination Stop Management */}
          <div className="lg:col-span-2 space-y-6">
            {!isNew && (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-4 rounded-3xl text-blue-900">
                <div>
                  <h3 className="font-bold text-sm">Build Daily Itinerary</h3>
                  <p className="text-xs text-blue-700 mt-0.5">Schedule day-wise tourist activities for your destination stops.</p>
                </div>
                <button
                  onClick={() => navigate(`/trips/${tripId}/itinerary`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow flex items-center space-x-1.5"
                >
                  <span>Open Itinerary Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Destination Stops</h2>
              <p className="text-slate-500 text-xs mb-6">Search our offline dataset of 608 cities to add destination stops to your trip.</p>

              {/* Offline City Search Box */}
              {!isNew && (
                <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    🔍 Search Offline Cities
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type city name (e.g. Paris, Tokyo, Kyoto, New York)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>

                  {/* Search dropdown results */}
                  {searchLoading && (
                    <div className="p-3 text-xs text-slate-500 flex items-center space-x-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      <span>Searching local database...</span>
                    </div>
                  )}

                  {searchResults.length > 0 && !selectedCity && (
                    <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {searchResults.map((city) => (
                        <div
                          key={city.id}
                          onClick={() => {
                            setSelectedCity(city);
                            setSearchQuery(city.name);
                            setSearchResults([]);
                          }}
                          className="p-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition"
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-900">{city.name}</span>
                            <span className="text-xs text-slate-500 pl-2">({city.region})</span>
                          </div>
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            Select
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Selected City Form */}
                  {selectedCity && (
                    <div className="mt-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-blue-900">
                          Selected: {selectedCity.name}
                        </span>
                        <button
                          onClick={() => setSelectedCity(null)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Change City
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Stop Start Date</label>
                          <input
                            type="date"
                            value={stopStartDate}
                            onChange={(e) => setStopStartDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Stop End Date</label>
                          <input
                            type="date"
                            value={stopEndDate}
                            onChange={(e) => setStopEndDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Stop notes (e.g. Stay near Shinjuku)..."
                        value={stopNotes}
                        onChange={(e) => setStopNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                      />

                      <button
                        onClick={handleAddStop}
                        disabled={addingStop}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl transition shadow flex items-center justify-center space-x-1.5"
                      >
                        {addingStop && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Add Stop to Itinerary</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Stop List */}
              {stops.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                  {isNew ? 'Save trip settings first to add destination stops.' : 'No destination stops added yet. Use the search box above to add cities.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {stops.map((stop, index) => (
                    <div
                      key={stop.id}
                      className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-slate-300 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-7 h-7 bg-blue-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
                          {stop.stop_order}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">
                            {stop.city ? stop.city.name : `Destination Stop #${stop.stop_order}`}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {stop.start_date} → {stop.end_date}
                          </p>
                          {stop.notes && <p className="text-xs text-slate-600 italic mt-1">{stop.notes}</p>}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveStop(index, -1)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-200 transition"
                          title="Move Up"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={index === stops.length - 1}
                          onClick={() => handleMoveStop(index, 1)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-200 transition"
                          title="Move Down"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStop(stop.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Delete Stop"
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
        </div>
      </main>
    </div>
  );
}
