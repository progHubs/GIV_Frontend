/**
 * 404 Not Found Page
 * Shown when user navigates to a page that doesn't exist
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from '../theme';
import ModernNavigation from '../components/navigation/ModernNavigation';

const NotFoundPage: React.FC = () => {
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
              {/* 404 Animation */}
              <motion.div variants={itemVariants}>
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.h1 
                    className="text-8xl lg:text-9xl font-bold text-theme-primary opacity-20"
                    animate={{ 
                      scale: [1, 1.02, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    404
                  </motion.h1>
                  
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                  >
                    <div className="w-24 h-24 bg-theme-primary rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Error Message */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-theme-primary">Page Not Found</h2>
                <p className="text-lg text-theme-muted max-w-2xl mx-auto">
                  Oops! The page you're looking for doesn't exist. It might have been moved, deleted, 
                  or you entered the wrong URL.
                </p>
              </motion.div>

              {/* Search Suggestions */}
              <motion.div variants={itemVariants} className="bg-theme-surface rounded-2xl p-8 border border-theme">
                <h3 className="text-xl font-bold text-theme-primary mb-6">What you can do:</h3>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <motion.div 
                    className="space-y-3"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-12 h-12 bg-theme-primary/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-theme-primary">Go Home</h4>
                    <p className="text-theme-muted text-sm">
                      Return to our homepage and explore our mission and programs.
                    </p>
                  </motion.div>

                  <motion.div 
                    className="space-y-3"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-12 h-12 bg-theme-secondary/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-theme-primary">Search</h4>
                    <p className="text-theme-muted text-sm">
                      Use our navigation menu to find campaigns, events, or information.
                    </p>
                  </motion.div>

                  <motion.div 
                    className="space-y-3"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-12 h-12 bg-theme-accent/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-theme-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-theme-primary">Get Help</h4>
                    <p className="text-theme-muted text-sm">
                      Contact our support team if you need assistance finding something.
                    </p>
                  </motion.div>
                </div>
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

                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center justify-center transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Us
                </motion.a>
              </motion.div>

              {/* Popular Links */}
              <motion.div variants={itemVariants} className="pt-8">
                <h3 className="text-lg font-semibold text-theme-primary mb-4">Popular Pages</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { name: 'Campaigns', href: '/campaigns' },
                    { name: 'Events', href: '/events' },
                    { name: 'About Us', href: '/about' },
                    { name: 'Contact', href: '/contact' },
                  ].map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-theme-brand-primary hover:underline font-medium"
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default NotFoundPage;
