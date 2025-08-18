import React from 'react';

import { ABOUT_CONTENT, SSMA_INFO } from '@/utils/constants';
export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 xs:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 xs:mb-16">
          <h2 className="text-3xl xs:text-4xl md:text-5xl font-bold mb-4 xs:mb-6 islamic-text-gradient leading-tight">
            About {SSMA_INFO.shortName}
          </h2>
          <div className="w-20 xs:w-24 h-1 bg-islamic-gold-500 mx-auto mb-6 xs:mb-8"></div>
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
