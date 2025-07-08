/**
 * Volunteer/Testimonial Spotlight Section
 * Humanize the mission with real voices
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Volunteer {
  id: number;
  name: string;
  role: string;
  photo: string;
  quote: string;
  location: string;
  yearsActive: number;
  specialty: string;
}

const VolunteerSpotlight: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const volunteers: Volunteer[] = [
    {
      id: 1,
      name: 'Dr. Sarah Alemayehu',
      role: 'Lead Medical Volunteer',
      photo: '/api/placeholder/150/150',
      quote:
        'Working with GIV Society has been the most rewarding experience of my career. Seeing the direct impact we make in rural communities drives me to continue this vital work.',
      location: 'Addis Ababa, Ethiopia',
      yearsActive: 3,
      specialty: 'Pediatric Care',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Education Program Coordinator',
      photo: '/api/placeholder/150/150',
      quote:
        "Education is the foundation of lasting change. Through our programs, I've witnessed children transform their futures and entire communities flourish.",
      location: 'Toronto, Canada',
      yearsActive: 2,
      specialty: 'Community Education',
    },
    {
      id: 3,
      name: 'Fatima Hassan',
      role: 'Emergency Response Specialist',
      photo: '/api/placeholder/150/150',
      quote:
        'In times of crisis, being able to provide immediate relief and hope to families in need is what motivates me every single day.',
      location: 'London, UK',
      yearsActive: 4,
      specialty: 'Disaster Relief',
    },
    {
      id: 4,
      name: 'Dr. James Tadesse',
      role: 'Mental Health Advocate',
      photo: '/api/placeholder/150/150',
      quote:
        'Mental health support is crucial in healthcare. Our holistic approach ensures we care for both physical and emotional well-being.',
      location: 'Melbourne, Australia',
      yearsActive: 5,
      specialty: 'Mental Health',
    },
  ];

  const nextVolunteer = () => {
    setCurrentIndex(prev => (prev + 1) % volunteers.length);
  };

  const prevVolunteer = () => {
    setCurrentIndex(prev => (prev - 1 + volunteers.length) % volunteers.length);
  };

  const currentVolunteer = volunteers[currentIndex];

  return (
    <section className="py-16 lg:py-24 bg-theme-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Volunteer Spotlight
            </motion.h2>
            <motion.p className="text-lg lg:text-xl text-theme-muted max-w-3xl mx-auto leading-relaxed">
              Meet the dedicated volunteers who make our mission possible. Their passion and
              commitment drive real change in communities worldwide.
            </motion.p>
          </motion.div>

          {/* Main Volunteer Card */}
          <motion.div variants={itemVariants} className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVolunteer.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-theme-surface rounded-3xl p-8 lg:p-12 shadow-xl border border-theme"
              >
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Volunteer Photo and Info */}
                  <div className="text-center lg:text-left space-y-6">
                    <motion.div
                      className="relative inline-block"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto lg:mx-0 rounded-full bg-gradient-to-br from-theme-primary to-theme-secondary p-1">
                        <div className="w-full h-full rounded-full bg-theme-background flex items-center justify-center">
                          <svg
                            className="w-16 h-16 lg:w-20 lg:h-20 text-theme-muted"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      </div>
                      <motion.div
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-theme-secondary rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.div>
                    </motion.div>

                    <div className="space-y-2">
                      <h3 className="text-2xl lg:text-3xl font-bold text-theme-primary">
                        {currentVolunteer.name}
                      </h3>
                      <p className="text-lg text-theme-secondary font-semibold">
                        {currentVolunteer.role}
                      </p>
                      <p className="text-theme-muted">{currentVolunteer.location}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-center lg:justify-start space-x-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-theme-primary">
                          {currentVolunteer.yearsActive}
                        </div>
                        <div className="text-sm text-theme-muted">Years Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-theme-secondary">
                          {currentVolunteer.specialty}
                        </div>
                        <div className="text-sm text-theme-muted">Specialty</div>
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="space-y-6">
                    <motion.div
                      className="text-4xl text-theme-primary opacity-20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      "
                    </motion.div>
                    <blockquote className="text-lg lg:text-xl text-theme-primary leading-relaxed italic">
                      {currentVolunteer.quote}
                    </blockquote>
                    <motion.div
                      className="text-4xl text-theme-primary opacity-20 text-right"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      "
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              <motion.button
                onClick={prevVolunteer}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full bg-theme-surface border border-theme hover:bg-theme-primary hover:text-white transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </motion.button>

              {/* Dots */}
              <div className="flex space-x-2">
                {volunteers.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    whileHover={{ scale: 1.2 }}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === currentIndex ? 'bg-theme-primary' : 'bg-theme-muted'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                onClick={nextVolunteer}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full bg-theme-surface border border-theme hover:bg-theme-primary hover:text-white transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.div>

          {/* Join CTA */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-theme-primary px-8 py-3 rounded-xl font-semibold text-lg inline-flex items-center shadow-lg hover:shadow-xl transition-shadow"
            >
              Join Our Volunteer Team
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

export default VolunteerSpotlight;
