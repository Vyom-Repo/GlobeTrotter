import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Calendar, DollarSign, Share2, Bookmark, ArrowRight, ShieldCheck, Globe, CheckCircle2, Sparkles, Users, Layers, Award } from 'lucide-react';
import authService from '../services/authService';

export default function Landing() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-accent-500 selection:text-white">
      {/* Header / Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-accent-500 text-white flex items-center justify-center shadow-md shadow-accent-200 hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-spin-slow stroke-[1.75]" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Globe<span className="text-accent-500">Trotter</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-sans tracking-widest uppercase font-semibold">
                Smart Multi-City Journey Builder
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              to="/explore"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition px-3.5 py-2 rounded-xl hover:bg-slate-50"
            >
              Explore Public Trips
            </Link>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-accent-200 transition flex items-center space-x-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-accent-600 transition px-3.5 py-2 rounded-xl hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-accent-200 transition flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - Pure White with Subtle Grid Accent */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Soft Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent-50/70 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-accent-50 border border-accent-200/80 px-4 py-1.5 rounded-full text-xs font-bold text-accent-700 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-accent-500" />
            <span>100% Offline Travel Engine · No Third-Party API Keys Needed</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Plan Multi-City Trips <br />
            <span className="bg-gradient-to-r from-accent-600 via-accent-500 to-indigo-600 bg-clip-text text-transparent">
              Effortlessly & Visually
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
            Design multi-stop travel routes, schedule daily activities, calculate exact categorical budgets, and share your visual itinerary across 149 global destinations.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto bg-accent-500 hover:bg-accent-600 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg shadow-accent-200 transition-all duration-200 flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Start Planning Free'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/explore"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-base px-8 py-4 rounded-2xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Compass className="w-5 h-5 text-accent-500" />
              <span>Explore Public Itineraries</span>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>149 Countries & 608 Cities</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>2,432 Local Activities</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Real-Time Budget Warnings</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dataset Statistics Grid */}
      <section className="bg-slate-50/80 border-y border-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="block font-extrabold text-3xl sm:text-4xl text-slate-900">149</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Global Countries</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="block font-extrabold text-3xl sm:text-4xl text-accent-600">608</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Destination Cities</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="block font-extrabold text-3xl sm:text-4xl text-slate-900">2,432</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Tourist Activities</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="block font-extrabold text-3xl sm:text-4xl text-emerald-600">100%</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Offline Data Engine</span>
          </div>
        </div>
      </section>

      {/* Key Feature Cards Grid (Pure White Theme) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-200">
            Everything You Need
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Modern Explorers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything from multi-stop routing to budget tracking and calendar schedules in one fluid platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white border border-slate-200/80 p-8 rounded-3xl space-y-4 hover:border-accent-300 hover:shadow-lg transition-all duration-300 group">
            <div className="w-13 h-13 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-600 border border-accent-100 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Offline Destination Catalog</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Instantly search and discover destinations, cost levels, and top-rated activities with zero external API calls.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-slate-200/80 p-8 rounded-3xl space-y-4 hover:border-accent-300 hover:shadow-lg transition-all duration-300 group">
            <div className="w-13 h-13 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Visual Itinerary Builder</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Drag, assign, and organize activities into daily schedules. Inspect your travel timeline on an interactive calendar.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-slate-200/80 p-8 rounded-3xl space-y-4 hover:border-accent-300 hover:shadow-lg transition-all duration-300 group">
            <div className="w-13 h-13 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Smart Budget Tracking</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Set target budget limits, allocate funds per stop, log expenses by category, and receive automated warning alerts.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-br from-accent-50 via-white to-accent-100 border border-accent-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ready to Build Your Custom Travel Plan?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Join GlobeTrotter today to create multi-stop itineraries, manage budgets, and explore public community travel routes.
          </p>
          <div>
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white font-bold text-base px-8 py-3.5 rounded-2xl shadow-md shadow-accent-200 transition-all duration-200"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Clean White Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-accent-500" />
            <span className="font-bold text-slate-700">GlobeTrotter</span>
            <span>· Smart Trip Planner</span>
          </div>
          <p>© {new Date().getFullYear()} GlobeTrotter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
