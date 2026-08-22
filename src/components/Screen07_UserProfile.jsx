import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Camera, Save, Check, ShieldAlert, Globe, DollarSign, X, ArrowLeft, Heart, CheckCircle2, Award, Sparkles, Share2, Compass, ArrowRight, Plane
} from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export const Screen07_UserProfile = ({
  userProfile = {
    firstName: 'Neel',
    lastName: 'Patel',
    email: 'neelpatel0179@email.com',
    phone: '+91 98765 43210',
    city: 'Ahmedabad',
    country: 'India',
    avatarUrl: ''
  },
  savedDestinations = ['Goa', 'Manali', 'Singapore', 'Kyoto'],
  upcomingTrips = [],
  completedTrips = [],
  onUpdateProfile,
  onRemoveSavedDestination,
  onNavigateToTrip
}) => {
  const [formData, setFormData] = useState(userProfile);
  const [isSaved, setIsSaved] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);

  // Two-step delete account modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleInputChange = (field, val) => {
    if (field === 'email' && val !== userProfile.email) {
      setIsEmailChanged(true);
    }
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleDeleteAccountSubmit = (e) => {
    e.preventDefault();
    if (deleteConfirmText.trim() === 'DELETE') {
      alert("Account deletion initiated. You will now be redirected.");
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-canvas pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* HIGH-END PRO-LEVEL HERO SECTION */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group">
          
          {/* Editorial Cover Background Image with Gradient Scrim */}
          <div className="h-52 sm:h-64 w-full relative overflow-hidden bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
              alt="Travel Cover"
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Gradient Overlays for High Contrast & Sophistication */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/40" />

            {/* Travel Passport Stamp Watermark Badge (Top Right) */}
            <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
              <Compass className="w-4 h-4 text-accent-300 animate-spin-slow" />
              <span>GlobeTrotter Passport #GT-9872</span>
            </div>
          </div>

          {/* Profile Hero Details Row */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative bg-white">
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              
              {/* Left Column: Avatar + Name + Badges */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                
                {/* Premium Avatar Circle with Status Ring */}
                <div className="relative group/avatar shrink-0 w-28 h-28 sm:w-36 sm:h-36">
                  <div className="w-full h-full rounded-full bg-accent-400 text-white font-bold text-4xl flex items-center justify-center border-4 border-white shadow-xl overflow-hidden ring-4 ring-accent-400/20">
                    {formData.avatarUrl ? (
                      <img src={formData.avatarUrl} alt={formData.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{formData.firstName?.[0]}{formData.lastName?.[0]}</span>
                    )}
                  </div>

                  {/* Camera Upload Overlay */}
                  <label className="absolute inset-0 rounded-full bg-slate-900/60 backdrop-blur-xs opacity-0 group-hover/avatar:opacity-100 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer text-white">
                    <Camera className="w-6 h-6 mb-1 text-accent-300" />
                    <span className="text-[10px] font-semibold">Change Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const url = URL.createObjectURL(e.target.files[0]);
                          handleInputChange('avatarUrl', url);
                        }
                      }}
                    />
                  </label>

                  {/* Verified Pro Badge */}
                  <div className="absolute bottom-1 right-1 bg-accent-400 text-white p-1.5 rounded-full border-2 border-white shadow-md" title="Verified Pro Explorer">
                    <Award className="w-4 h-4" />
                  </div>
                </div>

                {/* Identity Copy */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink-900 tracking-tight">
                      {formData.firstName} {formData.lastName}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                      <Sparkles className="w-3 h-3 text-emerald-600" /> Pro Explorer
                    </span>
                  </div>

                  <p className="text-sm font-sans text-slate-600 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                    {formData.email}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-accent-400" />
                      {formData.city}, {formData.country}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-accent-400" />
                      {formData.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Travel Stats & Quick Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:self-end pt-2 lg:pt-0">
                
                {/* Stats Container */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 shadow-xs text-center min-w-[200px]">
                  <div className="px-3 border-r border-slate-200">
                    <span className="block font-display font-bold text-xl text-ink-900">
                      {upcomingTrips.length + completedTrips.length + 1}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                      Trips Built
                    </span>
                  </div>
                  <div className="px-3">
                    <span className="block font-display font-bold text-xl text-accent-600">
                      8
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                      Countries
                    </span>
                  </div>
                </div>

                {/* Hero Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      const el = document.getElementById('account-details-form');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="cursor-pointer hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 shadow-xs"
                  >
                    Edit Profile
                  </Button>

                  <Button
                    variant="ghost"
                    size="md"
                    icon={Share2}
                    onClick={() => alert("Profile link copied to clipboard!")}
                    className="cursor-pointer border border-slate-200 hover:bg-accent-50 hover:text-accent-700 hover:border-accent-200 transition-all duration-200"
                  >
                    Share
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* DESKTOP 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Account Details & Settings (38% width) */}
          <div className="lg:col-span-5 space-y-6" id="account-details-form">
            
            {/* Account Details Card */}
            <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display font-semibold text-lg text-ink-900">
                  Account Details
                </h3>
                <p className="text-xs text-slate-500">
                  Manage your personal contact information.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
                <Input
                  label="Last Name"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>

              <div>
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                {isEmailChanged && (
                  <p className="mt-1 text-[11px] text-accent-700 font-medium">
                    ℹ We'll send a confirmation link to your new address.
                  </p>
                )}
              </div>

              <div>
                <Input
                  label="Phone Number"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="City"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
                <Input
                  label="Country"
                  value={formData.country || ''}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                {isSaved ? (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Saved ✓
                  </span>
                ) : (
                  <span />
                )}

                <Button type="submit" variant="primary" size="sm" icon={Save} className="cursor-pointer hover:shadow transition-all">
                  Save Changes
                </Button>
              </div>
            </form>

            {/* Preferences & Saved Destinations */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display font-semibold text-lg text-ink-900">
                  Preferences & Saved Places
                </h3>
              </div>

              {/* Language */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Language Preference
                </label>
                <select className="w-full bg-slate-50 text-ink-900 text-sm p-2.5 rounded-md border border-slate-300 outline-none hover:border-slate-400 cursor-pointer">
                  <option value="en">English (US)</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="es">Spanish (Español)</option>
                </select>
              </div>

              {/* Fixed Currency Row */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Currency
                </label>
                <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-700">
                  <span>₹ INR (Indian Rupee)</span>
                  <span className="text-[10px] text-slate-500 font-normal">GlobeTrotter default</span>
                </div>
              </div>

              {/* Saved Destinations Chips */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Saved Destinations
                </label>
                {savedDestinations.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {savedDestinations.map((dest) => (
                      <span
                        key={dest}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent-50 text-accent-800 border border-accent-200 hover:border-accent-400 hover:shadow-xs transition-all duration-200 group/chip"
                      >
                        <MapPin className="w-3 h-3 text-accent-600" />
                        <span>{dest}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveSavedDestination && onRemoveSavedDestination(dest)}
                          className="hover:bg-red-100 hover:text-semantic-danger rounded-full p-0.5 transition-colors cursor-pointer ml-0.5"
                          title={`Remove ${dest}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Bookmark a place while planning a trip and it'll show up here.
                  </p>
                )}
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t-2 border-red-100 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-semantic-danger flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" /> Danger Zone
                </span>
                <p className="text-xs text-slate-500">
                  Permanently remove your account and all associated trip data.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="!text-semantic-danger border border-red-200 hover:!bg-red-50 hover:!border-red-300 transition-all duration-200 cursor-pointer"
                >
                  Delete My Account
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Preplanned & Previous Trips (62% width) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Preplanned / Favorite Trips Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-xl text-ink-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-accent-400" /> Preplanned & Favorite Trips
                </h3>
                <span className="text-xs text-slate-500 font-semibold">{upcomingTrips.length} Saved</span>
              </div>

              {upcomingTrips.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upcomingTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-accent-300 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden p-4 flex flex-col justify-between group cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200 relative">
                          <img
                            src={trip.coverUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80'}
                            alt={trip.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-base text-ink-900 leading-snug group-hover:text-accent-600 transition-colors">
                            {trip.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-accent-400" /> {(trip.destinations || []).join(', ')}
                          </p>
                          <p className="text-xs text-accent-700 font-semibold mt-0.5">
                            📅 {trip.startDate}
                          </p>
                        </div>
                      </div>

                      {/* View Trip Button with Smooth Hover Arrow Slide */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => onNavigateToTrip && onNavigateToTrip(trip)}
                          className="
                            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700
                            bg-slate-50 border border-slate-200 shadow-xs
                            group-hover:bg-accent-400 group-hover:text-white group-hover:border-accent-400
                            transition-all duration-200 cursor-pointer
                          "
                        >
                          <span>View Trip</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-xs text-slate-500">
                  Nothing here yet — start planning your next journey!
                </div>
              )}
            </div>

            {/* Travel History & Previous Trips Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-xl text-ink-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Travel History & Previous Trips
                </h3>
                <span className="text-xs text-slate-500 font-semibold">{completedTrips.length} Completed</span>
              </div>

              {completedTrips.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {completedTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden p-4 flex flex-col justify-between group cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200 relative">
                          <img
                            src={trip.coverUrl || 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80'}
                            alt={trip.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-base text-ink-900 leading-snug group-hover:text-emerald-700 transition-colors">
                            {trip.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-accent-400" /> {(trip.destinations || []).join(', ')}
                          </p>
                          <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                            Completed ✓
                          </span>
                        </div>
                      </div>

                      {/* View History Button with Smooth Hover Arrow Slide */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => onNavigateToTrip && onNavigateToTrip(trip)}
                          className="
                            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700
                            bg-slate-50 border border-slate-200 shadow-xs
                            group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600
                            transition-all duration-200 cursor-pointer
                          "
                        >
                          <span>View History</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-xs text-slate-500">
                  No trips completed yet — your travel history will show up here.
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Two-Step Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsDeleteModalOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" />
          
          <div className="relative bg-white border border-slate-200 shadow-popover rounded-xl max-w-md w-full p-6 z-10 animate-fade-in-up">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-3 bg-red-50 text-semantic-danger rounded-full border border-red-200 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-ink-900">
                  Delete Your Account?
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  This permanently deletes your account, all trip itineraries, saved destinations, and personal data. This action cannot be undone.
                </p>
              </div>
            </div>

            <form onSubmit={handleDeleteAccountSubmit} className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Type <span className="font-bold text-semantic-danger">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full bg-slate-50 text-ink-900 text-sm px-3.5 py-2 rounded-md border border-slate-300 outline-none focus:border-semantic-danger font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  disabled={deleteConfirmText.trim() !== 'DELETE'}
                >
                  Permanently Delete Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
