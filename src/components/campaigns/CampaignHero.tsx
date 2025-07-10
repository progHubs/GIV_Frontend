/**
 * Campaign Hero Section
 * Hero section for campaigns page with gradient background and statistics
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { CampaignStats } from '../../types';

interface CampaignHeroProps {
  stats?: CampaignStats | null;
}

const CampaignHero: React.FC<CampaignHeroProps> = ({ stats }) => {
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

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="relative overflow-hidden -mt-[80px] h-screen">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-green-500" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center text-white"
        >
          {/* Main Content */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Our Campaigns
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed"
            >
              Transformative healthcare initiatives empowering communities across Ethiopia. Join us
              in making a lasting impact through targeted campaigns that bring hope.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-colors duration-300 shadow-lg"
              >
                Donate Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Statistics */}
          {stats && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              <motion.div variants={statVariants} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stats.total_campaigns.toLocaleString()}
                </div>
                <div className="text-blue-100 text-sm md:text-base">Total Campaigns</div>
              </motion.div>

              <motion.div variants={statVariants} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stats.active_campaigns.toLocaleString()}
                </div>
                <div className="text-blue-100 text-sm md:text-base">Active Campaigns</div>
              </motion.div>

              <motion.div variants={statVariants} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  ${parseFloat(stats.total_current_amount).toLocaleString()}
                </div>
                <div className="text-blue-100 text-sm md:text-base">Funds Raised</div>
              </motion.div>

              <motion.div variants={statVariants} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stats.featured_campaigns.toLocaleString()}
                </div>
                <div className="text-blue-100 text-sm md:text-base">Featured Campaigns</div>
              </motion.div>
            </motion.div>
          )}

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CampaignHero;
