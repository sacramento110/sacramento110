
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/sections/HeroSection';
import { PrayerTimesSection } from '@/components/sections/PrayerTimesSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { YouTubeSection } from '@/components/sections/YouTubeSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { DonationSection } from '@/components/sections/DonationSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';

// Main homepage component
const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <PrayerTimesSection />
      <EventsSection />
      <YouTubeSection />
      <AboutSection />
      <DonationSection />
      <NewsletterSection />
    </>
  );
};

// Event deep link handler
const EventDeepLink: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract event ID from URL
    const eventId = location.pathname.split('/events/')[1];
    
    if (eventId) {
      // Navigate to homepage
      navigate('/', { replace: true });
      
      // Wait for page to load, then scroll to events section and open modal
      setTimeout(() => {
        const eventsSection = document.getElementById('events');
        if (eventsSection) {
          eventsSection.scrollIntoView({ behavior: 'smooth' });
          
          // Trigger event modal opening - we'll implement this in EventsSection
          const eventModalEvent = new CustomEvent('openEventModal', { 
            detail: { eventId } 
          });
          window.dispatchEvent(eventModalEvent);
        }
      }, 500);
    } else {
      // Invalid event URL, redirect to homepage
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Render homepage while handling the deep link
  return <HomePage />;
};

function App() {
  return (
    <Layout>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<HomePage />} />
        
        {/* Event deep links */}
        <Route path="/events/:eventId" element={<EventDeepLink />} />
        
        {/* Catch all - redirect to homepage */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
