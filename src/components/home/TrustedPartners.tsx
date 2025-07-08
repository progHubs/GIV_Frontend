/**
 * Our Trusted Partners Section
 * Build trust with known organizations
 */

import React from 'react';
import { motion } from 'framer-motion';

interface Partner {
  id: number;
  name: string;
  logo: string;
  category: string;
}

const TrustedPartners: React.FC = () => {
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

  const partners: Partner[] = [
    {
      id: 1,
      name: 'World Health Organization',
      logo: '/api/placeholder/150/80',
      category: 'International Health',
    },
    {
      id: 2,
      name: 'UNICEF',
      logo: '/api/placeholder/150/80',
      category: "Children's Welfare",
    },
    {
      id: 3,
      name: 'Ethiopian Ministry of Health',
      logo: '/api/placeholder/150/80',
      category: 'Government',
    },
    {
      id: 4,
      name: 'Doctors Without Borders',
      logo: '/api/placeholder/150/80',
      category: 'Medical Aid',
    },
    {
      id: 5,
      name: 'Red Cross',
      logo: '/api/placeholder/150/80',
      category: 'Humanitarian',
    },
    {
      id: 6,
      name: 'Gates Foundation',
      logo: '/api/placeholder/150/80',
      category: 'Philanthropy',
    },
    {
      id: 7,
      name: 'USAID',
      logo: '/api/placeholder/150/80',
      category: 'Development',
    },
    {
      id: 8,
      name: 'African Union',
      logo: '/api/placeholder/150/80',
      category: 'Regional Organization',
    },
  ];

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
              Our Trusted Partners
            </motion.h2>
            <motion.p className="text-lg lg:text-xl text-theme-muted max-w-3xl mx-auto leading-relaxed">
              We collaborate with leading organizations worldwide to maximize our impact and ensure
              sustainable healthcare solutions for communities in need.
            </motion.p>
          </motion.div>

          {/* Partners Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {partners.map(partner => (
              <motion.div
                key={partner.id}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <div className="bg-theme-surface rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-lg transition-all duration-300 border border-theme h-full flex flex-col items-center justify-center space-y-4">
                  {/* Logo Placeholder */}
                  <motion.div
                    className="w-full h-16 bg-gradient-to-br from-theme-muted/20 to-theme-muted/10 rounded-lg flex items-center justify-center group-hover:from-theme-primary/20 group-hover:to-theme-secondary/20 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg
                      className="w-8 h-8 text-theme-muted group-hover:text-theme-primary transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </motion.div>

                  {/* Partner Info */}
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-theme-primary text-sm lg:text-base group-hover:text-theme-brand-primary transition-colors duration-300">
                      {partner.name}
                    </h3>
                    <p className="text-xs text-theme-muted">{partner.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Partnership Stats */}
          <motion.div
            variants={itemVariants}
            className="bg-theme-surface rounded-3xl p-8 lg:p-12 border border-theme"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <div className="text-3xl lg:text-4xl font-bold text-theme-primary mb-2">50+</div>
                <div className="text-theme-muted">Global Partners</div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <div className="text-3xl lg:text-4xl font-bold text-theme-secondary mb-2">15</div>
                <div className="text-theme-muted">Countries</div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <div className="text-3xl lg:text-4xl font-bold text-theme-accent mb-2">$2.5M</div>
                <div className="text-theme-muted">Joint Funding</div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">100K+</div>
                <div className="text-theme-muted">Lives Impacted</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Partnership Benefits */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="text-center space-y-4"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-16 h-16 bg-theme-primary/10 rounded-2xl flex items-center justify-center mx-auto"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-8 h-8 text-theme-primary"
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
              </motion.div>
              <h3 className="text-xl font-bold text-theme-primary">Rapid Response</h3>
              <p className="text-theme-muted">
                Our partnerships enable quick deployment of resources during emergencies and crisis
                situations.
              </p>
            </motion.div>

            <motion.div
              className="text-center space-y-4"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-16 h-16 bg-theme-secondary/10 rounded-2xl flex items-center justify-center mx-auto"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-8 h-8 text-theme-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.div>
              <h3 className="text-xl font-bold text-theme-primary">Global Reach</h3>
              <p className="text-theme-muted">
                Strategic alliances expand our impact across continents, reaching more communities
                in need.
              </p>
            </motion.div>

            <motion.div
              className="text-center space-y-4"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-16 h-16 bg-theme-accent/10 rounded-2xl flex items-center justify-center mx-auto"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-8 h-8 text-theme-accent"
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
              </motion.div>
              <h3 className="text-xl font-bold text-theme-primary">Quality Assurance</h3>
              <p className="text-theme-muted">
                Collaboration with established organizations ensures the highest standards in all
                our programs.
              </p>
            </motion.div>
          </motion.div>

          {/* Partnership CTA */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-theme-primary px-8 py-3 rounded-xl font-semibold text-lg inline-flex items-center shadow-lg hover:shadow-xl transition-shadow"
            >
              Become a Partner
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

export default TrustedPartners;
