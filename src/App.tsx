import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext.tsx';
import { Header } from './components/Header.tsx';
import { GoogleAd } from './components/GoogleAd.tsx';
import { AdConfigManager } from './components/AdConfigManager.tsx';
import { HolidayFormModal } from './components/HolidayFormModal.tsx';
import { CountryFormModal } from './components/CountryFormModal.tsx';
import { Country, Holiday, AdPosition } from './types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar as CalIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  HelpCircle, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Building,
  DollarSign,
  ChevronDown,
  Globe
} from 'lucide-react';

// Main Inner Component to utilize Auth Context
const AppContent: React.FC = () => {
  const { user, dbUser, getToken, isDevAdmin } = useAuth();
  
  // Views: 'home' | 'admin' | 'holiday' | 'country'
  const [currentView, setView] = useState<string>('home');
  const [viewPayload, setViewPayload] = useState<any>(null);
  
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Data State
  const [countries, setCountries] = useState<Country[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [ads, setAds] = useState<AdPosition[]>([]);
  
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingHolidays, setLoadingHolidays] = useState(true);
  const [loadingAds, setLoadingAds] = useState(true);

  // Active filters for Home Search
  const [filterCountry, setFilterCountry] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('2026');
  const [filterType, setFilterType] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Pagination for Results list
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Single Holiday Details View Cache
  const [detailHoliday, setDetailHoliday] = useState<Holiday | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Single Country View Cache
  const [countryHolidays, setCountryHolidays] = useState<Holiday[]>([]);
  const [loadingCountryView, setLoadingCountryView] = useState(false);

  // Admin Modals
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  // Popular countries dropdown state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');

  // Notifications
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 4000);
  };

  const isAdmin = dbUser?.role === 'admin' || (user && isDevAdmin);

  // ---------------------------------------------------------------------------
  // Dark Mode side effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // ---------------------------------------------------------------------------
  // Fetch core lists on load
  // ---------------------------------------------------------------------------
  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const res = await fetch('/api/countries');
      if (res.ok) {
        const data = await res.json();
        setCountries(data);
      }
    } catch (e) {
      console.error("Error fetching countries:", e);
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchAds = async () => {
    setLoadingAds(true);
    try {
      const res = await fetch('/api/ads-positions');
      if (res.ok) {
        const data = await res.json();
        setAds(data);
      }
    } catch (e) {
      console.error("Error fetching ads positions:", e);
    } finally {
      setLoadingAds(false);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchAds();
  }, []);

  // ---------------------------------------------------------------------------
  // Fetch filtered holidays on criteria change
  // ---------------------------------------------------------------------------
  const fetchHolidays = async () => {
    setLoadingHolidays(true);
    try {
      const params = new URLSearchParams();
      if (filterCountry) params.append('countryId', filterCountry);
      if (filterMonth) params.append('month', filterMonth);
      if (filterYear) params.append('year', filterYear);
      if (filterType) params.append('type', filterType);
      if (searchKeyword) params.append('search', searchKeyword);

      const res = await fetch(`/api/holidays?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setHolidays(data);
        setCurrentPage(1); // reset to page 1 on new filter results
      }
    } catch (e) {
      console.error("Error fetching holidays:", e);
    } finally {
      setLoadingHolidays(false);
    }
  };

  useEffect(() => {
    if (currentView === 'home') {
      fetchHolidays();
    }
  }, [filterCountry, filterMonth, filterYear, filterType, searchKeyword, currentView]);

  // ---------------------------------------------------------------------------
  // Fetch individual views
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const loadIndividualViews = async () => {
      if (currentView === 'holiday' && typeof viewPayload === 'number') {
        setLoadingDetail(true);
        try {
          const res = await fetch(`/api/holidays/${viewPayload}`);
          if (res.ok) {
            const data = await res.json();
            setDetailHoliday(data);
          } else {
            setDetailHoliday(null);
          }
        } catch (e) {
          console.error("Error loading holiday detail:", e);
        } finally {
          setLoadingDetail(false);
        }
      } else if (currentView === 'country' && typeof viewPayload === 'string') {
        setLoadingCountryView(true);
        try {
          const res = await fetch(`/api/holidays?countryName=${viewPayload}`);
          if (res.ok) {
            const data = await res.json();
            setCountryHolidays(data);
          }
        } catch (e) {
          console.error("Error loading country public holidays:", e);
        } finally {
          setLoadingCountryView(false);
        }
      }
    };

    loadIndividualViews();
  }, [currentView, viewPayload]);

  // ---------------------------------------------------------------------------
  // HTML5 History SPA Router
  // ---------------------------------------------------------------------------
  const navigate = (viewName: string, payload?: any) => {
    let url = '/';
    if (viewName === 'admin') {
      url = '/admin';
    } else if (viewName === 'holiday' && typeof payload === 'number') {
      url = `/holiday/${payload}`;
    } else if (viewName === 'country' && typeof payload === 'string') {
      url = `/${payload.toLowerCase().replace(/\s+/g, '-')}-public-holidays`;
    }

    window.history.pushState({}, '', url);
    setView(viewName);
    setViewPayload(payload);
  };

  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '/home') {
        setView('home');
      } else if (path === '/admin') {
        setView('admin');
      } else if (path.startsWith('/holiday/')) {
        const id = path.split('/holiday/')[1];
        if (id) {
          setView('holiday');
          setViewPayload(Number(id));
        }
      } else if (path.endsWith('-public-holidays')) {
        const slug = path.slice(1, -'-public-holidays'.length);
        const cName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        setView('country');
        setViewPayload(cName);
      }
    };

    window.addEventListener('popstate', handleUrlRouting);
    
    // Wait slightly for countries to load first to map URL slugs better on reload
    if (countries.length > 0) {
      handleUrlRouting();
    } else {
      fetchCountries().then(() => handleUrlRouting());
    }

    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, [countries.length]);

  // ---------------------------------------------------------------------------
  // Admin CRUD Functions
  // ---------------------------------------------------------------------------
  const handleHolidaySubmit = async (formData: any) => {
    try {
      const token = await getToken();
      if (!token) {
        showNotice("Auth token expired. Please sign in again.", "error");
        return;
      }

      const method = editingHoliday ? 'PUT' : 'POST';
      const url = editingHoliday ? `/api/holidays/${editingHoliday.id}` : '/api/holidays';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        showNotice(editingHoliday ? "Public holiday updated successfully!" : "Public holiday added successfully!");
        setIsHolidayModalOpen(false);
        setEditingHoliday(null);
        fetchHolidays();
      } else {
        const err = await res.json();
        showNotice(err.error || "Server error occurred", "error");
      }
    } catch (e) {
      console.error(e);
      showNotice("An error occurred during operation.", "error");
    }
  };

  const handleHolidayDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this public holiday?")) return;
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`/api/holidays/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        showNotice("Public holiday deleted successfully!");
        fetchHolidays();
      } else {
        showNotice("Failed to delete holiday.", "error");
      }
    } catch (e) {
      console.error(e);
      showNotice("An error occurred.", "error");
    }
  };

  const handleCountrySubmit = async (formData: any) => {
    try {
      const token = await getToken();
      if (!token) return;

      const method = editingCountry ? 'PUT' : 'POST';
      const url = editingCountry ? `/api/countries/${editingCountry.id}` : '/api/countries';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        showNotice(editingCountry ? "Country updated successfully!" : "Country added successfully!");
        setIsCountryModalOpen(false);
        setEditingCountry(null);
        fetchCountries();
      } else {
        const err = await res.json();
        showNotice(err.error || "Failed to save country.", "error");
      }
    } catch (e) {
      console.error(e);
      showNotice("Error saving country.", "error");
    }
  };

  const handleCountryDelete = async (id: number) => {
    if (!confirm("Deleting a country will delete all associated public holidays. Are you sure?")) return;
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`/api/countries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        showNotice("Country and its public holidays deleted!");
        fetchCountries();
        fetchHolidays();
      } else {
        showNotice("Failed to delete country.", "error");
      }
    } catch (e) {
      console.error(e);
      showNotice("Error occurred.", "error");
    }
  };

  const handleUpdateAd = async (id: number, updateData: any) => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`/api/ads-positions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        fetchAds();
      } else {
        showNotice("Failed to save ad configuration.", "error");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ---------------------------------------------------------------------------
  // Rendering Helpers
  // ---------------------------------------------------------------------------
  
  // 1. Pagination slice
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHolidays = holidays.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(holidays.length / itemsPerPage);

  const paginateTo = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Compute next 3 upcoming holidays (relative to July 2026 - local time mock or system time)
  const getUpcomingHolidays = () => {
    return holidays.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300 font-sans flex flex-col">
      <Header 
        currentView={currentView} 
        setView={(v) => navigate(v)} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
      />

      {/* Floating Notice Banner */}
      <AnimatePresence>
        {notice && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl border shadow-lg text-sm font-semibold max-w-md ${notice.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/80 border-rose-500/20 text-rose-800 dark:text-rose-300'}`}
          >
            {notice.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
            <span>{notice.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Top Banner Ad PlaceHolder */}
        <GoogleAd positionKey="top_banner" ads={ads} className="w-full" />

        <AnimatePresence mode="wait">
          {/* ===================================================================
              VIEW 1: HOME PAGE
              =================================================================== */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Hero Banner Section */}
              <div className="text-center space-y-3 py-4 max-w-3xl mx-auto">
                <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-zinc-900 dark:text-white leading-tight">
                  Find public holidays across all <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">African countries</span> in seconds.
                </h2>
                <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
                  Search, filter, and plan your schedules around African national observances, religious feasts, and public holidays with travel-optimized guides.
                </p>
              </div>

              {/* Popular Country Holiday Calendars Dropdown */}
              <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Popular Country Holiday Calendars
                    </h3>
                    <p className="text-xs text-zinc-400">Select any African nation to view its complete 2026 holiday schedule, travel insights, and national observances.</p>
                  </div>

                  <div className="relative w-full md:w-80">
                    <button
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 text-xs font-semibold bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-xl hover:border-emerald-600 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer text-zinc-800 dark:text-zinc-200"
                      id="country-dropdown-btn"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Explore Country Calendars...</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isCountryDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => {
                              setIsCountryDropdownOpen(false);
                              setCountrySearchQuery('');
                            }} 
                          />
                          
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="absolute right-0 left-0 mt-2 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden flex flex-col"
                          >
                            <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
                              <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                                <input
                                  type="text"
                                  placeholder="Search 54 African countries..."
                                  value={countrySearchQuery}
                                  onChange={(e) => setCountrySearchQuery(e.target.value)}
                                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-900 dark:text-zinc-100"
                                  autoFocus
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>

                            <div className="max-h-64 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
                              {countries
                                .filter(c => c.countryName.toLowerCase().includes(countrySearchQuery.toLowerCase()))
                                .map(c => (
                                  <button
                                    key={c.id}
                                    onClick={() => {
                                      navigate('country', c.countryName);
                                      setIsCountryDropdownOpen(false);
                                      setCountrySearchQuery('');
                                    }}
                                    className="w-full px-4 py-2 text-xs font-medium text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center justify-between cursor-pointer"
                                    id={`dropdown-item-country-${c.code}`}
                                  >
                                    <span className="flex items-center gap-2.5">
                                      <span className="text-base">{c.flag}</span>
                                      <span className="text-zinc-800 dark:text-zinc-200">{c.countryName}</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-zinc-400">{c.code}</span>
                                  </button>
                                ))}
                              
                              {countries.filter(c => c.countryName.toLowerCase().includes(countrySearchQuery.toLowerCase())).length === 0 && (
                                <div className="px-4 py-3 text-xs text-zinc-400 text-center">
                                  No countries match "{countrySearchQuery}"
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Search and Filters Bento Grid */}
              <div className="bg-emerald-900 dark:bg-zinc-900/60 border border-emerald-800/10 dark:border-zinc-800 rounded-2xl p-6 shadow-md space-y-4 text-white">
                <h3 className="font-display font-semibold text-sm text-emerald-100 dark:text-zinc-100 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-300" />
                  Filter African Public Holidays
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-zinc-900 dark:text-zinc-100">
                  {/* Holiday Name Search input */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search holiday name..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
                      id="search-name-input"
                    />
                  </div>

                  {/* Country filter */}
                  <div>
                    <select
                      value={filterCountry}
                      onChange={(e) => setFilterCountry(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
                      id="filter-country-select"
                    >
                      <option value="">All Countries</option>
                      {countries.map(c => (
                        <option key={c.id} value={c.id}>{c.flag} {c.countryName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Month filter */}
                  <div>
                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
                      id="filter-month-select"
                    >
                      <option value="">All Months</option>
                      {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Year filter */}
                  <div>
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
                      id="filter-year-select"
                    >
                      <option value="">All Years</option>
                      {[2025, 2026, 2027, 2028].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  {/* Type filter */}
                  <div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-zinc-900 dark:text-zinc-100"
                      id="filter-type-select"
                    >
                      <option value="">All Types</option>
                      <option value="Public">Public Holidays</option>
                      <option value="Religious">Religious Feasts</option>
                      <option value="National">National/State Days</option>
                      <option value="Observance">Observance Only</option>
                    </select>
                  </div>
                </div>

                {/* Filter Clear button if any selected */}
                {(filterCountry || filterMonth || filterType || searchKeyword || filterYear !== '2026') && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setFilterCountry('');
                        setFilterMonth('');
                        setFilterYear('2026');
                        setFilterType('');
                        setSearchKeyword('');
                      }}
                      className="text-[11px] font-semibold text-rose-300 hover:text-rose-100 flex items-center gap-1 cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Main Holiday Listings & Sidebars */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* 1. Main Listings Results Table */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                    <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <h3 className="font-display font-semibold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                        <CalIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                        Public Holidays Search Results
                      </h3>
                      <span className="text-[10px] bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono text-zinc-500">
                        Total: {holidays.length}
                      </span>
                    </div>

                    {loadingHolidays ? (
                      <div className="p-12 text-center text-xs text-zinc-500">
                        Loading Africa holiday database...
                      </div>
                    ) : holidays.length === 0 ? (
                      <div className="p-12 text-center text-zinc-500 space-y-2">
                        <HelpCircle className="w-8 h-8 text-zinc-300 mx-auto" />
                        <p className="text-sm font-semibold">No holidays match your filter criteria.</p>
                        <p className="text-xs text-zinc-400">Try clearing some filters or searching for another country.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse" id="results-table">
                          <thead>
                            <tr className="bg-zinc-50 dark:bg-zinc-950 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 border-b border-zinc-200/50 dark:border-zinc-800">
                              <th className="px-6 py-3">Holiday</th>
                              <th className="px-6 py-3">Date</th>
                              <th className="px-6 py-3">Day</th>
                              <th className="px-6 py-3">Country</th>
                              <th className="px-4 py-3">Type</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 text-xs">
                            {currentHolidays.map((h, idx) => (
                              <React.Fragment key={h.id}>
                                {/* Insert the Ad placeholder dynamically after every 3 results if configured */}
                                {idx > 0 && idx % 3 === 0 && (
                                  <tr className="bg-neutral-50/50 dark:bg-zinc-950/20">
                                    <td colSpan={6} className="p-4 border-t border-b border-zinc-100 dark:border-zinc-800">
                                      <GoogleAd positionKey="results_between" ads={ads} className="border-none shadow-none" />
                                    </td>
                                  </tr>
                                )}
                                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-colors">
                                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                                    <button 
                                      onClick={() => navigate('holiday', h.id)}
                                      className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline cursor-pointer text-left font-display font-medium"
                                    >
                                      {h.holidayName}
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-medium">
                                    {/* Format date representation nicely */}
                                    {new Date(h.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                  </td>
                                  <td className="px-6 py-4 font-mono text-zinc-400 text-[11px]">{h.day}</td>
                                  <td className="px-6 py-4 font-medium flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                                    <span>{h.countryFlag}</span>
                                    <button 
                                      onClick={() => navigate('country', h.countryName)} 
                                      className="hover:underline cursor-pointer"
                                    >
                                      {h.countryName}
                                    </button>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${h.type === 'Public' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' : h.type === 'Religious' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400'}`}>
                                      {h.type}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button 
                                        onClick={() => navigate('holiday', h.id)}
                                        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                                      >
                                        Details <ArrowRight className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          Showing <strong className="text-zinc-900 dark:text-zinc-200">{indexOfFirstItem + 1}</strong> to <strong className="text-zinc-900 dark:text-zinc-200">{Math.min(indexOfLastItem, holidays.length)}</strong> of <strong className="text-zinc-900 dark:text-zinc-200">{holidays.length}</strong> public holidays
                        </span>
                        
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => paginateTo(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          
                          {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => paginateTo(i + 1)}
                              className={`px-3 py-1 text-xs rounded-lg font-semibold cursor-pointer ${currentPage === i + 1 ? 'bg-emerald-600 text-white' : 'border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300'}`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => paginateTo(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Sidebars */}
                <div className="space-y-6">
                  {/* Latest holidays / Next upcoming card */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
                    <h3 className="font-display font-semibold text-sm text-zinc-900 dark:text-white mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Upcoming in Africa
                    </h3>
                    
                    <div className="space-y-3">
                      {getUpcomingHolidays().map(h => (
                        <div 
                          key={h.id} 
                          className="border-b border-zinc-100 dark:border-zinc-800 last:border-none pb-2.5 last:pb-0 flex justify-between items-start"
                        >
                          <div>
                            <button
                              onClick={() => navigate('holiday', h.id)}
                              className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 text-left hover:underline block"
                            >
                              {h.holidayName}
                            </button>
                            <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-0.5">
                              <span>{h.countryFlag}</span>
                              <span>{h.countryName}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 block font-semibold">
                              {new Date(h.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </span>
                            <span className="text-[9px] text-zinc-400 uppercase">{h.day.slice(0, 3)}</span>
                          </div>
                        </div>
                      ))}
                      {holidays.length === 0 && (
                        <span className="text-xs text-zinc-400">Loading schedules...</span>
                      )}
                    </div>
                  </div>

                  {/* Sidebar Ad Slot */}
                  <GoogleAd positionKey="sidebar" ads={ads} className="w-full h-full" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ===================================================================
              VIEW 2: COUNTRY SPECIFIC PUBLIC HOLIDAYS
              =================================================================== */}
          {currentView === 'country' && (
            <motion.div
              key="country"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Back breadcrumb */}
              <button 
                onClick={() => navigate('home')} 
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Holiday Finder
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                  {/* Hero headers */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-8 -mt-8"></div>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl sm:text-5xl">{countries.find(c => c.countryName === viewPayload)?.flag || "🌍"}</span>
                      <div>
                        <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-white">
                          {viewPayload} Public Holidays 2026
                        </h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          Explore the officially recognized national, religious, and public holidays across {viewPayload}.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Country Holidays List */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
                    <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                      <h3 className="font-display font-semibold text-sm">Official Holiday Schedule</h3>
                    </div>

                    {loadingCountryView ? (
                      <div className="p-12 text-center text-xs text-zinc-500">
                        Querying country schedule...
                      </div>
                    ) : countryHolidays.length === 0 ? (
                      <div className="p-12 text-center text-zinc-400 text-xs">
                        No holidays currently listed for {viewPayload}.
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                        {countryHolidays.map(h => (
                          <div 
                            key={h.id} 
                            className="p-6 hover:bg-zinc-50/40 dark:hover:bg-zinc-950/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-base text-zinc-900 dark:text-white">{h.holidayName}</span>
                                <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${h.type === 'Public' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                                  {h.type}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">{h.description}</p>
                            </div>

                            <div className="text-left sm:text-right flex-shrink-0 bg-zinc-50 dark:bg-zinc-800/40 p-3 sm:p-0 sm:bg-transparent rounded-xl flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                                {new Date(h.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </span>
                              <span className="text-xs text-zinc-400 font-mono capitalize">{h.day}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Travel Tips Info */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-3">
                    <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Travel Planner Tip
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Banks, government offices, and many commercial operations in <strong>{viewPayload}</strong> remain closed on Public holidays. Plan passport submissions and bank transactions accordingly!
                    </p>
                  </div>

                  {/* Sidebar Ad Placement */}
                  <GoogleAd positionKey="sidebar" ads={ads} />
                </div>
              </div>
            </motion.div>
          )}

          {/* ===================================================================
              VIEW 3: HOLIDAY DETAILS VIEW PAGE
              =================================================================== */}
          {currentView === 'holiday' && (
            <motion.div
              key="holiday"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-3xl mx-auto"
            >
              {/* Back button */}
              <button 
                onClick={() => navigate('home')} 
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Calendar
              </button>

              {loadingDetail ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-xs text-zinc-400">
                  Loading holiday profile...
                </div>
              ) : !detailHoliday ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-xs text-zinc-400">
                  Holiday details not found.
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                  {/* Top Header Card decoration */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-700 dark:to-teal-600 p-8 text-white relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12"></div>
                    
                    <span className="text-xs font-mono tracking-widest uppercase bg-white/20 px-2.5 py-1 rounded font-semibold">
                      {detailHoliday.type} Holiday
                    </span>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 tracking-tight">{detailHoliday.holidayName}</h2>
                    
                    <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-white/90">
                      <span className="text-lg">{detailHoliday.countryFlag}</span>
                      <button 
                        onClick={() => navigate('country', detailHoliday.countryName)}
                        className="hover:underline hover:text-white"
                      >
                        {detailHoliday.countryName}
                      </button>
                    </div>
                  </div>

                  {/* Information Fields */}
                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Date Observed</span>
                        <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                          {new Date(detailHoliday.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Day of the Week</span>
                        <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
                          {detailHoliday.day}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">History & Reason</span>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {detailHoliday.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                      <span>Observed status: <strong>{detailHoliday.isPublic ? 'National Public Holiday' : 'Optional Observance'}</strong></span>
                      <span className="font-mono">ID: {detailHoliday.id}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ===================================================================
              VIEW 4: ADMIN DASHBOARD (CRUD)
              =================================================================== */}
          {currentView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {!isAdmin ? (
                <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-2xl text-center space-y-3 max-w-md mx-auto">
                  <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                  <h3 className="font-display font-semibold text-base text-rose-800 dark:text-rose-400">Unauthorized Access</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    The admin dashboard is restricted. Please sign in with Google or toggle the "Admin simulation mode" in the bar above.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Dashboard stats row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
                      <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl"><Building className="w-6 h-6" /></div>
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Countries</span>
                        <p className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-50">{countries.length}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
                      <div className="bg-teal-500/10 text-teal-600 dark:text-teal-400 p-3 rounded-xl"><CalIcon className="w-6 h-6" /></div>
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Schedules Managed</span>
                        <p className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-50">{holidays.length}</p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
                      <div className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl"><DollarSign className="w-6 h-6" /></div>
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">CPC Ad Placements</span>
                        <p className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-50">{ads.filter(a=>a.isActive).length} / {ads.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ad Placements config */}
                  <AdConfigManager ads={ads} onUpdateAd={handleUpdateAd} />

                  {/* Double Table Split: Countries & Holidays */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Split 1: Countries CRUD (1 column) */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs flex flex-col">
                      <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <h3 className="font-display font-semibold text-sm">Countries List</h3>
                        <button
                          onClick={() => {
                            setEditingCountry(null);
                            setIsCountryModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 cursor-pointer"
                          id="btn-add-country"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Country
                        </button>
                      </div>

                      <div className="divide-y divide-zinc-100 dark:divide-zinc-800 flex-1 overflow-y-auto max-h-[400px]">
                        {countries.map(c => (
                          <div key={c.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{c.flag}</span>
                              <div>
                                <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">{c.countryName}</h4>
                                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">{c.code}</span>
                              </div>
                            </div>

                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setEditingCountry(c);
                                  setIsCountryModalOpen(true);
                                }}
                                className="p-1 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded cursor-pointer"
                                title="Edit Country"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleCountryDelete(c.id)}
                                className="p-1 text-zinc-500 hover:text-rose-500 rounded cursor-pointer"
                                title="Delete Country"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Split 2: Holidays CRUD (2 columns) */}
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs flex flex-col">
                      <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <h3 className="font-display font-semibold text-sm">Holidays List</h3>
                        <button
                          onClick={() => {
                            setEditingHoliday(null);
                            setIsHolidayModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 cursor-pointer"
                          id="btn-add-holiday"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Holiday
                        </button>
                      </div>

                      <div className="overflow-x-auto flex-1 max-h-[400px]">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-zinc-50 dark:bg-zinc-950 text-[10px] font-bold text-zinc-400 uppercase tracking-wider sticky top-0 border-b border-zinc-200/50 dark:border-zinc-800">
                            <tr>
                              <th className="px-5 py-3">Holiday Name</th>
                              <th className="px-5 py-3">Date</th>
                              <th className="px-5 py-3">Country</th>
                              <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {holidays.map(h => (
                              <tr key={h.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20">
                                <td className="px-5 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">{h.holidayName}</td>
                                <td className="px-5 py-3.5 font-mono text-zinc-500 dark:text-zinc-400">{h.date}</td>
                                <td className="px-5 py-3.5 text-zinc-500 dark:text-zinc-400">{h.countryFlag} {h.countryName}</td>
                                <td className="px-5 py-3.5 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      onClick={() => {
                                        setEditingHoliday(h);
                                        setIsHolidayModalOpen(true);
                                      }}
                                      className="p-1 text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded cursor-pointer"
                                      title="Edit Holiday"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleHolidayDelete(h.id)}
                                      className="p-1 text-zinc-500 hover:text-rose-500 rounded cursor-pointer"
                                      title="Delete Holiday"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Banner Ad Placement */}
        <GoogleAd positionKey="footer" ads={ads} className="w-full mt-12" />

      </main>

      {/* Footer Area */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-xs text-zinc-500">
          <div>
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-300">Africa Holidays Calendar © 2026</h4>
            <p className="mt-1">Organic evergreen traffic guides. Designed similar to modern, high-speed travel portals.</p>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center font-semibold font-display">
            <button onClick={() => navigate('home')} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">Sitemap Paths</button>
            <a href="/robots.txt" target="_blank" className="hover:text-emerald-600 dark:hover:text-emerald-400">Robots.txt</a>
            <a href="/sitemap.xml" target="_blank" className="hover:text-emerald-600 dark:hover:text-emerald-400">Sitemap.xml</a>
          </div>
        </div>
      </footer>

      {/* Admin CRUD Modals */}
      <HolidayFormModal
        isOpen={isHolidayModalOpen}
        onClose={() => {
          setIsHolidayModalOpen(false);
          setEditingHoliday(null);
        }}
        onSubmit={handleHolidaySubmit}
        holiday={editingHoliday}
        countries={countries}
      />

      <CountryFormModal
        isOpen={isCountryModalOpen}
        onClose={() => {
          setIsCountryModalOpen(false);
          setEditingCountry(null);
        }}
        onSubmit={handleCountrySubmit}
        country={editingCountry}
      />
    </div>
  );
};

// Top Root Provider wrapper
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
