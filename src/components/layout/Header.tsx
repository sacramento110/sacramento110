import { SSMA_INFO } from '@/utils/constants';
import { scrollToSection } from '@/utils/scrollUtils';
import { Heart, Menu, X } from 'lucide-react';
import React, { useState } from 'react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (sectionId: string) => {
    scrollToSection(sectionId);
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
            <div className="hidden xs:block">
              <h1 className="text-base xs:text-lg font-bold text-islamic-green-600">
                {SSMA_INFO.shortName}
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">
                Sacramento, CA
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleNavigation('hero')}
              className="text-gray-700 hover:text-islamic-green-600 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation('prayer-times')}
              className="text-gray-700 hover:text-islamic-green-600 transition-colors"
            >
              Prayer Times
            </button>
            <button
              onClick={() => handleNavigation('hijri-calendar')}
              className="text-gray-700 hover:text-islamic-green-600 transition-colors"
            >
              Calendar
            </button>
            <button
              onClick={() => handleNavigation('videos')}
              className="text-gray-700 hover:text-islamic-green-600 transition-colors"
            >
              Videos
            </button>
            <button
              onClick={() => handleNavigation('about')}
              className="text-gray-700 hover:text-islamic-green-600 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleNavigation('donate')}
              className="bg-islamic-green-600 text-white px-4 py-2 rounded-lg hover:bg-islamic-green-700 transition-colors flex items-center space-x-1"
            >
              <Heart className="w-4 h-4" />
              <span>Donate</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-islamic-green-600 transition-colors touch-friendly"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => handleNavigation('hero')}
                className="text-left py-3 text-gray-700 hover:text-islamic-green-600 transition-colors touch-friendly w-full"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation('prayer-times')}
                className="text-left py-3 text-gray-700 hover:text-islamic-green-600 transition-colors touch-friendly w-full"
              >
                Prayer Times
              </button>
              <button
                onClick={() => handleNavigation('hijri-calendar')}
                className="text-left py-3 text-gray-700 hover:text-islamic-green-600 transition-colors touch-friendly w-full"
              >
                Calendar
              </button>
              <button
                onClick={() => handleNavigation('videos')}
                className="text-left py-3 text-gray-700 hover:text-islamic-green-600 transition-colors touch-friendly w-full"
              >
                Videos
              </button>
              <button
                onClick={() => handleNavigation('about')}
                className="text-left py-3 text-gray-700 hover:text-islamic-green-600 transition-colors touch-friendly w-full"
              >
                About
              </button>
              <button
                onClick={() => handleNavigation('donate')}
                className="bg-islamic-green-600 text-white px-4 py-3 rounded-lg hover:bg-islamic-green-700 transition-colors flex items-center justify-center space-x-2 touch-friendly w-full min-h-[48px]"
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
