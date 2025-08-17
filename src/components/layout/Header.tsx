import React, { useState } from 'react';
import { Menu, X, Clock, Heart } from 'lucide-react';
import { SSMA_INFO } from '@/utils/constants';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useRealTimeCountdown } from '@/hooks/useRealTimeCountdown';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { nextPrayer } = usePrayerTimes();
  const countdown = useRealTimeCountdown(nextPrayer?.time || null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-40 border-b border-islamic-gold-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-islamic-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">SSMA</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-islamic-green-600 hidden sm:block">
                {SSMA_INFO.shortName}
              </h1>
              <p className="text-xs text-gray-600 hidden md:block">
                Sacramento, CA
              </p>
            </div>
          </div>

          {/* Next Prayer Indicator - Desktop */}
          {nextPrayer && countdown && (
            <div className="hidden lg:flex items-center space-x-2 bg-islamic-green-50 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-islamic-green-600" />
              <span className="text-sm font-medium text-islamic-green-700 font-mono">
                Next: {nextPrayer.name} in {countdown}
              </span>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-gray-700 hover:text-islamic-green-600 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('prayer-times')}
              className="text-gray-700 hover:text-islamic-green-600 transition-colors"
            >
              Prayer Times
            </button>
            <button
              onClick={() => scrollToSection('events')}
              className="text-gray-700 hover:text-islamic-green-600 transition-colors"
            >
              Events
            </button>
            <button
              onClick={() => scrollToSection('videos')}
              className="text-gray-700 hover:text-islamic-green-600 transition-colors"
            >
              Videos
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-islamic-green-600 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('donate')}
              className="bg-islamic-green-600 text-white px-4 py-2 rounded-lg hover:bg-islamic-green-700 transition-colors flex items-center space-x-1"
            >
              <Heart className="w-4 h-4" />
              <span>Donate</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-islamic-green-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-3">
              {/* Next Prayer - Mobile */}
              {nextPrayer && countdown && (
                <div className="flex items-center justify-center space-x-2 bg-islamic-green-50 px-4 py-2 rounded-lg mb-2">
                  <Clock className="w-4 h-4 text-islamic-green-600" />
                  <span className="text-sm font-medium text-islamic-green-700 font-mono">
                    Next: {nextPrayer.name} in {countdown}
                  </span>
                </div>
              )}
              
              <button
                onClick={() => scrollToSection('hero')}
                className="text-left py-2 text-gray-700 hover:text-islamic-green-600 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('prayer-times')}
                className="text-left py-2 text-gray-700 hover:text-islamic-green-600 transition-colors"
              >
                Prayer Times
              </button>
              <button
                onClick={() => scrollToSection('events')}
                className="text-left py-2 text-gray-700 hover:text-islamic-green-600 transition-colors"
              >
                Events
              </button>
              <button
                onClick={() => scrollToSection('videos')}
                className="text-left py-2 text-gray-700 hover:text-islamic-green-600 transition-colors"
              >
                Videos
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-left py-2 text-gray-700 hover:text-islamic-green-600 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('donate')}
                className="bg-islamic-green-600 text-white px-4 py-3 rounded-lg hover:bg-islamic-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Heart className="w-4 h-4" />
                <span>Donate</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
