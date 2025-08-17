import React from 'react';

import { SSMA_INFO } from '@/utils/constants';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-islamic-navy-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-sm text-gray-400">
            © {currentYear} {SSMA_INFO.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
