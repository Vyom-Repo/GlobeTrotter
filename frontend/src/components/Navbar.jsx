import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { Compass, LogOut, PlusCircle, MapPin, User as UserIcon } from 'lucide-react';

export default function Navbar({ onCreateTripClick }) {
  const navigate = useNavigate();
  const user = authService.getCachedUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Link to="/dashboard" className="flex items-center space-x-2 text-xl font-bold text-slate-900 hover:opacity-90 transition">
          <div className="bg-blue-600 text-white p-2 rounded-xl">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <span>GlobeTrotter</span>
        </Link>

        <div className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-200">
          <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition">
            My Trips
          </Link>
          <Link to="/cities" className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition">
            Explore Cities
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {onCreateTripClick && (
          <button
            onClick={onCreateTripClick}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-xl transition shadow-sm hover:shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Trip</span>
          </button>
        )}

        {user && (
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700">
              <UserIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
