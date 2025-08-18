import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/sections/HeroSection';
import { PrayerTimesSection } from '@/components/sections/PrayerTimesSection';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AboutSection } from '@/components/sections/AboutSection';
import { DonationSection } from '@/components/sections/DonationSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { YouTubeSection } from '@/components/sections/YouTubeSection';

// Main homepage component
const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <PrayerTimesSection />
      <YouTubeSection />
      <AboutSection />
      <DonationSection />
      <NewsletterSection />
    </>
  );
};

function App() {
  return (
    <Layout>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<HomePage />} />

        {/* Catch all - redirect to homepage */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
