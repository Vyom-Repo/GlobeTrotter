import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Screen04_CreateTrip } from './components/Screen04_CreateTrip';
import { Screen05_BuildItinerary } from './components/Screen05_BuildItinerary';

const INITIAL_TRIP_DATA = {
  name: 'Kyoto in cherry blossom season',
  coverUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  destinations: ['Kyoto', 'Tokyo'],
  startDate: '2026-09-12',
  endDate: '2026-09-20',
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
};

export function App() {
  const [currentScreen, setCurrentScreen] = useState('screen4'); // 'screen4' | 'screen5'
  const [tripData, setTripData] = useState(INITIAL_TRIP_DATA);

  const handleUpdateTripData = (fields) => {
    setTripData((prev) => ({
      ...prev,
      ...fields
    }));
  };

  const handleReset = () => {
    setTripData({
      name: '',
      coverUrl: '',
      destinations: [],
      startDate: '',
      endDate: '',
      description: '',
      stops: []
    });
  };

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900 font-sans" data-theme="light-blue">
      {/* App Shell Navigation Header */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />

      {/* Screen Views with Smooth Transition */}
      <main className="animate-fade-in-up">
        {currentScreen === 'screen4' ? (
          <Screen04_CreateTrip
            tripData={tripData}
            onUpdateTripData={handleUpdateTripData}
            onContinue={() => setCurrentScreen('screen5')}
            onReset={handleReset}
          />
        ) : (
          <Screen05_BuildItinerary
            tripData={tripData}
            onUpdateTripData={handleUpdateTripData}
            onBack={() => setCurrentScreen('screen4')}
            onSaveAndExit={() => alert("Draft saved to your GlobeTrotter account!")}
          />
        )}
      </main>
    </div>
  );
}

export default App;
