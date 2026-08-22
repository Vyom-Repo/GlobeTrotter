import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Calendar, DollarSign, Share2, Bookmark, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import authService from '../services/authService';

export default function Landing() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Header / Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-2xl shadow-lg shadow-blue-500/30">
            <Compass className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">GlobeTrotter</span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/explore"
            className="text-sm font-medium text-slate-300 hover:text-white transition px-4 py-2 rounded-xl hover:bg-slate-800/60"
          >
            Explore Trips
          </Link>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition px-4 py-2 rounded-xl hover:bg-slate-800/60"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-400">
            <Globe className="w-3.5 h-3.5" />
            <span>Offline-First Global Travel Platform</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Plan Your Next Adventure <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Without Limits
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
            Discover destinations across 149 countries, build day-by-day itineraries, track budgets, and share your journey seamlessly.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base px-8 py-3.5 rounded-2xl shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Start Planning Free'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/explore"
              className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base px-8 py-3.5 rounded-2xl transition flex items-center justify-center space-x-2"
            >
              <Compass className="w-5 h-5 text-blue-400" />
              <span>Explore Public Trips</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-3xl space-y-3 hover:border-blue-500/40 transition">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Global Offline Dataset</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Explore 149 countries, 608 cities, and over 2,400 activities with zero dependency on third-party APIs.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-3xl space-y-3 hover:border-blue-500/40 transition">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Day-Wise Itinerary Builder</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Organize stops, schedule activities, drag and reorder items by day with seamless date validation.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-3xl space-y-3 hover:border-blue-500/40 transition">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Budget & Expenses</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Set trip budget limits, track categorical expenses (Accommodation, Food, Transport), and prevent overspending.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-slate-500 text-xs">
        <p>© 2026 GlobeTrotter. All rights reserved.</p>
      </footer>
    </div>
  );
}
