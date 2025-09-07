import React from 'react';
import { Mail, Bug } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Beta Version Banner */}
        <div className="bg-orange-500 text-white px-4 py-2 rounded-lg mb-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              We&apos;re continuously improving!
            </span>
          </div>
        </div>

        {/* Tech Support Section */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Bug className="w-5 h-5 text-islamic-green-400" />
            <h3 className="text-lg font-semibold text-islamic-green-400">
              Found a Bug?
            </h3>
          </div>

          <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
            If you encounter any issues or bugs while using our website, please
            reach out to our tech team with details about the problem.
          </p>

          <a
            href="mailto:ssmatechshias@gmail.com?subject=Website Bug Report&body=Please describe the issue you encountered:"
            className="inline-flex items-center space-x-2 bg-islamic-green-600 hover:bg-islamic-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <Mail className="w-4 h-4" />
            <span className="font-medium">ssmatechshias@gmail.com</span>
          </a>

          <p className="text-xs text-gray-400 mt-3">
            Include details like: what you were doing, what happened, and any
            error messages you saw.
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Sacramento Shia Muslim Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
