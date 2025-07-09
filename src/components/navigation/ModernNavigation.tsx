/**
 * Modern Navigation Component
 * Sticky header with responsive design and theme support
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import LoadingLink from '../common/LoadingLink';

const ModernNavigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user from auth context
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsUserDropdownOpen(false); // Close dropdown
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') {
      return '/admin/dashboard';
    }
    return '/profile';
  };

  const getDashboardLabel = () => {
    if (user?.role === 'admin') {
      return 'Admin Dashboard';
    }
    return 'Profile';
  };

  const getNavigationLinks = () => {
    const baseLinks = [
      { name: 'Home', href: '/' },
      { name: 'About Us', href: '/about' },
      { name: 'Programs', href: '/programs' },
      { name: 'Campaigns', href: '/campaigns' },
      { name: 'Events', href: '/events' },
      { name: 'Contact', href: '/contact' },
    ];

    if (!user) {
      return baseLinks;
    }

    return baseLinks;
  };

  const navLinks = getNavigationLinks();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'am', name: 'አማርኛ' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-theme-background/95 backdrop-blur-md shadow-lg border-b border-theme'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div>
            <LoadingLink to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-theme-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-theme-primary">GIV Society</h1>
                <p className="text-xs text-theme-muted">Kind Hearts, Healing Hands</p>
              </div>
            </LoadingLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <div key={link.name} className="relative">
                <LoadingLink
                  to={link.href}
                  className="relative text-theme-primary hover:text-theme-brand-primary transition-colors duration-200 font-medium group"
                >
                  {link.name}
                  <div className="absolute bottom-0 left-0 h-0.5 bg-theme-brand-primary w-0 hover:w-full transition-all duration-300" />
                </LoadingLink>
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="hidden md:block">
              <select className="bg-theme-surface border border-theme rounded-lg px-3 py-1 text-sm text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-primary">
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {!user ? (
                <>
                  <div>
                    <LoadingLink
                      to="/login"
                      className="px-4 py-2 text-theme-primary hover:text-theme-brand-primary transition-colors duration-200 font-medium"
                    >
                      Login
                    </LoadingLink>
                  </div>
                  <div>
                    <LoadingLink
                      to="/register"
                      className="btn-theme-primary px-6 py-2 rounded-lg font-medium"
                    >
                      Register
                    </LoadingLink>
                  </div>
                </>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  {/* User Icon Button */}
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-theme-primary text-white hover:bg-theme-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-theme-surface border border-theme rounded-lg shadow-lg z-50"
                      >
                        <div className="py-2">
                          {/* Dashboard/Profile Link */}
                          <LoadingLink
                            to={getDashboardLink()}
                            className="flex items-center px-4 py-2 text-sm text-theme-primary hover:bg-theme-background transition-colors duration-200"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            {getDashboardLabel()}
                          </LoadingLink>

                          {/* Divider */}
                          <div className="border-t border-theme my-1"></div>

                          {/* Logout Button */}
                          <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoggingOut ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-3"></div>
                                Logging out...
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-4 h-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                  />
                                </svg>
                                Logout
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-theme-primary hover:bg-theme-surface transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-theme-background border-t border-theme">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map(link => (
              <div key={link.name}>
                <LoadingLink
                  to={link.href}
                  className="block text-theme-primary hover:text-theme-brand-primary transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </LoadingLink>
              </div>
            ))}

            <div className="pt-4 border-t border-theme space-y-3">
              {!user ? (
                <>
                  <LoadingLink
                    to="/login"
                    className="block w-full text-left text-theme-primary hover:text-theme-brand-primary transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </LoadingLink>
                  <LoadingLink
                    to="/register"
                    className="block w-full btn-theme-primary py-3 rounded-lg font-medium text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </LoadingLink>
                </>
              ) : (
                <div className="space-y-2">
                  {/* Dashboard/Profile Link */}
                  <LoadingLink
                    to={getDashboardLink()}
                    className="flex items-center w-full text-left text-theme-primary hover:text-theme-brand-primary transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {getDashboardLabel()}
                  </LoadingLink>

                  {/* Logout Button */}
                  <button
                    className="flex items-center w-full text-left text-red-600 hover:text-red-700 transition-colors duration-200 font-medium py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-3"></div>
                        Logging out...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ModernNavigation;
