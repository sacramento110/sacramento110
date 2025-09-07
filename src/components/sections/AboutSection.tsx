import React from 'react';

import { ABOUT_CONTENT, SSMA_INFO } from '@/utils/constants';
export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="py-8 md:py-20 bg-white min-h-screen md:min-h-0"
    >
      <div className="container mx-auto px-4 xs:px-6">
        {/* Section Header */}
        <div className="text-center mb-6 xs:mb-12">
          <h2 className="text-2xl xs:text-3xl md:text-5xl font-bold mb-3 xs:mb-4 islamic-text-gradient leading-tight">
            About {SSMA_INFO.shortName}
          </h2>
          <div className="w-16 xs:w-20 h-1 bg-islamic-gold-500 mx-auto mb-4 xs:mb-6"></div>
        </div>

        {/* About Content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-base xs:text-lg text-gray-700 leading-relaxed text-left xs:text-justify">
            <p className="leading-loose">{ABOUT_CONTENT}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
