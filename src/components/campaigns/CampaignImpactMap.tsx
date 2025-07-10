/**
 * Campaign Impact Map Component
 * Interactive map showing campaign impact across Ethiopia
 */

import React from 'react';
import { motion } from 'framer-motion';

const CampaignImpactMap: React.FC = () => {
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
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16">
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
              Our Impact Across Ethiopia
            </h2>
            <p className="text-lg text-theme-muted max-w-3xl mx-auto">
              See how our campaigns are making a difference in communities throughout the country.
              Every dot represents lives touched and communities transformed.
            </p>
          </motion.div>

          {/* Map Container */}
          <motion.div
            variants={itemVariants}
            className="relative bg-theme-surface rounded-2xl p-8 shadow-lg border border-theme"
          >
            {/* Placeholder for Interactive Map */}
            <div className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl overflow-hidden">
              {/* Ethiopia Map Outline (Simplified) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-80 h-64">
                  {/* Map Background */}
                  <div className="absolute inset-0 bg-blue-200 dark:bg-blue-800/30 rounded-lg opacity-50" />

                  {/* Impact Points */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full shadow-lg"
                    title="Addis Ababa - 15 Campaigns"
                  >
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="absolute top-1/2 left-1/4 w-3 h-3 bg-blue-500 rounded-full shadow-lg"
                    title="Bahir Dar - 8 Campaigns"
                  >
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" />
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="absolute top-3/4 left-2/3 w-3 h-3 bg-green-500 rounded-full shadow-lg"
                    title="Hawassa - 6 Campaigns"
                  >
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                    className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-500 rounded-full shadow-lg"
                    title="Dire Dawa - 4 Campaigns"
                  >
                    <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75" />
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                    className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-yellow-500 rounded-full shadow-lg"
                    title="Arba Minch - 3 Campaigns"
                  >
                    <div className="absolute inset-0 bg-yellow-500 rounded-full animate-ping opacity-75" />
                  </motion.div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                <h4 className="text-sm font-semibold text-theme-primary mb-2">Campaign Impact</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-theme-muted">Major Cities (10+ campaigns)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-theme-muted">Regional Centers (5-9 campaigns)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="text-theme-muted">Local Communities (1-4 campaigns)</span>
                  </div>
                </div>
              </div>

              {/* Interactive Note */}
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Interactive Impact Map
              </div>
            </div>

            {/* Map Description */}
            <div className="mt-6 text-center">
              <p className="text-theme-muted">
                Hover over the dots to see campaign locations and impact details. Our campaigns
                reach both urban centers and remote rural communities.
              </p>
            </div>
          </motion.div>

          {/* Impact Statistics */}
          <motion.div
            variants={itemVariants}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-theme-muted text-sm">Regions Covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">45</div>
              <div className="text-theme-muted text-sm">Cities & Towns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">150+</div>
              <div className="text-theme-muted text-sm">Rural Communities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-red-600 mb-2">500K+</div>
              <div className="text-theme-muted text-sm">Lives Impacted</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CampaignImpactMap;
