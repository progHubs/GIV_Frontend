/**
 * Unauthorized Page
 * Shown when user tries to access a page they don't have permission for
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from '../theme';
import ModernNavigation from '../components/navigation/ModernNavigation';

const UnauthorizedPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-theme-background">
        <ModernNavigation />
        
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Error Icon */}
              <motion.div variants={itemVariants}>
                <motion.div 
                  className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Error Message */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-theme-primary">403</h1>
                <h2 className="text-2xl lg:text-3xl font-bold text-theme-primary">Access Denied</h2>
                <p className="text-lg text-theme-muted max-w-2xl mx-auto">
                  You don't have permission to access this page. Please contact an administrator if you believe this is an error.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-theme-primary px-8 py-3 rounded-lg font-semibold inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go Home
                </motion.a>
                
                <motion.button
                  onClick={() => window.history.back()}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-theme-secondary px-8 py-3 rounded-lg font-semibold inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </motion.button>
              </motion.div>

              {/* Help Section */}
              <motion.div variants={itemVariants} className="bg-theme-surface rounded-2xl p-8 border border-theme">
                <h3 className="text-xl font-bold text-theme-primary mb-4">Need Help?</h3>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold text-theme-primary mb-2">For Users</h4>
                    <p className="text-theme-muted text-sm">
                      If you're a registered user and believe you should have access to this page, 
                      please contact our support team.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-theme-primary mb-2">For Administrators</h4>
                    <p className="text-theme-muted text-sm">
                      If you're an administrator experiencing access issues, 
                      please check your role permissions or contact technical support.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-theme">
                  <motion.a
                    href="/contact"
                    whileHover={{ scale: 1.02 }}
                    className="text-theme-brand-primary hover:underline font-medium"
                  >
                    Contact Support →
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default UnauthorizedPage;
