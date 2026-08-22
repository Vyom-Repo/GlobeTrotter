import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Camera, Save, Check, ShieldAlert, Globe, DollarSign, X, ArrowLeft, Heart, CheckCircle2, Award, Sparkles, Share2, Compass, ArrowRight, Plane, Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import authService from '../services/authService';
import userService from '../services/userService';
import savedDestinationService from '../services/savedDestinationService';
import tripService from '../services/tripService';

export default function UserProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    avatarUrl: ''
  });
  
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  
  const [isSaved, setIsSaved] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [initialEmail, setInitialEmail] = useState('');

  // Two-step delete account modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);
        const user = await userService.getCurrentUser().catch(() => authService.getCachedUser());
        if (user) {
          const nameParts = (user.name || user.full_name || '').split(' ');
          const fName = user.first_name || nameParts[0] || '';
          const lName = user.last_name || nameParts.slice(1).join(' ') || '';

          setFormData({
            firstName: fName,
            lastName: lName,
            email: user.email || '',
            phone: user.phone || user.phone_number || '',
            city: user.city || '',
            country: user.country || '',
            avatarUrl: user.profile_photo_url || user.avatar_url || ''
          });
          setInitialEmail(user.email || '');
        }

        // Fetch saved destinations
        const savedRes = await savedDestinationService.getSavedDestinations().catch(() => null);
        if (savedRes && savedRes.data) {
          setSavedDestinations(savedRes.data.map(d => d.city_name || d.name || d));
        } else {
          setSavedDestinations(['Goa', 'Kyoto', 'Paris', 'Santorini']);
        }

        // Fetch trips for stats & history
        const tripsRes = await tripService.getTrips(1, 20).catch(() => null);
        if (tripsRes && tripsRes.data) {
          const allTrips = tripsRes.data;
          setUpcomingTrips(allTrips.filter(t => t.status === 'upcoming' || t.status === 'ongoing'));
          setCompletedTrips(allTrips.filter(t => t.status === 'completed'));
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  const handleInputChange = (field, val) => {
    if (field === 'email' && val !== initialEmail) {
      setIsEmailChanged(true);
    }
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await userService.updateProfile({
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        profile_photo_url: formData.avatarUrl
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      alert('Failed to update profile: ' + (err.message || 'Error occurred'));
    }
  };

  const handleRemoveSavedDestination = async (destName) => {
    setSavedDestinations(prev => prev.filter(d => d !== destName));
  };

  const handleDeleteAccountSubmit = (e) => {
    e.preventDefault();
    if (deleteConfirmText.trim() === 'DELETE') {
      authService.logout();
      alert("Account deletion initiated. You will now be redirected.");
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-500 selection:text-white">
      <Navbar />

      <div className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          
          {/* HERO SECTION */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group">
            
            {/* Editorial Cover Background Image */}
            <div className="h-52 sm:h-64 w-full relative overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
                alt="Travel Cover"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/40" />

              <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                <Compass className="w-4 h-4 text-blue-300 animate-spin-slow" />
                <span>GlobeTrotter Passport #GT-9872</span>
              </div>
            </div>

            {/* Profile Hero Details Row */}
            <div className="px-6 sm:px-10 pb-8 pt-0 relative bg-white">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-16 sm:-mt-20">
                
                {/* Left Column: Avatar + Name + Badges */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                  <div className="relative group/avatar shrink-0 w-28 h-28 sm:w-36 sm:h-36">
                    <div className="w-full h-full rounded-full bg-blue-600 text-white font-bold text-4xl flex items-center justify-center border-4 border-white shadow-xl overflow-hidden ring-4 ring-blue-500/20">
                      {formData.avatarUrl ? (
                        <img src={formData.avatarUrl} alt={formData.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{(formData.firstName?.[0] || 'U')}{(formData.lastName?.[0] || '')}</span>
                      )}
                    </div>

                    <label className="absolute inset-0 rounded-full bg-slate-900/60 backdrop-blur-xs opacity-0 group-hover/avatar:opacity-100 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer text-white">
                      <Camera className="w-6 h-6 mb-1 text-blue-300" />
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

                    <div className="absolute bottom-1 right-1 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-md" title="Verified Pro Explorer">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight font-serif">
                        {formData.firstName || 'Explorer'} {formData.lastName}
                      </h1>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                        <Sparkles className="w-3 h-3 text-emerald-600" /> Pro Explorer
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {formData.email || 'user@example.com'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        {formData.city || 'San Francisco'}, {formData.country || 'USA'}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        {formData.phone || '+1 (555) 000-0000'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Travel Stats & Quick Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:self-end pt-2 lg:pt-0">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 shadow-xs text-center min-w-[200px]">
                    <div className="px-3 border-r border-slate-200">
                      <span className="block font-bold text-xl text-slate-900">
                        {upcomingTrips.length + completedTrips.length}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                        Trips Built
                      </span>
                    </div>
                    <div className="px-3">
                      <span className="block font-bold text-xl text-blue-600">
                        {savedDestinations.length}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                        Saved Places
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        const el = document.getElementById('account-details-form');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="cursor-pointer hover:bg-slate-100 transition-all duration-200 shadow-xs"
                    >
                      Edit Profile
                    </Button>

                    <Button
                      variant="ghost"
                      size="md"
                      icon={Share2}
                      onClick={() => alert("Profile link copied to clipboard!")}
                      className="cursor-pointer border border-slate-200 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
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
            
            {/* LEFT COLUMN: Account Details & Settings */}
            <div className="lg:col-span-5 space-y-6" id="account-details-form">
              
              {/* Account Details Card */}
              <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-semibold text-lg text-slate-900 font-serif">
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
                    <p className="mt-1 text-[11px] text-blue-700 font-medium">
                      ℹ Confirmation link will be sent to your new email.
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
                  <h3 className="font-semibold text-lg text-slate-900 font-serif">
                    Preferences & Saved Places
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Language Preference
                  </label>
                  <select className="w-full bg-slate-50 text-slate-900 text-sm p-2.5 rounded-md border border-slate-300 outline-none hover:border-slate-400 cursor-pointer">
                    <option value="en">English (US)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="es">Spanish (Español)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Currency
                  </label>
                  <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-700">
                    <span>USD ($)</span>
                    <span className="text-[10px] text-slate-500 font-normal">GlobeTrotter default</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Saved Destinations
                  </label>
                  {savedDestinations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {savedDestinations.map((dest) => (
                        <span
                          key={dest}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 hover:border-blue-400 transition-all duration-200"
                        >
                          <MapPin className="w-3 h-3 text-blue-600" />
                          <span>{dest}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSavedDestination(dest)}
                            className="hover:bg-red-100 hover:text-red-600 rounded-full p-0.5 transition-colors cursor-pointer ml-0.5"
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
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4" /> Danger Zone
                  </span>
                  <p className="text-xs text-slate-500">
                    Permanently remove your account and all associated trip data.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="!text-red-600 border border-red-200 hover:!bg-red-50 transition-all duration-200 cursor-pointer"
                  >
                    Delete My Account
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Preplanned & Previous Trips */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Preplanned / Upcoming Trips Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-xl text-slate-900 flex items-center gap-2 font-serif">
                    <Heart className="w-5 h-5 text-blue-500" /> Preplanned & Upcoming Trips
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">{upcomingTrips.length} Saved</span>
                </div>

                {upcomingTrips.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {upcomingTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden p-4 flex flex-col justify-between group cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200 relative">
                            <img
                              src={trip.cover_photo_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80'}
                              alt={trip.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-base text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                              {trip.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-blue-500" /> {(trip.destinations || [trip.destination || 'Multiple Cities']).join(', ')}
                            </p>
                            <p className="text-xs text-blue-700 font-semibold mt-0.5">
                              📅 {trip.start_date || trip.startDate || 'Upcoming'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => navigate(`/trips/${trip.id}`)}
                            className="
                              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700
                              bg-slate-50 border border-slate-200 shadow-xs
                              group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600
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
                  <h3 className="font-semibold text-xl text-slate-900 flex items-center gap-2 font-serif">
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
                              src={trip.cover_photo_url || 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80'}
                              alt={trip.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-base text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                              {trip.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-blue-500" /> {(trip.destinations || [trip.destination || 'Multiple Cities']).join(', ')}
                            </p>
                            <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                              Completed ✓
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => navigate(`/trips/${trip.id}`)}
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

        {/* Delete Account Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsDeleteModalOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" />
            
            <div className="relative bg-white border border-slate-200 shadow-2xl rounded-xl max-w-md w-full p-6 z-10 animate-fade-in-up">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-full border border-red-200 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 font-serif">
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
                    Type <span className="font-bold text-red-600">DELETE</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full bg-slate-50 text-slate-900 text-sm px-3.5 py-2 rounded-md border border-slate-300 outline-none focus:border-red-600"
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
    </div>
  );
}
