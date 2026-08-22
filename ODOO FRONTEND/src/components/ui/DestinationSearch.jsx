import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, X, Check } from 'lucide-react';
import { Label } from './Input';

const POPULAR_DESTINATIONS = [
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', costEst: '₹45,000', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', costEst: '₹55,000', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80' },
  { id: 'paris', name: 'Paris', country: 'France', costEst: '₹85,000', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
  { id: 'rome', name: 'Rome', country: 'Italy', costEst: '₹75,000', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
  { id: 'bali', name: 'Bali', country: 'Indonesia', costEst: '₹35,000', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80' },
  { id: 'swiss', name: 'Zurich & Swiss Alps', country: 'Switzerland', costEst: '₹1,20,000', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80' },
  { id: 'newyork', name: 'New York', country: 'United States', costEst: '₹1,10,000', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80' },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', costEst: '₹65,000', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80' }
];

export const DestinationSearch = ({
  selectedDestinations = [], // string[] (names)
  onAddDestination,
  onRemoveDestination,
  label = "Destinations",
  required = false
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = POPULAR_DESTINATIONS.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.country.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (destName) => {
    if (!selectedDestinations.includes(destName)) {
      onAddDestination(destName);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      handleSelect(query.trim());
    }
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <Label required={required}>{label}</Label>
      
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4 text-accent-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search cities or regions (e.g. Kyoto, Tokyo, Paris)..."
          className="
            w-full bg-white text-ink-900 text-sm leading-relaxed rounded-md pl-10 pr-4 py-2.5 min-h-[42px]
            border border-slate-300 shadow-sm transition-all duration-150 outline-none
            hover:border-slate-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20
            placeholder:font-sans placeholder:text-slate-400
          "
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-slate-200 shadow-popover rounded-xl overflow-hidden max-h-[280px] overflow-y-auto animate-fade-in-up">
          {filtered.length > 0 ? (
            <div className="py-1">
              <div className="px-3.5 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                Popular Destinations
              </div>
              {filtered.map((dest) => {
                const isSelected = selectedDestinations.includes(dest.name);
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => handleSelect(dest.name)}
                    className={`
                      w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer
                      ${isSelected ? 'bg-accent-50 text-accent-800' : 'hover:bg-slate-50 text-ink-900'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm border border-slate-200">
                        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-1.5">
                          <span>{dest.name}</span>
                          <span className="text-xs text-slate-500 font-normal">· {dest.country}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">Est. {dest.costEst} / person</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-accent-400 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-slate-500">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-accent-300 opacity-80" />
              <p className="text-sm font-medium">No places match — press Enter to add "{query}"</p>
            </div>
          )}
        </div>
      )}

      {/* Selected Pill Chips */}
      {selectedDestinations.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedDestinations.map((destName) => (
            <span
              key={destName}
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                bg-accent-50 text-accent-800 border border-accent-200 shadow-sm animate-fade-in-up
              "
            >
              <MapPin className="w-3.5 h-3.5 text-accent-600" />
              <span>{destName}</span>
              <button
                type="button"
                onClick={() => onRemoveDestination(destName)}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-accent-200 text-accent-800 transition-colors ml-0.5 cursor-pointer"
                title={`Remove ${destName}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
