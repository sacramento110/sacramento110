import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SSMA_INFO } from '@/utils/constants';
import { Button } from '@/components/ui/Button';

export const HeroSection: React.FC = () => {

  const scrollToNextSection = () => {
    const element = document.getElementById('prayer-times');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/sacramento110/images/imam-hussain-shrine.jpg')`
      }}
    >
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-10"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Main Logo/Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-islamic-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-white font-bold text-lg">SSMA</span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 hero-text-shadow animate-fade-in">
          <span className="block text-white">{SSMA_INFO.name}</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto hero-text-shadow animate-slide-up">
          {SSMA_INFO.tagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={() => {
              const element = document.getElementById('prayer-times');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            size="lg"
            className="bg-islamic-green-600 hover:bg-islamic-green-700 text-white shadow-lg"
          >
            View Prayer Times
          </Button>
          <Button
            onClick={() => {
              const element = document.getElementById('events');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-islamic-green-600 shadow-lg"
          >
            Upcoming Events
          </Button>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToNextSection}
          className="animate-bounce text-white hover:text-islamic-gold-400 transition-colors"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="w-8 h-8 mx-auto" />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  );
};
