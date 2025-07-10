/**
 * Featured Campaigns Section
 * Showcase 3-4 current fundraising campaigns with progress bars
 */

import React from 'react';
import { motion } from 'framer-motion';
import LoadingLink from '../common/LoadingLink';

interface Campaign {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  donors: number;
  daysLeft: number;
  featured?: boolean;
}

const FeaturedCampaigns: React.FC = () => {
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

  const campaigns: Campaign[] = [
    {
      id: 1,
      title: 'Emergency Medical Equipment for Rural Clinics',
      category: 'Emergency Aid',
      description:
        'Help us provide essential medical equipment to remote healthcare facilities serving underserved communities.',
      image: '/api/placeholder/400/250',
      goal: 50000,
      raised: 32500,
      donors: 156,
      daysLeft: 23,
      featured: true,
    },
    {
      id: 2,
      title: 'Maternal Health Program Expansion',
      category: 'Health & Nutrition',
      description:
        'Expand our maternal health services to reach more expectant mothers in rural areas.',
      image: '/api/placeholder/400/250',
      goal: 35000,
      raised: 28750,
      donors: 203,
      daysLeft: 15,
    },
    {
      id: 3,
      title: 'Community Health Education Initiative',
      category: 'Education',
      description:
        'Train community health workers to provide education on disease prevention and healthy living.',
      image: '/api/placeholder/400/250',
      goal: 25000,
      raised: 18900,
      donors: 89,
      daysLeft: 31,
    },
    {
      id: 4,
      title: 'Mobile Clinic Vehicle Fund',
      category: 'Emergency Aid',
      description:
        'Purchase and equip a mobile clinic to bring healthcare services directly to remote villages.',
      image: '/api/placeholder/400/250',
      goal: 75000,
      raised: 45600,
      donors: 267,
      daysLeft: 42,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Emergency Aid':
        return 'bg-theme-accent text-white';
      case 'Health & Nutrition':
        return 'bg-theme-primary text-white';
      case 'Education':
        return 'bg-theme-secondary text-white';
      default:
        return 'bg-theme-primary text-white';
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-theme-background">
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
              Featured Campaigns
            </motion.h2>
            <motion.p className="text-lg lg:text-xl text-theme-muted max-w-3xl mx-auto leading-relaxed">
              Support our current fundraising campaigns and help us make a direct impact on the
              lives of those who need it most.
            </motion.p>
          </motion.div>

          {/* Campaigns Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-theme-background border border-theme rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-theme-surface to-theme-background">
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`${getCategoryColor(campaign.category)} px-3 py-1 rounded-full text-sm font-medium`}
                    >
                      {campaign.category}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {campaign.featured && (
                    <div className="absolute top-4 right-4">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold"
                      >
                        FEATURED
                      </motion.div>
                    </div>
                  )}

                  {/* Placeholder Image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-theme-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-theme-primary line-clamp-2 leading-tight">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-theme-muted line-clamp-3 leading-relaxed">
                      {campaign.description}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-theme-primary">
                        {formatCurrency(campaign.raised)}
                      </span>
                      <span className="text-theme-muted">of {formatCurrency(campaign.goal)}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-theme-surface rounded-full h-2">
                      <motion.div
                        className="bg-theme-secondary h-2 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${getProgressPercentage(campaign.raised, campaign.goal)}%`,
                        }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center text-xs text-theme-muted">
                      <span>{campaign.donors} donors</span>
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                  </div>

                  {/* Donate Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full btn-theme-primary py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-shadow"
                  >
                    Donate Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <LoadingLink to="/campaigns" className="btn-theme-secondary px-8 py-3 rounded-xl font-semibold text-lg inline-flex items-center shadow-lg hover:shadow-xl transition-shadow">
                View All Campaigns
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
              </LoadingLink>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
