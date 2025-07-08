/**
 * About Us Snapshot Section
 * Quick intro to GIV Society mission
 */

import React from 'react';
import { motion } from 'framer-motion';

const AboutSnapshot: React.FC = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="py-16 lg:py-20 bg-theme-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-theme-primary"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Transforming Lives Through Compassionate Care
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg lg:text-xl text-theme-muted leading-relaxed max-w-3xl mx-auto"
            >
              Since 2021, GIV Society Ethiopia has been dedicated to providing free healthcare
              services, educational support, and emergency aid to underserved communities across
              Ethiopia. Our mission is to bridge the gap in healthcare accessibility and create
              lasting positive change.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-base lg:text-lg text-theme-muted leading-relaxed max-w-2xl mx-auto"
            >
              Through the dedication of our volunteers and the support of our partners, we continue
              to expand our reach and impact, one community at a time.
            </motion.p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-theme-primary px-8 py-3 rounded-xl font-semibold text-lg inline-flex items-center shadow-lg hover:shadow-xl transition-shadow"
            >
              Learn More About Us
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

export default AboutSnapshot;
