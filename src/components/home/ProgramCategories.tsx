/**
 * Programs / Campaign Categories Section
 * Let users explore all areas of support
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Program {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  campaigns: number;
  totalRaised: string;
  color: string;
}

const ProgramCategories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

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

  const programs: Program[] = [
    {
      id: 'education',
      title: 'Education',
      description:
        'Supporting educational initiatives, scholarships, and learning resources for underserved communities.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      campaigns: 12,
      totalRaised: '$125,000',
      color: 'bg-blue-500',
    },
    {
      id: 'water',
      title: 'Water',
      description:
        'Providing clean water access, sanitation facilities, and water infrastructure to communities in need.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
      campaigns: 8,
      totalRaised: '$89,500',
      color: 'bg-cyan-500',
    },
    {
      id: 'relief',
      title: 'Relief',
      description:
        'Emergency response, disaster relief, and humanitarian aid for crisis situations and urgent needs.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      campaigns: 15,
      totalRaised: '$203,750',
      color: 'bg-red-500',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Programs' },
    { id: 'education', name: 'Education' },
    { id: 'water', name: 'Water' },
    { id: 'relief', name: 'Relief' },
  ];

  const filteredPrograms =
    activeCategory === 'all' ? programs : programs.filter(program => program.id === activeCategory);

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
              Our Programs
            </motion.h2>
            <motion.p className="text-lg lg:text-xl text-theme-muted max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive programs designed to create lasting impact across education,
              water access, and emergency relief initiatives.
            </motion.p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="flex space-x-2 bg-theme-background rounded-xl p-2 border border-theme">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-theme-primary text-white shadow-md'
                      : 'text-theme-muted hover:text-theme-primary hover:bg-theme-surface'
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Programs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map(program => (
              <motion.div
                key={program.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-theme-background rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-theme"
              >
                {/* Icon */}
                <motion.div
                  className={`${program.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {program.icon}
                </motion.div>

                {/* Content */}
                <div className="space-y-4">
                  <motion.h3
                    className="text-xl lg:text-2xl font-bold text-theme-primary"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {program.title}
                  </motion.h3>

                  <p className="text-theme-muted leading-relaxed">{program.description}</p>

                  {/* Stats */}
                  <div className="flex justify-between items-center pt-4 border-t border-theme">
                    <div className="text-center">
                      <div className="text-lg font-bold text-theme-primary">
                        {program.campaigns}
                      </div>
                      <div className="text-xs text-theme-muted">Active Campaigns</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-theme-secondary">
                        {program.totalRaised}
                      </div>
                      <div className="text-xs text-theme-muted">Total Raised</div>
                    </div>
                  </div>
                </div>

                {/* Explore Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-6 btn-theme-primary py-3 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-shadow"
                >
                  Explore {program.title}
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* View All Programs Button */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-theme-secondary px-8 py-3 rounded-xl font-semibold text-lg inline-flex items-center shadow-lg hover:shadow-xl transition-shadow"
            >
              View All Programs
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
      </div>
    </section>
  );
};

export default ProgramCategories;
