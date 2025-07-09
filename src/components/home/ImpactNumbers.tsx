/**
 * Impact Numbers (Stats Section)
 * Build trust with data-driven credibility
 */

import React from 'react';
import { motion } from 'framer-motion';

interface Stat {
  icon: React.ReactNode;
  number: string;
  label: string;
  description: string;
  color: string;
}

const ImpactNumbers: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const stats: Stat[] = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      number: '125,000+',
      label: 'Total Donors',
      description: 'Generous supporters worldwide',
      color: 'text-theme-primary',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      number: '40,009',
      label: 'People Helped',
      description: 'Lives transformed through care',
      color: 'text-theme-primary',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      number: '450+',
      label: 'Events',
      description: 'Community health programs',
      color: 'text-theme-primary',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      number: '15',
      label: 'Countries',
      description: 'Global reach and impact',
      color: 'text-blue-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      number: '280+',
      label: 'Projects',
      description: 'Healthcare initiatives completed',
      color: 'text-purple-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      number: '2,170',
      label: 'Volunteers',
      description: 'Dedicated healthcare workers',
      color: 'text-pink-600',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-theme-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-16"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-theme-primary"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Our Impact in Numbers
            </motion.h2>
            <motion.p className="text-lg lg:text-xl text-theme-muted max-w-3xl mx-auto leading-relaxed">
              See the measurable difference we're making in communities across Ethiopia and beyond.
              Every number represents lives touched and futures transformed.
            </motion.p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="bg-theme-background rounded-2xl p-6 text-center space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-theme"
              >
                {/* Icon */}
                <motion.div
                  className={`${stat.color} mx-auto`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.icon}
                </motion.div>

                {/* Number */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    delay: index * 0.1,
                  }}
                  className="space-y-1"
                >
                  <div className={`text-2xl lg:text-3xl font-bold ${stat.color}`}>
                    {stat.number}
                  </div>
                  <div className="text-sm lg:text-base font-semibold text-theme-primary">
                    {stat.label}
                  </div>
                </motion.div>

                {/* Description */}
                <p className="text-xs lg:text-sm text-theme-muted leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div className="space-y-4">
              <p className="text-lg text-theme-muted">
                Join thousands of supporters making a difference
              </p>
              <motion.button
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="btn-theme-primary px-8 py-3 rounded-xl font-semibold text-lg inline-flex items-center shadow-lg hover:shadow-xl transition-shadow"
              >
                Become Part of Our Impact
                <motion.svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </motion.svg>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactNumbers;
