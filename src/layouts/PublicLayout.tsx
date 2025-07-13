import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'am' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Force a complete page reload to ensure all state is cleared
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, force reload to clear state
      window.location.href = '/login';
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{t('app.name')}</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActivePath('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {t('navigation.home')}
              </Link>
              <Link
                to="/campaigns"
                className={`text-sm font-medium transition-colors ${
                  isActivePath('/campaigns') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {t('navigation.campaigns')}
              </Link>
              <Link
                to="/events"
                className={`text-sm font-medium transition-colors ${
                  isActivePath('/events') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {t('navigation.events')}
              </Link>
              <Link
                to="/posts"
                className={`text-sm font-medium transition-colors ${
                  isActivePath('/posts') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {t('navigation.posts')}
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors ${
                  isActivePath('/about') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {t('navigation.about')}
              </Link>
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

              {/* Auth buttons */}
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {user.full_name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                  >
                    {t('navigation.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {t('navigation.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    {t('navigation.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="text-xl font-bold">{t('app.name')}</span>
              </div>
              <p className="text-gray-400 mb-4">{t('app.tagline')}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t('navigation.home')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/campaigns"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t('navigation.campaigns')}
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="text-gray-400 hover:text-white transition-colors">
                    {t('navigation.events')}
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                    {t('navigation.blog')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t('navigation.contact')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    {t('navigation.about')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    {t('navigation.contact')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 {t('app.name')}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
