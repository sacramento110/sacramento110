import { Layout } from '@/components/layout/Layout';
import { AboutSection } from '@/components/sections/AboutSection';
import { DonationSection } from '@/components/sections/DonationSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { HijriCalendarSection } from '@/components/sections/HijriCalendarSection';
import { PrayerTimesSection } from '@/components/sections/PrayerTimesSection';
import { YouTubeSection } from '@/components/sections/YouTubeSection';

function App() {
  return (
    <Layout>
      <HeroSection />
      <PrayerTimesSection />
      <HijriCalendarSection />
      <YouTubeSection />
      <AboutSection />
      <DonationSection />
    </Layout>
  );
}

export default App;
