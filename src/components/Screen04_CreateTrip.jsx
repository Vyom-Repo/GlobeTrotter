import React, { useState, useEffect } from 'react';
import { ArrowRight, Trash2, Sparkles, AlertCircle, Check } from 'lucide-react';
import { CoverPhotoUploader } from './ui/CoverPhotoUploader';
import { Input, Textarea } from './ui/Input';
import { DestinationSearch } from './ui/DestinationSearch';
import { DateRangePicker } from './ui/DateRangePicker';
import { StubCard } from './ui/StubCard';
import { Button } from './ui/Button';
import { ConfirmModal } from './ui/ConfirmModal';

const SUGGESTIONS = [
  { id: 's1', title: 'Fushimi Inari Shrine Tour', subtitle: 'Kyoto, Japan', cost: '¥4,500', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
  { id: 's2', title: 'Arashiyama Bamboo Grove Walk', subtitle: 'Kyoto, Japan', cost: '¥2,800', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
  { id: 's3', title: 'Traditional Tea Ceremony', subtitle: 'Gion, Kyoto', cost: '¥6,000', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80' },
  { id: 's4', title: 'teamLab Planets Digital Art', subtitle: 'Tokyo, Japan', cost: '¥3,800', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
  { id: 's5', title: 'Nijo Castle & Gardens', subtitle: 'Kyoto, Japan', cost: '¥1,500', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80' },
  { id: 's6', title: 'Kinkaku-ji Golden Pavilion', subtitle: 'Kyoto, Japan', cost: '¥1,200', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80' }
];

export const Screen04_CreateTrip = ({
  tripData,
  onUpdateTripData,
  onContinue,
  onReset
}) => {
  const [saveStatus, setSaveStatus] = useState('Draft saved 09:41');
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [addedSuggestions, setAddedSuggestions] = useState([]);
  const [dateError, setDateError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);

  // Debounced autosave effect
  useEffect(() => {
    setSaveStatus('Saving…');
    const timer = setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSaveStatus(`Draft saved ${timeStr}`);
    }, 800);
    return () => clearTimeout(timer);
  }, [tripData]);

  // Date range validation
  const handleDateChange = ({ startDate, endDate }) => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setDateError("End date can't be before the start date");
    } else {
      setDateError('');
    }
    onUpdateTripData({ startDate, endDate });
  };

  // Add/remove destination chip
  const handleAddDestination = (destName) => {
    if (!tripData.destinations.includes(destName)) {
      onUpdateTripData({
        destinations: [...tripData.destinations, destName]
      });
    }
  };

  const handleRemoveDestination = (destName) => {
    onUpdateTripData({
      destinations: tripData.destinations.filter(d => d !== destName)
    });
  };

  // Toggle suggestion stub card
  const handleToggleSuggestion = (item) => {
    if (addedSuggestions.includes(item.id)) {
      setAddedSuggestions(addedSuggestions.filter(id => id !== item.id));
    } else {
      setAddedSuggestions([...addedSuggestions, item.id]);
      // Also add an activity to Stop 01 or new stop
      if (tripData.stops.length > 0) {
        const updatedStops = [...tripData.stops];
        updatedStops[0].activities = [
          ...updatedStops[0].activities,
          { id: Date.now().toString(), name: item.title, cost: parseInt(item.cost.replace(/[^0-9]/g, '')) || 2500 }
        ];
        onUpdateTripData({ stops: updatedStops });
      }
    }
  };

  // Required validation check
  const isValid = Boolean(
    tripData.name && tripData.name.trim() &&
    tripData.destinations && tripData.destinations.length > 0 &&
    tripData.startDate && tripData.endDate &&
    !dateError
  );

  const showSuggestions = (tripData.destinations && tripData.destinations.length > 0) || tripData.startDate;

  return (
    <div className="min-h-screen bg-surface-canvas pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* A. Screen Header Block (§2.3 A) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 bg-accent-100 px-2.5 py-1 rounded-sm">
              Screen 04 · Step 1 of 2
            </span>
            <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink-900 mt-2">
              Plan a new trip
            </h1>
            <p className="text-sm sm:text-base text-ink-700 font-sans mt-1">
              Give it a name, a date range, and we'll help with the rest.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans text-ink-500 bg-surface-raised px-3 py-1.5 rounded-full border border-accent-200/50 shadow-sm self-start md:self-auto">
            <span className={`w-2 h-2 rounded-full ${saveStatus.includes('Saving') ? 'bg-semantic-warning animate-ping' : 'bg-semantic-success'}`} />
            <span>{saveStatus}</span>
          </div>
        </div>

        {/* Form & Cover Layout Grid (§2.2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* B. Cover Photo Uploader (Left Column on Desktop) */}
          <div className="lg:col-span-4">
            <CoverPhotoUploader
              coverUrl={tripData.coverUrl}
              onChangeCover={(url) => onUpdateTripData({ coverUrl: url })}
              onRemoveCover={() => onUpdateTripData({ coverUrl: '' })}
            />
          </div>

          {/* C. Trip Details Form Card (Right Column on Desktop) */}
          <div className="lg:col-span-8 bg-surface-raised rounded-xl border border-accent-200/70 p-6 sm:p-8 shadow-neo-raised space-y-6">
            
            {/* Trip Name */}
            <div>
              <Input
                label="Trip name"
                required
                value={tripData.name || ''}
                onChange={(e) => onUpdateTripData({ name: e.target.value })}
                onBlur={() => setNameTouched(true)}
                placeholder="e.g. Kyoto in cherry blossom season"
                placeholderFont="display"
                error={nameTouched && !tripData.name?.trim() ? "Trip name is required" : ""}
              />
            </div>

            {/* Destination(s) Search Autocomplete */}
            <div>
              <DestinationSearch
                required
                selectedDestinations={tripData.destinations || []}
                onAddDestination={handleAddDestination}
                onRemoveDestination={handleRemoveDestination}
              />
            </div>

            {/* Connected Date Range Picker */}
            <div>
              <DateRangePicker
                required
                startDate={tripData.startDate}
                endDate={tripData.endDate}
                onChange={handleDateChange}
                error={dateError}
              />
            </div>

            {/* Trip Description */}
            <div>
              <Textarea
                label="Trip description (optional)"
                value={tripData.description || ''}
                onChange={(e) => onUpdateTripData({ description: e.target.value })}
                placeholder="What's this trip about? (e.g. Exploring ancient shrines, tasting matcha, photography)"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* D. Suggested For You Section (§2.3 D) */}
        {showSuggestions && (
          <div className="mt-12 pt-8 border-t border-ink-300/20 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-accent-400" />
              <h2 className="font-display font-semibold text-xl text-ink-900">
                Suggested for you
              </h2>
            </div>
            <p className="text-sm text-ink-700 font-sans mb-6">
              Based on the dates and destination you picked — tap "+ Add" to save to your itinerary stub.
            </p>

            {/* Horizontally scrollable row of Stub Cards */}
            <div className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
              {SUGGESTIONS.map((item) => (
                <div key={item.id} className="snap-start">
                  <StubCard
                    variant="destination"
                    title={item.title}
                    subtitle={item.subtitle}
                    cost={item.cost}
                    image={item.image}
                    isAdded={addedSuggestions.includes(item.id)}
                    onAdd={() => handleToggleSuggestion(item)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* E. Sticky Footer Action Bar (§2.3 E) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-raised/95 backdrop-blur-md border-t border-accent-200/80 shadow-neo-floating py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setIsDiscardModalOpen(true)}
            icon={Trash2}
          >
            Discard
          </Button>

          <div className="flex items-center gap-3">
            {!isValid && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-ink-500 bg-surface-sunken px-3 py-1.5 rounded-md border border-ink-300/20">
                <AlertCircle className="w-3.5 h-3.5 text-accent-400" />
                Fill trip name, destination & dates to continue
              </span>
            )}

            <Button
              variant="primary"
              disabled={!isValid}
              onClick={onContinue}
              icon={ArrowRight}
              iconPosition="right"
              title={!isValid ? "Add a trip name, destination and dates to continue" : "Continue to Build Itinerary"}
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>

      {/* Discard Modal */}
      <ConfirmModal
        isOpen={isDiscardModalOpen}
        title="Discard this trip?"
        message="Anything you've entered will be reset. Are you sure you want to discard your draft?"
        confirmLabel="Discard trip"
        cancelLabel="Keep editing"
        onConfirm={() => {
          setIsDiscardModalOpen(false);
          onReset();
        }}
        onCancel={() => setIsDiscardModalOpen(false)}
      />
    </div>
  );
};
