import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import AuthContainer from './components/AuthContainer';
import Dashboard from './pages/Dashboard';
import TripDetails from './pages/TripDetails';
import ItineraryBuilder from './pages/ItineraryBuilder';
import TripBudget from './pages/TripBudget';
import PublicTrips from './pages/PublicTrips';
import PublicTripDetails from './pages/PublicTripDetails';
import SavedDestinations from './pages/SavedDestinations';
import UserProfile from './pages/UserProfile';
import authService from './services/authService';

function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Public Auth routes */}
        <Route path="/login" element={<AuthContainer initialMode="login" />} />
        <Route path="/register" element={<AuthContainer initialMode="register" />} />

        {/* Public Discovery routes */}
        <Route path="/explore" element={<PublicTrips />} />
        <Route path="/public-trips/:tripId" element={<PublicTripDetails />} />
        <Route path="/shared/:token" element={<PublicTripDetails />} />

        {/* Protected User Application Flow */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/new"
          element={
            <ProtectedRoute>
              <TripDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:tripId"
          element={
            <ProtectedRoute>
              <TripDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:tripId/itinerary"
          element={
            <ProtectedRoute>
              <ItineraryBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips/:tripId/budget"
          element={
            <ProtectedRoute>
              <TripBudget />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-destinations"
          element={
            <ProtectedRoute>
              <SavedDestinations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
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
