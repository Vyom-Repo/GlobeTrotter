import React, { useState } from 'react';
import {
  Plus, Search, Calendar, MapPin, MoreVertical, Copy, Trash2, Eye, Edit2, CheckCircle2, Clock, Sparkles
} from 'lucide-react';
import { Button } from './ui/Button';
import { ConfirmModal } from './ui/ConfirmModal';

export const Screen06_MyTrips = ({
  trips = [],
  onPlanNewTrip,
  onViewTrip,
  onEditTrip,
  onDuplicateTrip,
  onDeleteTrip
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState('All'); // 'All' | 'Ongoing' | 'Upcoming' | 'Completed'
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'budget' | 'name'
  
  const [deleteTripId, setDeleteTripId] = useState(null);
  const [activeMenuTripId, setActiveMenuTripId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filter trips by search query and active tab
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = 
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.destinations || []).some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeStatusTab === 'All') return true;
    return trip.status === activeStatusTab.toLowerCase();
  });

  // Sort trips
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'budget') return (b.targetBudget || 0) - (a.targetBudget || 0);
    return new Date(a.startDate || 0) - new Date(b.startDate || 0);
  });

  // Categorized groups when tab is 'All'
  const ongoingTrips = sortedTrips.filter(t => t.status === 'ongoing');
  const upcomingTrips = sortedTrips.filter(t => t.status === 'upcoming');
  const completedTrips = sortedTrips.filter(t => t.status === 'completed');

  const counts = {
    All: trips.length,
    Ongoing: trips.filter(t => t.status === 'ongoing').length,
    Upcoming: trips.filter(t => t.status === 'upcoming').length,
    Completed: trips.filter(t => t.status === 'completed').length,
  };

  const handleConfirmDelete = () => {
    if (!deleteTripId) return;
    const target = trips.find(t => t.id === deleteTripId);
    onDeleteTrip(deleteTripId);
    setDeleteTripId(null);
    showToast(`Trip "${target?.name || ''}" deleted.`);
  };

  const handleDuplicate = (trip) => {
    onDuplicateTrip(trip);
    setActiveMenuTripId(null);
    showToast(`Trip "${trip.name}" duplicated — find it under Upcoming.`);
  };

  return (
    <div className="min-h-screen bg-surface-canvas pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 animate-fade-in-up flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 bg-accent-50 px-2.5 py-1 rounded-sm border border-accent-200">
              Screen 06 · Trip Listing
            </span>
            <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink-900 mt-2">
              My Trips
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-sans mt-1">
              Every journey, past and upcoming, in one place.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={onPlanNewTrip}
            icon={Plus}
            className="self-start sm:self-auto shrink-0 cursor-pointer"
          >
            Plan a Trip
          </Button>
        </div>

        {/* Search & Control Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-accent-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your trips by name or destination..."
              className="w-full bg-slate-50 text-ink-900 text-sm pl-10 pr-4 py-2 rounded-md border border-slate-200 outline-none focus:border-accent-400 focus:bg-white focus:ring-2 focus:ring-accent-400/20 font-sans placeholder:text-slate-400"
            />
          </div>

          {/* Segmented Status Tabs & Sort */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 border border-slate-200">
              {['All', 'Ongoing', 'Upcoming', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveStatusTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeStatusTab === tab
                      ? 'bg-white text-accent-800 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab} <span className="opacity-60 text-[10px]">({counts[tab]})</span>
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 outline-none cursor-pointer hover:border-slate-300"
            >
              <option value="date">Sort: Soonest Date</option>
              <option value="budget">Sort: High Budget</option>
              <option value="name">Sort: Name A-Z</option>
            </select>
          </div>
        </div>

        {/* TRIP SECTIONS & BENTO GRID */}
        {sortedTrips.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
            <Sparkles className="w-12 h-12 text-accent-300 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-xl text-ink-900 mb-1">
              {searchQuery ? `No trips match "${searchQuery}"` : "No trips found"}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              {searchQuery
                ? "Try adjusting your search query or status filter."
                : "Your travel journal is empty. Start planning your first journey!"}
            </p>
            {searchQuery ? (
              <Button variant="secondary" size="sm" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            ) : (
              <Button variant="primary" onClick={onPlanNewTrip} icon={Plus}>
                Plan Your First Trip
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* SECTION 1: ONGOING TRIPS (Featured 2x Bento Card) */}
            {(activeStatusTab === 'All' || activeStatusTab === 'Ongoing') && ongoingTrips.length > 0 && (
              <div>
                <h2 className="font-display font-semibold text-xl text-ink-900 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-400 animate-pulse" />
                  Ongoing Trip ({ongoingTrips.length})
                </h2>

                <div className="space-y-4">
                  {ongoingTrips.map((trip) => {
                    const totalCost = (trip.stops || []).reduce((acc, s) => {
                      const actSum = (s.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
                      return acc + Math.max(Number(s.budget) || 0, actSum);
                    }, 0);

                    const targetBudget = trip.targetBudget || 62000;
                    const percent = Math.min(Math.round((totalCost / targetBudget) * 100), 100);

                    return (
                      <div
                        key={trip.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch group"
                      >
                        {/* Cover Image */}
                        <div className="lg:col-span-5 relative h-56 lg:h-full bg-slate-100 min-h-[220px]">
                          <img
                            src={trip.coverUrl || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'}
                            alt={trip.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                          <span className="absolute top-3 left-3 bg-accent-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            Ongoing Trip
                          </span>
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-display font-semibold text-xl text-ink-900">
                                {trip.name}
                              </h3>
                              
                              {/* Action Menu */}
                              <div className="relative">
                                <button
                                  onClick={() => setActiveMenuTripId(activeMenuTripId === trip.id ? null : trip.id)}
                                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {activeMenuTripId === trip.id && (
                                  <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 shadow-popover rounded-lg p-1 z-30 animate-fade-in-up">
                                    <button
                                      onClick={() => handleDuplicate(trip)}
                                      className="w-full px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded flex items-center gap-2 cursor-pointer"
                                    >
                                      <Copy className="w-3.5 h-3.5" /> Duplicate
                                    </button>
                                    <button
                                      onClick={() => { setDeleteTripId(trip.id); setActiveMenuTripId(null); }}
                                      className="w-full px-3 py-1.5 text-left text-xs font-semibold text-semantic-danger hover:bg-red-50 rounded flex items-center gap-2 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-slate-500 font-sans mt-1 line-clamp-2">
                              {trip.description || 'Exploring ancient temples, cultural landmarks, and local cuisine.'}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-3">
                              <span className="flex items-center gap-1 font-semibold">
                                <MapPin className="w-3.5 h-3.5 text-accent-400" />
                                {(trip.destinations || []).join(', ')}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {trip.startDate} → {trip.endDate}
                              </span>
                            </div>
                          </div>

                          {/* Budget Rail */}
                          <div className="pt-3 border-t border-slate-100">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500 font-medium">Budget Tracked</span>
                              <span className="font-semibold tabular-nums text-slate-700">
                                ₹{totalCost.toLocaleString('en-IN')} / ₹{targetBudget.toLocaleString('en-IN')} ({percent}%)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full bg-accent-400 rounded-full" style={{ width: `${percent}%` }} />
                            </div>
                          </div>

                          {/* CTAs */}
                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              size="sm"
                              variant="primary"
                              icon={Eye}
                              onClick={() => onViewTrip(trip)}
                            >
                              View Journal
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              icon={Edit2}
                              onClick={() => onEditTrip(trip)}
                            >
                              Edit Trip
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 2: UPCOMING TRIPS (3-up Bento Grid) */}
            {(activeStatusTab === 'All' || activeStatusTab === 'Upcoming') && upcomingTrips.length > 0 && (
              <div>
                <h2 className="font-display font-semibold text-xl text-ink-900 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Upcoming Trips ({upcomingTrips.length})
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingTrips.map((trip) => {
                    const totalCost = (trip.stops || []).reduce((acc, s) => {
                      const actSum = (s.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
                      return acc + Math.max(Number(s.budget) || 0, actSum);
                    }, 0);

                    return (
                      <div
                        key={trip.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                      >
                        <div>
                          <div className="h-40 w-full relative overflow-hidden bg-slate-100">
                            <img
                              src={trip.coverUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80'}
                              alt={trip.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                            <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Upcoming
                            </span>
                          </div>

                          <div className="p-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-display font-semibold text-base text-ink-900 leading-snug">
                                {trip.name}
                              </h3>

                              <div className="relative">
                                <button
                                  onClick={() => setActiveMenuTripId(activeMenuTripId === trip.id ? null : trip.id)}
                                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {activeMenuTripId === trip.id && (
                                  <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 shadow-popover rounded-lg p-1 z-30 animate-fade-in-up">
                                    <button
                                      onClick={() => handleDuplicate(trip)}
                                      className="w-full px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded flex items-center gap-2 cursor-pointer"
                                    >
                                      <Copy className="w-3.5 h-3.5" /> Duplicate
                                    </button>
                                    <button
                                      onClick={() => { setDeleteTripId(trip.id); setActiveMenuTripId(null); }}
                                      className="w-full px-3 py-1.5 text-left text-xs font-semibold text-semantic-danger hover:bg-red-50 rounded flex items-center gap-2 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-xs text-slate-500 space-y-1">
                              <div className="flex items-center gap-1 font-semibold text-slate-700">
                                <MapPin className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                                {(trip.destinations || []).join(', ')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {trip.startDate} → {trip.endDate}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700 tabular-nums">
                            Est. ₹{totalCost.toLocaleString('en-IN')}
                          </span>
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => onEditTrip(trip)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => onViewTrip(trip)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 3: COMPLETED TRIPS */}
            {(activeStatusTab === 'All' || activeStatusTab === 'Completed') && completedTrips.length > 0 && (
              <div>
                <h2 className="font-display font-semibold text-xl text-ink-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Completed Trips ({completedTrips.length})
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedTrips.map((trip) => {
                    const totalCost = (trip.stops || []).reduce((acc, s) => {
                      const actSum = (s.activities || []).reduce((a, b) => a + (Number(b.cost) || 0), 0);
                      return acc + Math.max(Number(s.budget) || 0, actSum);
                    }, 0);

                    return (
                      <div
                        key={trip.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                      >
                        <div>
                          <div className="h-36 w-full relative overflow-hidden bg-slate-100">
                            <img
                              src={trip.coverUrl || 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80'}
                              alt={trip.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                            <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </span>
                          </div>

                          <div className="p-4 space-y-1.5">
                            <h3 className="font-display font-semibold text-base text-ink-900">
                              {trip.name}
                            </h3>
                            <div className="text-xs text-slate-500">
                              📍 {(trip.destinations || []).join(', ')} · 📅 {trip.startDate}
                            </div>
                          </div>
                        </div>

                        <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 tabular-nums">
                            Total Spent: ₹{totalCost.toLocaleString('en-IN')}
                          </span>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => onViewTrip(trip)}
                          >
                            View Journal
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTripId)}
        title="Delete this trip?"
        message="This will permanently delete the trip, its itinerary stops, and all activity items."
        confirmLabel="Delete Trip"
        cancelLabel="Keep Trip"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTripId(null)}
      />
    </div>
  );
};
