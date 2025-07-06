import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t } = useTranslation(['navigation', 'auth']);
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarItems = [
    {
      name: t('navigation:dashboard'),
      href: '/admin',
      icon: '📊',
      current: location.pathname === '/admin',
    },
    {
      name: t('navigation:userManagement'),
      href: '/admin/users',
      icon: '👥',
      current: location.pathname.startsWith('/admin/users'),
    },
    {
      name: t('navigation:campaignManagement'),
      href: '/admin/campaigns',
      icon: '🎯',
      current: location.pathname.startsWith('/admin/campaigns'),
    },
    {
      name: t('navigation:eventManagement'),
      href: '/admin/events',
      icon: '📅',
      current: location.pathname.startsWith('/admin/events'),
    },
    {
      name: t('navigation:contentManagement'),
      href: '/admin/content',
      icon: '📝',
      current: location.pathname.startsWith('/admin/content'),
    },
    {
      name: t('navigation:mediaManagement'),
      href: '/admin/media',
      icon: '🖼️',
      current: location.pathname.startsWith('/admin/media'),
    },
    {
      name: t('navigation:analytics'),
      href: '/admin/analytics',
      icon: '📈',
      current: location.pathname.startsWith('/admin/analytics'),
    },
    {
      name: t('navigation:systemSettings'),
      href: '/admin/settings',
      icon: '⚙️',
      current: location.pathname.startsWith('/admin/settings'),
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:inset-0'
        )}
      >
        <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
          <Link to="/admin" className="flex items-center">
            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-bold text-lg">G</span>
            </div>
            <span className="ml-2 text-xl font-bold text-white">
              Admin Panel
            </span>
          </Link>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  item.current
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Back to site link */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Link
            to="/"
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <span className="mr-3">🏠</span>
            Back to Site
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className={cn('flex-1', isSidebarOpen ? 'lg:ml-64' : '')}>
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <button
                type="button"
                className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <span className="sr-only">Toggle sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <LanguageSwitcher showLabel={false} />

              {/* User menu */}
              {user && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {user.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                  >
                    {t('auth:logout')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
