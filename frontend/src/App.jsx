import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthContainer from './components/AuthContainer';
import Dashboard from './pages/Dashboard';
import TripDetails from './pages/TripDetails';
import ItineraryBuilder from './pages/ItineraryBuilder';
import TripBudget from './pages/TripBudget';
import PublicTrips from './pages/PublicTrips';
import PublicTripDetails from './pages/PublicTripDetails';
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
        {/* Auth routes */}
        <Route path="/login" element={<AuthContainer initialMode="login" />} />
        <Route path="/register" element={<AuthContainer initialMode="register" />} />

        {/* Public routes (No auth required) */}
        <Route path="/explore" element={<PublicTrips />} />
        <Route path="/public-trips/:tripId" element={<PublicTripDetails />} />
        <Route path="/shared/:token" element={<PublicTripDetails />} />

        {/* Protected routes */}
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

        {/* Fallback route */}
        <Route
          path="*"
          element={
            authService.isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/explore" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
