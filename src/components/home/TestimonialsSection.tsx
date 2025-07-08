/**
 * Testimonials Section
 * Reinforce credibility with user feedback
 */

import React from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  organization?: string;
  image: string;
  quote: string;
  rating: number;
}

const TestimonialsSection: React.FC = () => {

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

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Almaz Bekele',
      role: 'Community Leader',
      organization: 'Hawassa Community Center',
      image: '/api/placeholder/100/100',
      quote: 'GIV Society transformed our community. The medical services they provided saved my daughter\'s life, and their education programs gave our children hope for a better future.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Dr. Robert Williams',
      role: 'Medical Director',
      organization: 'International Health Alliance',
      image: '/api/placeholder/100/100',
      quote: 'I\'ve worked with many organizations, but GIV Society\'s commitment to sustainable healthcare solutions and community empowerment is truly exceptional.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Hanan Mohammed',
      role: 'Beneficiary',
      organization: 'Dire Dawa Region',
      image: '/api/placeholder/100/100',
      quote: 'Thanks to GIV Society\'s maternal health program, I received proper prenatal care and delivered my baby safely. Their support means everything to mothers like me.',
      rating: 5,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <motion.svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 }}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </motion.svg>
    ));
  };

  return (
    <section className="py-16 lg:py-24 bg-theme-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <motion.h2 
              className="text-3xl lg:text-4xl font-bold text-theme-primary"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              What People Say
            </motion.h2>
            <motion.p 
              className="text-lg lg:text-xl text-theme-muted max-w-3xl mx-auto leading-relaxed"
            >
              Hear from the communities, partners, and beneficiaries whose lives 
              have been touched by our work.
            </motion.p>
          </motion.div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-theme-background rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-theme relative"
              >
                {/* Quote Icon */}
                <motion.div 
                  className="absolute -top-4 left-8 w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </motion.div>

                <div className="space-y-6">
                  {/* Rating */}
                  <div className="flex space-x-1 pt-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-theme-primary leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-theme">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-theme-primary to-theme-secondary p-0.5"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-full h-full rounded-full bg-theme-background flex items-center justify-center">
                        <svg className="w-6 h-6 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-theme-primary">{testimonial.name}</h4>
                      <p className="text-sm text-theme-muted">{testimonial.role}</p>
                      {testimonial.organization && (
                        <p className="text-xs text-theme-secondary font-medium">{testimonial.organization}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div variants={itemVariants} className="text-center space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl lg:text-3xl font-bold text-theme-primary">4.9/5</div>
                <div className="text-sm text-theme-muted">Average Rating</div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl lg:text-3xl font-bold text-theme-secondary">98%</div>
                <div className="text-sm text-theme-muted">Satisfaction Rate</div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl lg:text-3xl font-bold text-theme-accent">500+</div>
                <div className="text-sm text-theme-muted">Reviews</div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl lg:text-3xl font-bold text-blue-600">15</div>
                <div className="text-sm text-theme-muted">Countries</div>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-theme-secondary px-8 py-3 rounded-xl font-semibold text-lg inline-flex items-center shadow-lg hover:shadow-xl transition-shadow"
            >
              Read More Reviews
              <motion.svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
