import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Screen04_CreateTrip } from './components/Screen04_CreateTrip';
import { Screen05_BuildItinerary } from './components/Screen05_BuildItinerary';
import { Screen06_MyTrips } from './components/Screen06_MyTrips';
import { Screen06_TripDetail } from './components/Screen06_TripDetail';
import { Screen07_UserProfile } from './components/Screen07_UserProfile';

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
  },
  {
    id: 't-manali',
    name: 'Manali Himalayan Trek',
    coverUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    destinations: ['Manali', 'Solang Valley'],
    startDate: '2026-11-12',
    endDate: '2026-11-18',
    status: 'upcoming',
    targetBudget: 45000,
    description: 'Adventure trekking in Solang Valley and mountain pass exploration.',
    stops: [
      {
        id: 'stop-m-1',
        title: 'Solang Valley Expedition',
        dates: 'Nov 12 → Nov 15',
        budget: 25000,
        notes: 'Bring heavy thermal wear.',
        activities: [
          { id: 'ma1', name: 'Paragliding in Solang', cost: 3500 },
          { id: 'ma2', name: 'Atal Tunnel Drive', cost: 2500 }
        ]
      }
    ]
  },
  {
    id: 't-jaipur',
    name: 'Jaipur Heritage & Forts Tour',
    coverUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    destinations: ['Jaipur', 'Amer'],
    startDate: '2026-03-10',
    endDate: '2026-03-15',
    status: 'completed',
    targetBudget: 28000,
    description: 'Explored palace heritage, Amer Fort, and local handicrafts in Rajasthan.',
    stops: [
      {
        id: 'stop-j-1',
        title: 'Amer Fort & City Palace',
        dates: 'Mar 10 → Mar 13',
        budget: 18000,
        notes: 'Great heritage photography trip.',
        activities: [
          { id: 'ja1', name: 'Amer Fort Light & Sound Show', cost: 1500 },
          { id: 'ja2', name: 'Hawa Mahal Entry & Guide', cost: 800 }
        ]
      }
    ]
  }
];

export function App() {
  const [currentScreen, setCurrentScreen] = useState('screen6'); // 'screen6' | 'screen6-detail' | 'screen4' | 'screen5' | 'screen7'
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [activeTripId, setActiveTripId] = useState('t-kyoto');

  const [userProfile, setUserProfile] = useState({
    firstName: 'Neel',
    lastName: 'Patel',
    email: 'neelpatel0179@email.com',
    phone: '+91 98765 43210',
    city: 'Ahmedabad',
    country: 'India',
    avatarUrl: ''
  });

  const [savedDestinations, setSavedDestinations] = useState(['Goa', 'Manali', 'Singapore', 'Kyoto']);

  // Active trip data
  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0] || {
    id: 'new-trip',
    name: '',
    destinations: [],
    startDate: '',
    endDate: '',
    description: '',
    stops: []
  };

  const handleUpdateActiveTrip = (fields) => {
    setTrips(prevTrips =>
      prevTrips.map(t => (t.id === activeTrip.id ? { ...t, ...fields } : t))
    );
  };

  const handlePlanNewTrip = () => {
    const newId = `trip-${Date.now()}`;
    const newTripObj = {
      id: newId,
      name: '',
      coverUrl: '',
      destinations: [],
      startDate: '',
      endDate: '',
      status: 'upcoming',
      targetBudget: 50000,
      description: '',
      stops: []
    };
    setTrips([newTripObj, ...trips]);
    setActiveTripId(newId);
    setCurrentScreen('screen4');
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

  const handleDeleteTrip = (tripIdToDelete) => {
    setTrips(prev => prev.filter(t => t.id !== tripIdToDelete));
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

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900 font-sans" data-theme="light-blue">
      {/* App Shell Navigation Header */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />

      {/* Screen Views */}
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
            onUpdateProfile={setUserProfile}
            onRemoveSavedDestination={handleRemoveSavedDestination}
            onNavigateToTrip={(trip) => {
              setActiveTripId(trip.id);
              setCurrentScreen('screen6-detail');
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
