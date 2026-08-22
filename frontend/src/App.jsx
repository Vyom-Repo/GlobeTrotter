import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import AuthContainer from './components/AuthContainer';
import authService from './services/authService';
import userService from './services/userService';
import tripService from './services/tripService';
import savedDestinationService from './services/savedDestinationService';

import { Navbar } from './components/Navbar';
import { Screen04_CreateTrip } from './components/Screen04_CreateTrip';
import { Screen05_BuildItinerary } from './components/Screen05_BuildItinerary';
import { Screen06_MyTrips } from './components/Screen06_MyTrips';
import { Screen06_TripDetail } from './components/Screen06_TripDetail';
import { Screen07_UserProfile } from './components/Screen07_UserProfile';
import { Screen08_ActivitySearch } from './components/Screen08_ActivitySearch';
import { Screen09_ItineraryBudget } from './components/Screen09_ItineraryBudget';
import { Screen10_CommunityFeed } from './components/Screen10_CommunityFeed';
import { Screen11_CalendarView } from './components/Screen11_CalendarView';
import { Screen12_AdminPanel } from './components/Screen12_AdminPanel';

const INITIAL_TRIPS = [
  {
    id: 't-kyoto',
    name: 'Kyoto Cherry Blossom Special',
    coverUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    destinations: ['Kyoto', 'Tokyo'],
    startDate: '2026-09-12',
    endDate: '2026-09-20',
    status: 'ongoing',
    targetBudget: 62000,
    description: 'First time in Japan for 8 days to explore ancient shrines, tea ceremonies, and digital art exhibits.',
    stops: [
      {
        id: 'stop-1',
        title: 'Tokyo & Harajuku Highlights',
        dates: 'Sep 12 → Sep 16',
        budget: 24000,
        notes: 'Stay near Shinjuku. Explore digital art and food markets.',
        activities: [
          { id: 'a1', name: 'Senso-ji Temple visit', cost: 1200 },
          { id: 'a2', name: 'teamLab Planets Entry', cost: 3800 },
          { id: 'a3', name: 'Tsukiji Outer Market Food Tour', cost: 4500 }
        ]
      },
      {
        id: 'stop-2',
        title: 'Kyoto Shrines & Bamboo Grove',
        dates: 'Sep 16 → Sep 20',
        budget: 18500,
        notes: 'Take bullet train to Kyoto. Rent kimonos and visit Gion.',
        activities: [
          { id: 'b1', name: 'Fushimi Inari Shrine Hike', cost: 0 },
          { id: 'b2', name: 'Traditional Tea Ceremony in Gion', cost: 6000 },
          { id: 'b3', name: 'Arashiyama Bamboo Grove', cost: 1500 }
        ]
      }
    ]
  },
  {
    id: 't-goa',
    name: 'Goa Coastal & Beach Retreat',
    coverUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    destinations: ['Goa', 'North Goa'],
    startDate: '2026-10-05',
    endDate: '2026-10-10',
    status: 'upcoming',
    targetBudget: 35000,
    description: 'Relaxing beach break in North Goa with water sports and seafood dining.',
    stops: [
      {
        id: 'stop-goa-1',
        title: 'Calangute & Baga Beach Stay',
        dates: 'Oct 05 → Oct 08',
        budget: 20000,
        notes: 'Resort stay near the beach.',
        activities: [
          { id: 'ga1', name: 'Water Sports Package', cost: 4500 },
          { id: 'ga2', name: 'Sunset Cruise on Mandovi River', cost: 2000 }
        ]
      }
    ]
  }
];

function ProtectedApp({ initialScreen = 'screen6' }) {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [activeTripId, setActiveTripId] = useState('t-kyoto');

  const [userProfile, setUserProfile] = useState(() => {
    const cached = authService.getCachedUser();
    const parts = (cached?.name || '').split(' ');
    return {
      firstName: parts[0] || 'User',
      lastName: parts.slice(1).join(' ') || '',
      email: cached?.email || 'user@example.com',
      phone: cached?.phone || '+91 98765 43210',
      city: cached?.city || 'Ahmedabad',
      country: cached?.country || 'India',
      avatarUrl: cached?.profile_photo_url || '',
      is_admin: cached?.is_admin === true,
      name: cached?.name || 'User'
    };
  });

  const [savedDestinations, setSavedDestinations] = useState(['Goa', 'Manali', 'Singapore', 'Kyoto']);

  // Fetch logged in user profile & trips from backend
  useEffect(() => {
    async function loadBackendData() {
      try {
        const currentUser = await userService.getCurrentUser();
        if (currentUser) {
          const parts = (currentUser.name || '').split(' ');
          setUserProfile({
            firstName: parts[0] || 'User',
            lastName: parts.slice(1).join(' ') || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
            city: currentUser.city || '',
            country: currentUser.country || '',
            avatarUrl: currentUser.profile_photo_url || '',
            is_admin: currentUser.is_admin === true,
            name: currentUser.name || 'User'
          });

          // Non-admin user protection for admin screen
          if (initialScreen === 'screen12' && currentUser.is_admin !== true) {
            setCurrentScreen('screen6');
          }
        }
      } catch (e) {
        console.warn('Backend user profile fetch note:', e);
      }

      try {
        const backendTrips = await tripService.getUserTrips();
        const items = Array.isArray(backendTrips) ? backendTrips : (backendTrips?.items || backendTrips?.data || []);
        if (items.length > 0) {
          const mappedTrips = items.map(t => ({
            id: t.id,
            name: t.name,
            coverUrl: t.cover_photo_url || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
            destinations: (t.stops || []).map(s => s.city_name || 'Destination'),
            startDate: t.start_date || '2026-09-12',
            endDate: t.end_date || '2026-09-20',
            status: 'upcoming',
            targetBudget: Number(t.budget_limit) || 50000,
            description: t.description || 'Smart planned multi-city trip.',
            stops: (t.stops || []).map((s, idx) => ({
              id: s.id || `stop-${idx}`,
              title: s.city_name || `Stop ${idx + 1}`,
              dates: `${s.start_date || 'Sep 12'} → ${s.end_date || 'Sep 16'}`,
              budget: Number(s.budget_allocation) || 15000,
              notes: s.notes || '',
              activities: (s.itinerary_items || []).map(item => ({
                id: item.id,
                name: item.activity_name || 'Activity',
                cost: Number(item.estimated_cost) || 0
              }))
            }))
          }));
          setTrips(mappedTrips);
          if (mappedTrips[0]?.id) setActiveTripId(mappedTrips[0].id);
        }
      } catch (e) {
        console.warn('Backend trip fetch note:', e);
      }

      try {
        const savedRes = await savedDestinationService.listSavedDestinations();
        const savedItems = Array.isArray(savedRes?.data) ? savedRes.data : (Array.isArray(savedRes) ? savedRes : (savedRes?.items || []));
        if (savedItems.length > 0) {
          setSavedDestinations(savedItems.map(d => d.entity_name || d.name || 'Saved Spot'));
        }
      } catch (e) {
        console.warn('Saved destination fetch note:', e);
      }
    }

    loadBackendData();
  }, [initialScreen]);

  // Handle Logout
  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0] || {
    id: 'new-trip',
    name: '',
    destinations: [],
    startDate: '',
    endDate: '',
    description: '',
    stops: []
  };

  const handleUpdateActiveTrip = async (fields) => {
    setTrips(prevTrips =>
      prevTrips.map(t => (t.id === activeTrip.id ? { ...t, ...fields } : t))
    );
    // Sync with backend if valid UUID trip
    if (activeTrip.id && !activeTrip.id.startsWith('t-') && !activeTrip.id.startsWith('new-')) {
      try {
        await tripService.updateTrip(activeTrip.id, {
          name: fields.name || activeTrip.name,
          description: fields.description || activeTrip.description,
          budget_limit: fields.targetBudget || activeTrip.targetBudget
        });
      } catch (e) {
        console.warn('Trip backend update note:', e);
      }
    }
  };

  const handlePlanNewTrip = async () => {
    const newId = `trip-${Date.now()}`;
    const newTripObj = {
      id: newId,
      name: 'New Multi-City Trip',
      coverUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      destinations: [],
      startDate: '2026-10-01',
      endDate: '2026-10-07',
      status: 'upcoming',
      targetBudget: 50000,
      description: 'Custom travel plan.',
      stops: []
    };
    setTrips([newTripObj, ...trips]);
    setActiveTripId(newId);
    setCurrentScreen('screen4');

    // Persist to backend
    try {
      const created = await tripService.createTrip({
        name: 'New Multi-City Trip',
        description: 'Custom travel plan.',
        start_date: '2026-10-01',
        end_date: '2026-10-07',
        budget_limit: 50000,
        currency: 'INR'
      });
      const realTrip = created?.data || created;
      if (realTrip?.id) {
        setActiveTripId(realTrip.id);
        setTrips(prev => prev.map(t => t.id === newId ? { ...t, id: realTrip.id } : t));
      }
    } catch (e) {
      console.warn('Backend trip creation note:', e);
    }
  };

  const handleViewTripDetail = (tripToView) => {
    setActiveTripId(tripToView.id);
    setCurrentScreen('screen6-detail');
  };

  const handleEditTrip = (tripToEdit) => {
    setActiveTripId(tripToEdit.id);
    setCurrentScreen('screen4');
  };

  const handleDuplicateTrip = (tripToDup) => {
    const dupId = `trip-${Date.now()}`;
    const duplicated = {
      ...tripToDup,
      id: dupId,
      name: `${tripToDup.name} (Copy)`,
      status: 'upcoming',
      stops: (tripToDup.stops || []).map(s => ({
        ...s,
        id: `stop-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`
      }))
    };
    setTrips([duplicated, ...trips]);
  };

  const handleDeleteTrip = async (tripIdToDelete) => {
    setTrips(prev => prev.filter(t => t.id !== tripIdToDelete));
    if (tripIdToDelete && !tripIdToDelete.startsWith('t-') && !tripIdToDelete.startsWith('trip-')) {
      try {
        await tripService.deleteTrip(tripIdToDelete);
      } catch (e) {
        console.warn('Trip deletion note:', e);
      }
    }
  };

  const handleResetTrip = () => {
    handleUpdateActiveTrip({
      name: '',
      destinations: [],
      startDate: '',
      endDate: '',
      description: '',
      stops: []
    });
  };

  const handleRemoveSavedDestination = (destName) => {
    setSavedDestinations(prev => prev.filter(d => d !== destName));
  };

  const handleAddActivityFromSearch = (item) => {
    if (activeTrip && activeTrip.stops.length > 0) {
      const updatedStops = [...activeTrip.stops];
      updatedStops[0].activities = [
        ...updatedStops[0].activities,
        { id: Date.now().toString(), name: item.title, cost: item.cost }
      ];
      handleUpdateActiveTrip({ stops: updatedStops });
    }
  };

  const handleUpdateUserProfile = async (updatedData) => {
    try {
      const name = `${updatedData.firstName || ''} ${updatedData.lastName || ''}`.trim();
      const updated = await userService.updateProfile({
        name,
        email: updatedData.email,
        phone: updatedData.phone,
        city: updatedData.city,
        country: updatedData.country,
        profile_photo_url: updatedData.avatarUrl
      });
      const realUser = updated?.data || updated;
      setUserProfile(prev => ({
        ...prev,
        ...updatedData,
        is_admin: realUser?.is_admin ?? prev.is_admin
      }));
    } catch (e) {
      console.warn('Profile update note:', e);
      setUserProfile(prev => ({ ...prev, ...updatedData }));
    }
  };

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900 font-sans" data-theme="light-blue">
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          if (screen === 'screen12' && userProfile.is_admin !== true) {
            alert('Access Denied: Admin Panel privileges are required.');
            return;
          }
          setCurrentScreen(screen);
        }}
        user={userProfile}
        onLogout={handleLogout}
      />

      <main className="animate-fade-in-up">
        {currentScreen === 'screen6' && (
          <Screen06_MyTrips
            trips={trips}
            onPlanNewTrip={handlePlanNewTrip}
            onViewTrip={handleViewTripDetail}
            onEditTrip={handleEditTrip}
            onDuplicateTrip={handleDuplicateTrip}
            onDeleteTrip={handleDeleteTrip}
          />
        )}

        {currentScreen === 'screen6-detail' && (
          <Screen06_TripDetail
            tripData={activeTrip}
            onBack={() => setCurrentScreen('screen6')}
            onEditTrip={handleEditTrip}
          />
        )}

        {currentScreen === 'screen4' && (
          <Screen04_CreateTrip
            tripData={activeTrip}
            onUpdateTripData={handleUpdateActiveTrip}
            onContinue={() => setCurrentScreen('screen5')}
            onReset={handleResetTrip}
          />
        )}

        {currentScreen === 'screen5' && (
          <Screen05_BuildItinerary
            tripData={activeTrip}
            onUpdateTripData={handleUpdateActiveTrip}
            onBack={() => setCurrentScreen('screen4')}
            onSaveAndExit={() => setCurrentScreen('screen6')}
          />
        )}

        {currentScreen === 'screen7' && (
          <Screen07_UserProfile
            userProfile={userProfile}
            savedDestinations={savedDestinations}
            upcomingTrips={trips.filter(t => t.status === 'upcoming')}
            completedTrips={trips.filter(t => t.status === 'completed')}
            onUpdateProfile={handleUpdateUserProfile}
            onRemoveSavedDestination={handleRemoveSavedDestination}
            onNavigateToTrip={(trip) => {
              setActiveTripId(trip.id);
              setCurrentScreen('screen6-detail');
            }}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'screen8' && (
          <Screen08_ActivitySearch
            onAddActivityToTrip={handleAddActivityFromSearch}
          />
        )}

        {currentScreen === 'screen9' && (
          <Screen09_ItineraryBudget
            tripData={activeTrip}
            onAddDay={() => setCurrentScreen('screen5')}
          />
        )}

        {currentScreen === 'screen10' && (
          <Screen10_CommunityFeed
            onViewCommunityTrip={(post) => {
              setActiveTripId(trips[0]?.id || 't-kyoto');
              setCurrentScreen('screen6-detail');
            }}
          />
        )}

        {currentScreen === 'screen11' && (
          <Screen11_CalendarView
            trips={trips}
            onViewTrip={handleViewTripDetail}
            onPlanNewTrip={handlePlanNewTrip}
          />
        )}

        {currentScreen === 'screen12' && (
          userProfile.is_admin ? (
            <Screen12_AdminPanel />
          ) : (
            <div className="p-12 text-center text-slate-700">
              <h2 className="text-2xl font-bold text-red-600">Access Restricted</h2>
              <p className="mt-2 text-sm">You need Administrator privileges to view this section.</p>
              <button
                onClick={() => setCurrentScreen('screen6')}
                className="mt-4 px-4 py-2 bg-accent-600 text-white font-semibold rounded-md shadow-xs hover:bg-accent-700 cursor-pointer"
              >
                Return to My Trips
              </button>
            </div>
          )
        )}
      </main>
    </div>
  );
}

function ProtectedRoute({ children, requireAdmin = false }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin) {
    const cachedUser = authService.getCachedUser();
    if (!cachedUser || cachedUser.is_admin !== true) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthContainer initialMode="login" />} />
        <Route path="/register" element={<AuthContainer initialMode="register" />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedApp initialScreen="screen6" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <ProtectedApp initialScreen="screen11" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <ProtectedApp initialScreen="screen12" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/*"
          element={
            <ProtectedRoute>
              <ProtectedApp initialScreen="screen6" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <ProtectedApp initialScreen="screen10" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProtectedApp initialScreen="screen7" />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            authService.isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
