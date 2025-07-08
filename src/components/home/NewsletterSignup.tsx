/**
 * Newsletter Signup Section
 * Capture leads for ongoing engagement
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  if (isSubscribed) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-r from-green-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="space-y-6"
          >
            <motion.div
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1 }}
            >
              <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Thank You!</h2>
            <p className="text-xl text-white/90">
              You've successfully subscribed to our newsletter. Get ready for inspiring stories and
              updates!
            </p>
            <motion.button
              onClick={() => setIsSubscribed(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe Another Email
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-green-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Stay Connected with Our Mission
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto"
            >
              Get the latest updates on our healthcare initiatives, success stories, and
              opportunities to make a difference in communities worldwide.
            </motion.p>
          </motion.div>

          {/* Newsletter Form */}
          <motion.div variants={itemVariants} className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <motion.input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  whileFocus={{ scale: 1.02 }}
                  className="w-full px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300"
                />
                <motion.div
                  className="absolute right-2 top-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </motion.div>
              </div>
            </form>

            {/* Privacy Note */}
            <motion.p variants={itemVariants} className="text-sm text-white/70 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </motion.p>
          </motion.div>

          {/* Benefits */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 pt-8">
            <motion.div className="space-y-2" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <motion.div
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </motion.div>
              <h3 className="font-semibold text-white">Impact Stories</h3>
              <p className="text-sm text-white/80">Real stories from communities we serve</p>
            </motion.div>

            <motion.div className="space-y-2" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <motion.div
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </motion.div>
              <h3 className="font-semibold text-white">Event Updates</h3>
              <p className="text-sm text-white/80">First access to volunteer opportunities</p>
            </motion.div>

            <motion.div className="space-y-2" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <motion.div
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </motion.div>
              <h3 className="font-semibold text-white">Monthly Reports</h3>
              <p className="text-sm text-white/80">Transparent updates on our progress</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
