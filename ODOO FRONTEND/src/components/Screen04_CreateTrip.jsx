import React, { useState, useEffect } from 'react';
import { ArrowRight, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { Input, Textarea } from './ui/Input';
import { DestinationSearch } from './ui/DestinationSearch';
import { DateRangePicker } from './ui/DateRangePicker';
import { StubCard } from './ui/StubCard';
import { Button } from './ui/Button';
import { ConfirmModal } from './ui/ConfirmModal';

const SUGGESTIONS = [
  { id: 's1', title: 'Fushimi Inari Shrine Tour', subtitle: 'Kyoto, Japan', cost: '₹4,500', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
  { id: 's2', title: 'Arashiyama Bamboo Grove Walk', subtitle: 'Kyoto, Japan', cost: '₹2,800', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
  { id: 's3', title: 'Traditional Tea Ceremony', subtitle: 'Gion, Kyoto', cost: '₹6,000', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80' },
  { id: 's4', title: 'teamLab Planets Digital Art', subtitle: 'Tokyo, Japan', cost: '₹3,800', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
  { id: 's5', title: 'Nijo Castle & Gardens', subtitle: 'Kyoto, Japan', cost: '₹1,500', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80' },
  { id: 's6', title: 'Kinkaku-ji Golden Pavilion', subtitle: 'Kyoto, Japan', cost: '₹1,200', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80' }
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

  // Validation check
  const isValid = Boolean(
    tripData.name && tripData.name.trim() &&
    tripData.destinations && tripData.destinations.length > 0 &&
    tripData.startDate && tripData.endDate &&
    !dateError
  );

  // Check if form has any content (isDirty)
  const isDirty = Boolean(
    tripData.name?.trim() ||
    (tripData.destinations && tripData.destinations.length > 0) ||
    tripData.startDate ||
    tripData.endDate ||
    tripData.description?.trim()
  );

  // Smart Discard click handler per §2.3 E
  const handleDiscardClick = () => {
    if (isDirty) {
      // If fields have content, open confirmation modal
      setIsDiscardModalOpen(true);
    } else {
      // If fields are empty, directly reset without unnecessary popup
      onReset();
    }
  };

  const showSuggestions = (tripData.destinations && tripData.destinations.length > 0) || tripData.startDate;

  return (
    <div className="min-h-screen bg-surface-canvas pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Screen Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-700 bg-accent-50 px-2.5 py-1 rounded-sm border border-accent-200">
              Step 1 of 2 · Plan Trip
            </span>
            <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink-900 mt-2">
              Plan a New Trip
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-sans mt-1">
              Enter your trip details below to get started and build your customized itinerary.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs self-start md:self-auto">
            <span className={`w-2 h-2 rounded-full ${saveStatus.includes('Saving') ? 'bg-semantic-warning animate-ping' : 'bg-semantic-success'}`} />
            <span>{saveStatus}</span>
          </div>
        </div>

        {/* Clean Centered Form Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-display font-semibold text-xl text-ink-900">
              Trip Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill out the required information to initialize your travel itinerary.
            </p>
          </div>

          {/* Trip Name */}
          <div>
            <Input
              label="Trip Name"
              required
              value={tripData.name || ''}
              onChange={(e) => onUpdateTripData({ name: e.target.value })}
              onBlur={() => setNameTouched(true)}
              placeholder="e.g. Kyoto Cherry Blossom Tour 2026"
              placeholderFont="display"
              error={nameTouched && !tripData.name?.trim() ? "Trip name is required" : ""}
            />
          </div>

          {/* Destination(s) Search */}
          <div>
            <DestinationSearch
              label="Destinations"
              required
              selectedDestinations={tripData.destinations || []}
              onAddDestination={handleAddDestination}
              onRemoveDestination={handleRemoveDestination}
            />
          </div>

          {/* Travel Dates Picker */}
          <div>
            <DateRangePicker
              label="Travel Dates"
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
              label="Trip Overview & Notes (Optional)"
              value={tripData.description || ''}
              onChange={(e) => onUpdateTripData({ description: e.target.value })}
              placeholder="Add key objectives, packing reminders, or a brief overview of what this trip is about..."
              rows={3}
            />
          </div>
        </div>

        {/* Suggested For You Section */}
        {showSuggestions && (
          <div className="mt-10 pt-8 border-t border-slate-200 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-accent-400" />
              <h2 className="font-display font-semibold text-xl text-ink-900">
                Suggested Attractions & Activities
              </h2>
            </div>
            <p className="text-sm text-slate-600 font-sans mb-6">
              Popular recommendations based on your selected destination and travel dates.
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

      {/* Sticky Footer Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleDiscardClick}
            icon={Trash2}
            className="cursor-pointer"
          >
            Discard
          </Button>

          <div className="flex items-center gap-3">
            {!isValid && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
                <AlertCircle className="w-3.5 h-3.5 text-accent-400" />
                Please complete Trip Name, Destinations & Dates to continue
              </span>
            )}

            <Button
              variant="primary"
              disabled={!isValid}
              onClick={onContinue}
              icon={ArrowRight}
              iconPosition="right"
              title={!isValid ? "Add a trip name, destination and dates to continue" : "Continue to Build Itinerary"}
              className="cursor-pointer"
            >
              Continue to Itinerary →
            </Button>
          </div>
        </div>
      </div>

      {/* Discard Confirmation Modal (Only shown if fields have content) */}
      <ConfirmModal
        isOpen={isDiscardModalOpen}
        title="Discard this trip draft?"
        message="Anything you've entered will be cleared. Are you sure you want to discard your changes?"
        confirmLabel="Discard Draft"
        cancelLabel="Keep Editing"
        onConfirm={() => {
          setIsDiscardModalOpen(false);
          onReset();
        }}
        onCancel={() => setIsDiscardModalOpen(false)}
      />
    </div>
  );
};
