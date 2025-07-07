import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'am' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {t('app.name')}
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActivePath('/dashboard') 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {t('navigation.dashboard')}
              </Link>
              
              {/* Public pages access */}
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActivePath('/') && location.pathname === '/'
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {t('navigation.home')}
              </Link>
              <Link
                to="/campaigns"
                className={`text-sm font-medium transition-colors ${
                  isActivePath('/campaigns') 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {t('navigation.campaigns')}
              </Link>
              <Link
                to="/events"
                className={`text-sm font-medium transition-colors ${
                  isActivePath('/events') 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {t('navigation.events')}
              </Link>

              {/* Admin-only navigation */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition-colors ${
                    isActivePath('/admin') 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Language toggle */}
              <button
                onClick={toggleLanguage}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {i18n.language === 'en' ? 'አማርኛ' : 'English'}
              </button>

              {/* User menu */}
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors ${
                    isActivePath('/profile') 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {user?.full_name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  {t('navigation.logout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar for dashboard pages */}
      {location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin') ? (
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {location.pathname.startsWith('/admin') ? 'Admin Panel' : t('navigation.dashboard')}
              </h2>
              
              <nav className="space-y-2">
                {location.pathname.startsWith('/dashboard') && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/dashboard'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Overview
                    </Link>
                    <Link
                      to="/dashboard/donations"
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/dashboard/donations'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      My Donations
                    </Link>
                    <Link
                      to="/dashboard/events"
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/dashboard/events'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      My Events
                    </Link>
                  </>
                )}

                {location.pathname.startsWith('/admin') && isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/admin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Overview
                    </Link>
                    <Link
                      to="/admin/users"
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/admin/users'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/campaigns"
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/admin/campaigns'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Campaigns
                    </Link>
                    <Link
                      to="/admin/events"
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/admin/events'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Events
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      ) : (
        /* Full width content for non-dashboard pages */
        <main className="flex-1">
          {children}
        </main>
      )}
    </div>
  );
};

export default PrivateLayout;
