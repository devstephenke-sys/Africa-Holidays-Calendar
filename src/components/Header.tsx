import React from 'react';
import { useAuth } from './AuthContext.tsx';
import { Calendar, Sun, Moon, LogIn, LogOut, ShieldAlert, Globe } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, darkMode, setDarkMode }) => {
  const { user, dbUser, signIn, signOut, isDevAdmin, setIsDevAdmin } = useAuth();

  const isAdmin = dbUser?.role === 'admin' || (user && isDevAdmin);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <button 
            onClick={() => setView('home')} 
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            id="brand-logo"
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                AfricaHolidays
              </h1>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">The Continent's Calendar</p>
            </div>
          </button>

          {/* Navigation & Controls */}
          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => setView('home')}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${currentView === 'home' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
              >
                Find Holidays
              </button>
              
              {user && (
                <button 
                  onClick={() => setView('admin')}
                  className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${currentView === 'admin' ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-emerald-900 dark:hover:text-zinc-100'}`}
                >
                  <Globe className="w-4 h-4" />
                  Admin Dashboard
                </button>
              )}
            </nav>

            <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-3 sm:pl-6">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                id="theme-toggle"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Authentication Status */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[120px]">
                      {user.displayName || user.email}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono capitalize">
                      {isAdmin ? 'Admin' : 'User'}
                    </p>
                  </div>
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="User avatar" 
                      className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={signOut}
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Sign Out"
                    id="sign-out-btn"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Developer Admin Simulation banner */}
      {user && dbUser && dbUser.role !== 'admin' && (
        <div className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-t border-b border-emerald-500/20">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>
              Signed in as <strong>{user.email}</strong>. The backend verified you as a standard **User**, but for preview testing, <strong>Admin simulation mode is active</strong>.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer font-medium selection:bg-transparent">
              <input 
                type="checkbox" 
                checked={isDevAdmin}
                onChange={(e) => setIsDevAdmin(e.target.checked)}
                className="rounded border-emerald-400 text-emerald-500 focus:ring-emerald-500/40 w-3.5 h-3.5"
              />
              Enable Full Admin CRUD Features
            </label>
          </div>
        </div>
      )}
    </header>
  );
};
