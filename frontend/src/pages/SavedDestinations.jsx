import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import savedDestinationService from '../services/savedDestinationService';
import { Bookmark, Search, Trash2, MapPin, Globe, Compass, Loader2 } from 'lucide-react';

export default function SavedDestinations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    loadSavedItems();
  }, [filterType]);

  const loadSavedItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType !== 'all') params.entity_type = filterType;
      if (searchTerm) params.search = searchTerm;
      const res = await savedDestinationService.listSavedDestinations(params);
      setItems(res.data || []);
    } catch (err) {
      console.error('Failed to fetch saved destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadSavedItems();
  };

  const handleRemove = async (savedId) => {
    setRemovingId(savedId);
    try {
      await savedDestinationService.removeSavedDestination(savedId);
      setItems(prev => prev.filter(i => i.id !== savedId));
    } catch (err) {
      console.error('Failed to remove saved destination:', err);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Bookmark className="w-7 h-7 text-blue-600 fill-blue-600" />
              <span>Saved Destinations & Favorites</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Access your bookmarked countries, cities, and activities in one place.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search saved items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition w-64"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
            >
              Search
            </button>
          </form>
        </div>

        {/* Entity Type Filter Tabs */}
        <div className="flex items-center space-x-2 mb-6 border-b border-slate-200 pb-3">
          {[
            { id: 'all', label: 'All Saved' },
            { id: 'country', label: 'Countries' },
            { id: 'city', label: 'Cities' },
            { id: 'activity', label: 'Activities' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                filterType === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Saved Items Grid */}
        {loading ? (
          <div className="py-20 flex justify-center items-center text-slate-400 space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm font-medium">Loading saved destinations...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No saved items found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Explore cities and activities across GlobeTrotter and bookmark them to view them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                        item.entity_type === 'country'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.entity_type === 'city'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {item.entity_type}
                    </span>

                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={removingId === item.id}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                      title="Remove Bookmark"
                    >
                      {removingId === item.id ? <Loader2 className="w-4 h-4 animate-spin text-red-600" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center space-x-1.5">
                    {item.entity_type === 'country' && <Globe className="w-4 h-4 text-emerald-600" />}
                    {item.entity_type === 'city' && <MapPin className="w-4 h-4 text-blue-600" />}
                    {item.entity_type === 'activity' && <Compass className="w-4 h-4 text-purple-600" />}
                    <span>{item.name}</span>
                  </h3>

                  {item.country && (
                    <p className="text-xs text-slate-500 font-medium mb-3">
                      {item.country}
                    </p>
                  )}

                  {item.details && (
                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1 mt-3 border border-slate-100">
                      {Object.entries(item.details).map(([k, v]) => (
                        v !== null && (
                          <div key={k} className="flex justify-between">
                            <span className="capitalize text-slate-400 font-medium">{k.replace('_', ' ')}:</span>
                            <span className="font-semibold text-slate-800">{v}</span>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Saved on {new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
