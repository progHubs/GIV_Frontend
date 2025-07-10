/**
 * Campaign Partners Component
 * Displays partner organizations supporting campaigns
 */

import React from 'react';
import { motion } from 'framer-motion';

const CampaignPartners: React.FC = () => {
  const partners = [
    {
      id: 1,
      name: 'World Health Organization',
      logo: '/api/placeholder/120/60',
      description: 'Global health leadership',
    },
    {
      id: 2,
      name: 'UNICEF Ethiopia',
      logo: '/api/placeholder/120/60',
      description: "Children's rights and wellbeing",
    },
    {
      id: 3,
      name: 'Ethiopian Red Cross',
      logo: '/api/placeholder/120/60',
      description: 'Humanitarian assistance',
    },
    {
      id: 4,
      name: 'Gates Foundation',
      logo: '/api/placeholder/120/60',
      description: 'Global health initiatives',
    },
    {
      id: 5,
      name: 'Doctors Without Borders',
      logo: '/api/placeholder/120/60',
      description: 'Medical humanitarian aid',
    },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="bg-theme-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-theme-primary mb-4">
              Our Campaign Partners
            </h2>
            <p className="text-lg text-theme-muted max-w-3xl mx-auto">
              Working together with leading organizations to maximize our impact and reach more
              communities in need.
            </p>
          </motion.div>

          {/* Partners Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center"
          >
            {partners.map(partner => (
              <motion.div
                key={partner.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <div className="bg-theme-surface rounded-xl p-6 shadow-lg border border-theme hover:shadow-xl transition-all duration-300">
                  {/* Partner Logo Placeholder */}
                  <div className="h-16 flex items-center justify-center mb-4">
                    <div className="w-full h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {partner.name
                          .split(' ')
                          .map(word => word[0])
                          .join('')
                          .slice(0, 3)}
                      </span>
                    </div>
                  </div>

                  {/* Partner Name */}
                  <h3 className="font-semibold text-theme-primary text-sm mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {partner.name}
                  </h3>

                  {/* Partner Description */}
                  <p className="text-xs text-theme-muted">{partner.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Partnership Benefits */}
          <motion.div
            variants={itemVariants}
            className="mt-16 bg-theme-surface rounded-2xl p-8 shadow-lg border border-theme"
          >
            <h3 className="text-xl font-bold text-theme-primary mb-6">Partnership Benefits</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-theme-primary mb-2">Amplified Impact</h4>
                <p className="text-sm text-theme-muted">
                  Combined resources and expertise multiply our campaign effectiveness
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-theme-primary mb-2">Verified Programs</h4>
                <p className="text-sm text-theme-muted">
                  Partner validation ensures campaign authenticity and effectiveness
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-theme-primary mb-2">Global Reach</h4>
                <p className="text-sm text-theme-muted">
                  International partnerships extend our campaign reach worldwide
                </p>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Become a Partner
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CampaignPartners;
