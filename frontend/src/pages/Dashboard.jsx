import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import tripService from '../services/tripService';
import { MapPin, Calendar, Plus, Trash2, Edit3, ArrowRight, Compass, DollarSign, Globe, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, total_pages: 1 });

  // Delete modal state
  const [deleteTripId, setDeleteTripId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTrips = async (currentPage = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await tripService.getTrips(currentPage, 9);
      if (response && response.data) {
        setTrips(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setTrips([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips(page);
  }, [page]);

  const handleDeleteTrip = async () => {
    if (!deleteTripId) return;
    try {
      setIsDeleting(true);
      await tripService.deleteTrip(deleteTripId);
      setDeleteTripId(null);
      fetchTrips(page);
    } catch (err) {
      alert(err.message || 'Failed to delete trip');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      <Navbar onCreateTripClick={() => navigate('/trips/new')} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-3">
              Where to next? ✈️
            </h1>
            <p className="text-blue-100 text-base sm:text-lg mb-6 leading-relaxed">
              Design multi-city itineraries, manage your travel budget, and discover activities across 149 countries — 100% offline.
            </p>
            <button
              onClick={() => navigate('/trips/new')}
              className="inline-flex items-center space-x-2 bg-white text-blue-700 hover:bg-blue-50 font-semibold px-5 py-3 rounded-2xl transition shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Journey</span>
            </button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
            <Compass className="w-96 h-96" />
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">My Travel Journeys</h2>
            <p className="text-slate-500 text-sm mt-1">Manage your planned itineraries and travel destinations</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse h-64 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-6 bg-slate-200 rounded-xl w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
                </div>
                <div className="h-10 bg-slate-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 border border-slate-200 border-dashed text-center max-w-lg mx-auto my-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No trips created yet</h3>
            <p className="text-slate-500 text-sm mb-6">
              Start building your first offline trip by selecting destination cities and scheduling activities.
            </p>
            <button
              onClick={() => navigate('/trips/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition shadow"
            >
              Start Planning
            </button>
          </div>
        ) : (
          /* Trip Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  {/* Visibility badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      trip.visibility === 'public'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {trip.visibility === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      <span className="capitalize">{trip.visibility}</span>
                    </span>
                    <button
                      onClick={() => setDeleteTripId(trip.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                    {trip.name}
                  </h3>

                  {trip.description && (
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {trip.description}
                    </p>
                  )}

                  <div className="space-y-2 text-xs font-medium text-slate-600 mt-4 border-t border-slate-100 pt-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{trip.start_date} → {trip.end_date}</span>
                    </div>
                    {trip.budget_limit && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <span>Budget Limit: {trip.currency} {parseFloat(trip.budget_limit).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate(`/trips/${trip.id}`)}
                      className="text-xs font-semibold text-slate-700 hover:text-blue-600 transition flex items-center space-x-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Destinations</span>
                    </button>
                    <button
                      onClick={() => navigate(`/trips/${trip.id}/budget`)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition flex items-center space-x-1"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Budget</span>
                    </button>
                  </div>

                  <button
                    onClick={() => navigate(`/trips/${trip.id}/itinerary`)}
                    className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition shadow-sm"
                  >
                    <span>Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-10">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-white transition"
            >
              Previous
            </button>
            <span className="text-xs font-medium text-slate-500">
              Page {page} of {pagination.total_pages}
            </span>
            <button
              disabled={page >= pagination.total_pages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-white transition"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteTripId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Trip?</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete this trip? All destination stops and scheduled itinerary activities will be permanently removed.
            </p>
            <div className="flex items-center space-x-3 justify-end">
              <button
                onClick={() => setDeleteTripId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteTrip}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition flex items-center space-x-2"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Trip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
