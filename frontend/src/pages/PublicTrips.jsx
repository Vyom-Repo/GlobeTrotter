import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import sharingService from '../services/sharingService';
import { apiRequest } from '../services/api';
import { Search, Globe, Calendar, MapPin, ArrowRight, Loader2, Filter, Compass } from 'lucide-react';

export default function PublicTrips() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 });

  const [search, setSearch] = useState('');
  const [countryId, setCountryId] = useState('');
  const [cityId, setCityId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    fetchPublicTrips(1);
  }, [search, countryId, cityId]);

  const loadFilters = async () => {
    try {
      const countriesRes = await apiRequest('/api/v1/countries?page=1&page_size=200');
      if (countriesRes && countriesRes.data) setCountries(countriesRes.data);

      const citiesRes = await apiRequest('/api/v1/cities?page=1&page_size=200');
      if (citiesRes && citiesRes.data) setCities(citiesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPublicTrips = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await sharingService.getPublicTrips({
        search,
        countryId: countryId || undefined,
        cityId: cityId || undefined,
        page,
        pageSize: 12,
      });

      if (res && res.data) {
        setTrips(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load public trips');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchPublicTrips(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-8 text-white shadow-xl mb-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Social Travel Discovery</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Explore Community Itineraries
            </h1>
            <p className="text-blue-100 text-sm mt-2 leading-relaxed">
              Discover public travel itineraries created by global travelers. Browse destination stops, day-by-day plans, and activity recommendations offline.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search trip title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Country Selector */}
            <div>
              <select
                value={countryId}
                onChange={(e) => {
                  setCountryId(e.target.value);
                  setCityId('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">All Countries</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.iso_code})
                  </option>
                ))}
              </select>
            </div>

            {/* City Selector */}
            <div>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading / Error states */}
        {loading ? (
          <div className="p-16 text-center text-slate-500 flex items-center justify-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span>Discovering public itineraries...</span>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-3xl text-sm">
            {error}
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center">
            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No public trips found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No public itineraries match your search parameters. Try clearing your filters or search term.
            </p>
          </div>
        ) : (
          <>
            {/* Public Trips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Globe className="w-3 h-3" />
                        <span>Public Itinerary</span>
                      </span>
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
                        <div className="text-slate-500">
                          Budget: <span className="font-bold text-slate-800">{trip.currency} {parseFloat(trip.budget_limit).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Community Shared
                    </span>
                    <button
                      onClick={() => navigate(`/public-trips/${trip.id}`)}
                      className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-xl transition shadow-sm"
                    >
                      <span>View Itinerary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-4">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="px-4 py-2 bg-white border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition"
                >
                  Previous
                </button>
                <span className="text-xs font-bold text-slate-600 px-3">
                  Page {pagination.page} of {pagination.total_pages}
                </span>
                <button
                  disabled={pagination.page >= pagination.total_pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  className="px-4 py-2 bg-white border border-slate-200 text-xs font-semibold rounded-xl text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
