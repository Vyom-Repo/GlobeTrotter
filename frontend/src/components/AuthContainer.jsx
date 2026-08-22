import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import AuthLayout from './AuthLayout';
import LoginForm from '../pages/Login';
import RegisterForm from '../pages/Register';

export default function AuthContainer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Mode state: false = Login active, true = Register active
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/register');
  // Displayed content mode to prevent text overlap during slide
  const [displayMode, setDisplayMode] = useState(location.pathname === '/register' ? 'register' : 'login');

  useEffect(() => {
    const isRegister = location.pathname === '/register';
    setIsSignUp(isRegister);
    // Sync display content with route
    const timer = setTimeout(() => {
      setDisplayMode(isRegister ? 'register' : 'login');
    }, 250);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleSwitchToRegister = () => {
    setIsSignUp(true);
    // Switch content cleanly
    setTimeout(() => setDisplayMode('register'), 250);
    navigate('/register', { replace: true });
  };

  const handleSwitchToLogin = () => {
    setIsSignUp(false);
    // Switch content cleanly
    setTimeout(() => setDisplayMode('login'), 250);
    navigate('/login', { replace: true });
  };

  return (
    <AuthLayout subtitle="Plan, organize, and budget multi-city trips effortlessly with GlobeTrotter.">
      {/* Master 2-Column Authentication Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-accent-200/40 border border-accent-100 relative overflow-hidden min-h-[620px] md:min-h-[660px] flex flex-col md:flex-row">
        
        {/* ======================================================== */}
        {/* COLUMN 1 / PANEL A: VISUAL BLUE OVERLAY PANEL            */}
        {/* Width: 50% on Desktop, sits side-by-side with Form Panel  */}
        {/* ======================================================== */}
        <div
          className={`
            w-full md:w-1/2 min-h-[220px] md:min-h-[660px]
            bg-gradient-to-br from-accent-600 via-accent-500 to-accent-700 text-white shadow-xl
            auth-panel-transition flex flex-col justify-center items-center p-6 sm:p-10 text-center z-20
            ${isSignUp 
              ? 'md:translate-x-full md:rounded-l-[36px] md:rounded-r-none' 
              : 'md:translate-x-0 md:rounded-r-[36px] md:rounded-l-none'}
          `}
        >
          {/* Inner Content of Visual Panel */}
          <div className="w-full max-w-sm flex items-center justify-center min-h-[240px] sm:min-h-[280px]">
            
            {displayMode === 'login' ? (
              /* Visual Content for LOGIN State (Prompting to Register) */
              <div className="w-full flex flex-col items-center justify-center space-y-5 animate-fadeIn">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
                  <Compass className="w-8 h-8 text-white animate-spin-slow stroke-[1.5]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-semibold italic text-white tracking-tight">
                    Welcome Back!
                  </h3>
                  <p className="text-xs sm:text-sm text-accent-50 italic font-normal leading-relaxed max-w-xs">
                    Don't have an account yet? Register now to design multi-city travel routes, track expenses, and build visual itineraries.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSwitchToRegister}
                  className="
                    px-7 py-3 rounded-2xl border-2 border-white text-white font-medium italic tracking-wider text-xs uppercase
                    hover:bg-white hover:text-accent-700 active:scale-95 transition-all duration-300 shadow-md
                    flex items-center space-x-2 group focus:outline-none focus:ring-4 focus:ring-white/40
                  "
                >
                  <span>CREATE ACCOUNT</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              /* Visual Content for REGISTER State (Prompting to Sign In) */
              <div className="w-full flex flex-col items-center justify-center space-y-5 animate-fadeIn">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
                  <Compass className="w-8 h-8 text-white stroke-[1.5]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-semibold italic text-white tracking-tight">
                    Already Registered?
                  </h3>
                  <p className="text-xs sm:text-sm text-accent-50 italic font-normal leading-relaxed max-w-xs">
                    To keep connected with your saved trips, budget analytics, and travel notes, please log in with your account.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSwitchToLogin}
                  className="
                    px-7 py-3 rounded-2xl border-2 border-white text-white font-medium italic tracking-wider text-xs uppercase
                    hover:bg-white hover:text-accent-700 active:scale-95 transition-all duration-300 shadow-md
                    flex items-center space-x-2 group focus:outline-none focus:ring-4 focus:ring-white/40
                  "
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>SIGN IN</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2 / PANEL B: AUTHENTICATION FORM PANEL            */}
        {/* Width: 50% on Desktop, sits side-by-side with Blue Panel  */}
        {/* ======================================================== */}
        <div
          className={`
            w-full md:w-1/2 min-h-[560px] md:min-h-[660px]
            auth-panel-transition flex items-center justify-center p-4 sm:p-8 z-10 bg-white
            ${isSignUp ? 'md:-translate-x-full' : 'md:translate-x-0'}
          `}
        >
          <div className="w-full max-w-md flex items-center justify-center min-h-[520px]">
            
            {displayMode === 'login' ? (
              <div className="w-full flex items-center justify-center animate-fadeIn">
                <LoginForm onSwitchToRegister={handleSwitchToRegister} />
              </div>
            ) : (
              <div className="w-full flex items-center justify-center animate-fadeIn">
                <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
              </div>
            )}

          </div>
        </div>

      </div>
    </AuthLayout>
  );
}
