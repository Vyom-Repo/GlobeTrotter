import React, { useState } from 'react';
import {
  Search, SlidersHorizontal, MapPin, Star, Plus, Check, Filter, ArrowUpDown, Grid, List, Sparkles, X, Compass, Clock, DollarSign
} from 'lucide-react';
import { Button } from './ui/Button';

const MOCK_RESULTS = [
  {
    id: 'res-1',
    title: 'Fushimi Inari Shrine Hike & Torii Gates',
    type: 'Sightseeing',
    duration: 'Half-day',
    cost: 1500,
    rating: 4.9,
    reviews: 428,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    city: 'Kyoto'
  },
  {
    id: 'res-2',
    title: 'Arashiyama Bamboo Grove & Monkey Park Walk',
    type: 'Nature & Adventure',
    duration: '2-3 hrs',
    cost: 800,
    rating: 4.7,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    city: 'Kyoto'
  },
  {
    id: 'res-3',
    title: 'Solang Valley Tandem Paragliding Experience',
    type: 'Adventure',
    duration: '2 hrs',
    cost: 3500,
    rating: 4.8,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
    city: 'Manali'
  },
  {
    id: 'res-4',
    title: 'Traditional Gion Tea Ceremony & Kimono Rental',
    type: 'Culture',
    duration: 'Half-day',
    cost: 6000,
    rating: 4.9,
    reviews: 512,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
    city: 'Kyoto'
  },
  {
    id: 'res-5',
    title: 'Mandovi River Sunset Cruise & Live Folk Dance',
    type: 'Nightlife & Culture',
    duration: '3 hrs',
    cost: 2000,
    rating: 4.6,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    city: 'Goa'
  },
  {
    id: 'res-6',
    title: 'Amer Fort Light & Sound Heritage Show',
    type: 'Culture & Sightseeing',
    duration: '2 hrs',
    cost: 1200,
    rating: 4.7,
    reviews: 198,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    city: 'Jaipur'
  }
];

export const Screen08_ActivitySearch = ({
  onAddActivityToTrip
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState('Paragliding');
  const [selectedType, setSelectedType] = useState('All');
  const [addedIds, setAddedIds] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  const filteredResults = MOCK_RESULTS.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChip = !activeChip || 
      item.title.toLowerCase().includes(activeChip.toLowerCase()) ||
      item.type.toLowerCase().includes(activeChip.toLowerCase()) ||
      item.city.toLowerCase().includes(activeChip.toLowerCase());

    const matchesType = selectedType === 'All' || item.type.includes(selectedType);

    return matchesSearch && matchesChip && matchesType;
  });

  const handleToggleAdd = (item) => {
    if (addedIds.includes(item.id)) {
      setAddedIds(addedIds.filter(id => id !== item.id));
    } else {
      setAddedIds([...addedIds, item.id]);
      if (onAddActivityToTrip) {
        onAddActivityToTrip(item);
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-canvas pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Page Header */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 bg-accent-50 px-2.5 py-1 rounded-sm border border-accent-200">
            Screen 08 · Activity & City Search
          </span>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink-900 mt-2">
            Explore Activities & Cities
          </h1>
          <p className="text-sm text-slate-600 font-sans mt-1">
            Search top-rated attractions, tours, and experiences to slot directly into your itinerary.
          </p>
        </div>

        {/* Active Query Chip & Search Control Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
          
          {/* Active Query Chip */}
          {activeChip && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Active Search:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-100 text-accent-800 border border-accent-200 hover:border-accent-400 hover:shadow-xs transition-all">
                <span>"{activeChip}"</span>
                <button
                  onClick={() => setActiveChip('')}
                  className="hover:bg-red-100 hover:text-semantic-danger rounded-full p-0.5 transition-colors cursor-pointer ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
          )}

          {/* Control Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-accent-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities by name, city, or category..."
                className="w-full bg-slate-50 text-ink-900 text-sm pl-10 pr-4 py-2 rounded-md border border-slate-200 outline-none hover:border-slate-300 focus:border-accent-400 focus:bg-white focus:ring-2 focus:ring-accent-400/20 font-sans transition-all"
              />
            </div>

            {/* Dropdown Pills */}
            <div className="flex items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-white text-slate-700 text-xs font-semibold px-3 py-2 rounded-full border border-slate-200 outline-none cursor-pointer hover:border-accent-300 hover:shadow-xs transition-all"
              >
                <option value="All">Type: All</option>
                <option value="Sightseeing">Sightseeing</option>
                <option value="Adventure">Adventure</option>
                <option value="Culture">Culture</option>
                <option value="Nightlife">Nightlife</option>
              </select>

              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:border-accent-300 hover:bg-accent-50/50 hover:text-accent-800 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-accent-400" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS HEADER & VIEW TOGGLE */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">
            Found <span className="text-ink-900 font-bold">{filteredResults.length}</span> experiences
          </span>

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded cursor-pointer transition-all ${viewMode === 'list' ? 'bg-accent-50 text-accent-700 font-bold border border-accent-200' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded cursor-pointer transition-all ${viewMode === 'grid' ? 'bg-accent-50 text-accent-700 font-bold border border-accent-200' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RESULTS LIST / GRID */}
        {filteredResults.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
            <Sparkles className="w-10 h-10 text-accent-300 mx-auto mb-2" />
            <h3 className="font-display font-semibold text-lg text-ink-900">
              Nothing matches your search
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try clearing your active query chip or search filters.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setSearchQuery(''); setActiveChip(''); setSelectedType('All'); }}
            >
              Clear All Search Filters
            </Button>
          </div>
        ) : viewMode === 'list' ? (
          /* LIST VIEW */
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
            {filteredResults.map((item) => {
              const isAdded = addedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-accent-50/30 transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail 64x64px */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <h3 className="font-display font-semibold text-base text-ink-900 group-hover:text-accent-600 transition-colors leading-snug">
                        {item.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-sans">
                        <span className="font-semibold text-accent-700 bg-accent-50 px-2 py-0.5 rounded border border-accent-200 group-hover:border-accent-300 transition-colors">
                          {item.type}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.city}
                        </span>
                        <span>·</span>
                        <span>{item.duration}</span>
                        <span>·</span>
                        <span className="font-bold text-slate-800 tabular-nums">₹{item.cost.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 text-xs text-amber-600 pt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-slate-800">{item.rating}</span>
                        <span className="text-slate-400">({item.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Add Button */}
                  <div className="self-end sm:self-center shrink-0">
                    <Button
                      size="sm"
                      variant={isAdded ? "secondary" : "primary"}
                      icon={isAdded ? Check : Plus}
                      onClick={() => handleToggleAdd(item)}
                      className={isAdded ? '!bg-emerald-50 !text-emerald-700 !border-emerald-200 font-bold' : ''}
                    >
                      {isAdded ? "Added ✓" : "Add +"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((item) => {
              const isAdded = addedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-accent-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="h-40 w-full relative overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
                        {item.type}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-display font-semibold text-base text-ink-900 leading-snug group-hover:text-accent-600 transition-colors">
                        {item.title}
                      </h3>

                      <div className="text-xs text-slate-500 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>📍 {item.city} · {item.duration}</span>
                          <span className="font-bold text-slate-800 tabular-nums">₹{item.cost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-slate-800">{item.rating}</span>
                          <span className="text-slate-400">({item.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-slate-100 flex justify-end">
                    <Button
                      size="sm"
                      variant={isAdded ? "secondary" : "primary"}
                      icon={isAdded ? Check : Plus}
                      onClick={() => handleToggleAdd(item)}
                      className={isAdded ? '!bg-emerald-50 !text-emerald-700 !border-emerald-200 font-bold' : ''}
                    >
                      {isAdded ? "Added ✓" : "Add +"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* FILTER MODAL */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsFilterModalOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" />
          <div className="relative bg-white border border-slate-200 shadow-popover rounded-xl max-w-md w-full p-6 z-10 animate-fade-in-up space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-semibold text-lg text-ink-900">Filter Experiences</h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md p-1 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Category Type</label>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {['Sightseeing', 'Food & Drink', 'Adventure', 'Culture', 'Nightlife'].map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      <input type="checkbox" defaultChecked className="rounded text-accent-400 cursor-pointer" />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Cost Range (₹ INR)</label>
                <div className="flex gap-2">
                  {['< ₹1,000', '₹1,000–₹5,000', '₹5,000+'].map((tier) => (
                    <button key={tier} className="flex-1 py-1.5 rounded-md border border-slate-200 text-xs font-semibold hover:border-accent-400 hover:bg-accent-50 hover:text-accent-800 transition-all cursor-pointer">
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setIsFilterModalOpen(false)}>Clear All</Button>
              <Button variant="primary" size="sm" onClick={() => setIsFilterModalOpen(false)}>Apply Filters</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
