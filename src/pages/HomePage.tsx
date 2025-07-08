import React from 'react';
import PublicLayout from '../layouts/PublicLayout';
import {
  HeroSection,
  FeaturedStoriesSection,
  MissionSection,
  ServicesSection,
} from '../components/home';

const HomePage: React.FC = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <FeaturedStoriesSection />
      <MissionSection />
      <ServicesSection />
    </PublicLayout>
  );
};

export default HomePage;
