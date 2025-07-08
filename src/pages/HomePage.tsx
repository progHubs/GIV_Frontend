import React from 'react';
import { ThemeProvider } from '../theme';
import ModernNavigation from '../components/navigation/ModernNavigation';
import {
  HeroSection,
  AboutSnapshot,
  ServicesSection,
  FeaturedCampaigns,
  ImpactNumbers,
  CallToActionBanner,
  ProgramCategories,
  FeaturedStoriesSection,
  VolunteerSpotlight,
  TestimonialsSection,
  TrustedPartners,
  NewsletterSignup,
  ContactGetInvolved,
} from '../components/home';
import { Footer } from '../components/layout';

const HomePage: React.FC = () => {
  return (
    <ThemeProvider defaultMode="light">
      <div className="min-h-screen bg-theme-background">
        {/* 1. Top Navigation (Sticky Header) */}
        <ModernNavigation />

        {/* 2. Hero Section (Intro Banner) */}
        <HeroSection />

        {/* 3. About Us Snapshot */}
        <AboutSnapshot />

        {/* 4. What We Do (Key Services) */}
        <ServicesSection />

        {/* 5. Featured Campaigns */}
        <FeaturedCampaigns />

        {/* 6. Impact Numbers (Stats Section) */}
        <ImpactNumbers />

        {/* 7. Call to Action Banner */}
        <CallToActionBanner />

        {/* 8. Programs / Campaign Categories */}
        <ProgramCategories />

        {/* 9. Latest News & Blog Highlights */}
        <FeaturedStoriesSection />

        {/* 10. Volunteer/Testimonial Spotlight */}
        <VolunteerSpotlight />

        {/* 11. Testimonials */}
        <TestimonialsSection />

        {/* 12. Our Trusted Partners */}
        <TrustedPartners />

        {/* 13. Newsletter Signup */}
        <NewsletterSignup />

        {/* 14. Contact / Get Involved Section */}
        <ContactGetInvolved />

        {/* 15. Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default HomePage;
