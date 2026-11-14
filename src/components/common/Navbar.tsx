import React, { useState } from 'react';
import {
  Sprout,
  ShoppingCart,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Layers,
  Database,
  Search,
  Building2,
  Wheat,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuthModal: (role?: 'farmer' | 'consumer', mode?: 'register' | 'login') => void;
  openCartDrawer: () => void;
  openNotificationDrawer: () => void;
  openDatabaseModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openAuthModal,
  openCartDrawer,
  openNotificationDrawer,
  openDatabaseModal,
  searchQuery,
  setSearchQuery,
}) => {
  const {
    currentUser,
    userRole,
    logout,
    cart,
    unreadNotificationsCount,
  } = useStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top Announcement & Database Access */}
      <div className="bg-forest-900 text-forest-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest-700 text-white">
            DIRECT FARM-TO-CONSUMER
          </span>
          <span className="hidden sm:inline text-forest-200">
            Zero Middlemen • 100% Genuine Farmer Listings • Fair Prices
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Database & Schema status modal button */}
          <button
            onClick={openDatabaseModal}
            className="flex items-center gap-1 text-[11px] text-forest-200 hover:text-white transition"
            title="Database configuration and Supabase schema"
          >
            <Database className="w-3.5 h-3.5 text-forest-400" />
            <span className="hidden md:inline">Database & SQL</span>
          </button>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2.5 group focus:outline-hidden text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold tracking-tight text-forest-900">
                  Farm<span className="text-forest-600">Connect</span>
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-forest-500"></span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider -mt-1">
                Direct Agricultural Market
              </p>
            </div>
          </button>

          {/* Search bar (Quick crop discovery) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Tomato, Onion, Ponni Rice, Potato, Carrots..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentTab !== 'marketplace') {
                    setCurrentTab('marketplace');
                  }
                }}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-full focus:outline-hidden focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('marketplace')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'marketplace'
                  ? 'bg-forest-50 text-forest-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Browse Crops
            </button>

            {userRole === 'farmer' && (
              <button
                onClick={() => setCurrentTab('farmer-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'farmer-dashboard'
                    ? 'bg-forest-600 text-white font-semibold'
                    : 'text-forest-700 bg-forest-50 hover:bg-forest-100'
                }`}
              >
                <Wheat className="w-4 h-4" />
                Farmer Dashboard
              </button>
            )}

            {userRole === 'consumer' && (
              <button
                onClick={() => setCurrentTab('my-orders')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentTab === 'my-orders'
                    ? 'bg-forest-50 text-forest-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                My Orders
              </button>
            )}

            {userRole === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'admin-dashboard'
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </button>
            )}

            <button
              onClick={() => setCurrentTab('regional-hubs')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                currentTab === 'regional-hubs'
                  ? 'bg-forest-50 text-forest-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-forest-600" />
              Regional Hubs
            </button>
          </nav>

          {/* Action icons & User profile */}
          <div className="flex items-center gap-2">
            {/* Notifications Button */}
            <button
              onClick={openNotificationDrawer}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition focus:outline-hidden"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={openCartDrawer}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition focus:outline-hidden"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-forest-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* User Profile / Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition focus:outline-hidden"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-forest-500/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-sm">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-semibold text-slate-800">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide bg-forest-100 text-forest-800">
                        {userRole}
                      </span>
                    </div>

                    {userRole === 'farmer' && (
                      <>
                        <button
                          onClick={() => setCurrentTab('farmer-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Wheat className="w-4 h-4 text-forest-600" />
                          Farmer Dashboard
                        </button>
                        <button
                          onClick={() => setCurrentTab('farmer-profile')}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          Farm Profile & Bank Info
                        </button>
                      </>
                    )}

                    {userRole === 'consumer' && (
                      <>
                        <button
                          onClick={() => setCurrentTab('my-orders')}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Layers className="w-4 h-4 text-forest-600" />
                          My Orders & Live Tracking
                        </button>
                        <button
                          onClick={() => setCurrentTab('consumer-profile')}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          Delivery Addresses & Profile
                        </button>
                      </>
                    )}

                    {userRole === 'admin' && (
                      <button
                        onClick={() => setCurrentTab('admin-dashboard')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        Admin Control Panel
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('consumer', 'login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('consumer')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-forest-700 bg-forest-50 hover:bg-forest-100 rounded-lg transition"
                >
                  Join as Consumer
                </button>
                <button
                  onClick={() => openAuthModal('farmer')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-forest-600 hover:bg-forest-700 rounded-lg shadow-xs hover:shadow transition"
                >
                  Join as Farmer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
