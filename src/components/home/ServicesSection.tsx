/**
 * What We Do (Key Services) Section
 * Redesigned according to GIV Homepage Structure: Health & Nutrition, Education, Emergency Aid
 */

import React from 'react';
import { motion } from 'framer-motion';

const ServicesSection: React.FC = () => {
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

  const services = [
    {
      icon: (
        <svg
          className="w-12 h-12 text-theme-primary"
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
      ),
      title: 'Health & Nutrition',
      description:
        'Comprehensive healthcare services including medical consultations, nutritional support, and preventive care programs for communities across Ethiopia.',
      features: [
        'Medical consultations',
        'Nutritional support',
        'Preventive care',
        'Health screenings',
      ],
      bgColor: 'bg-theme-primary/5',
      borderColor: 'border-theme-primary/20',
      iconBg: 'bg-theme-primary/10',
    },
    {
      icon: (
        <svg
          className="w-12 h-12 text-theme-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      title: 'Education',
      description:
        'Educational programs focused on health literacy, disease prevention, and community empowerment through knowledge sharing and skill development.',
      features: [
        'Health education',
        'Disease prevention',
        'Community workshops',
        'Skill development',
      ],
      bgColor: 'bg-theme-secondary/5',
      borderColor: 'border-theme-secondary/20',
      iconBg: 'bg-theme-secondary/10',
    },
    {
      icon: (
        <svg
          className="w-12 h-12 text-theme-primary"
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
      ),
      title: 'Emergency Aid',
      description:
        'Rapid response emergency medical services, disaster relief, and critical care support for urgent healthcare needs and crisis situations.',
      features: ['Emergency response', 'Disaster relief', 'Critical care', '24/7 availability'],
      bgColor: 'bg-theme-accent/5',
      borderColor: 'border-theme-accent/20',
      iconBg: 'bg-theme-accent/10',
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
              What We Do
            </motion.h2>
            <motion.p className="text-lg lg:text-xl text-theme-muted max-w-3xl mx-auto leading-relaxed">
              Our core programs are designed to address the most critical healthcare needs in
              Ethiopian communities through comprehensive, sustainable solutions.
            </motion.p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                whileHover={{ y: -2, scale: 1.002 }}
                transition={{ duration: 0.3 }}
                className={`${service.bgColor} ${service.borderColor} border-2 rounded-2xl p-8 text-center space-y-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                {/* Icon */}
                <motion.div
                  className={`${service.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {service.icon}
                </motion.div>

                {/* Content */}
                <div className="space-y-4">
                  <motion.h3
                    className="text-xl lg:text-2xl font-bold text-theme-primary"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    {service.title}
                  </motion.h3>

                  <p className="text-theme-muted leading-relaxed">{service.description}</p>

                  {/* Features */}
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: featureIndex * 0.1 }}
                        className="flex items-center justify-center space-x-2 text-sm text-theme-muted"
                      >
                        <svg
                          className="w-4 h-4 text-theme-secondary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Learn More Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full btn-theme-primary py-3 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-shadow"
                >
                  Learn More
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
