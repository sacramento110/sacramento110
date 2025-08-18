import { Card } from '@/components/ui/Card';
import { DONATION_INFO, getImagePath } from '@/utils/constants';
import { CreditCard, Heart, QrCode, Smartphone } from 'lucide-react';
import React from 'react';

export const DonationSection: React.FC = () => {
  return (
    <section
      id="donate"
      className="py-20 bg-gradient-to-br from-islamic-gold-50 to-white"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Support Our Community
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Your generous donations help us serve the community better and
            maintain our programs
          </p>

          {/* Decorative Orange Line */}
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
          </div>
        </div>

        {/* Donation Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Venmo Card */}
          <Card className="p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Venmo</h3>

            <div className="mb-6">
              <img
                src={getImagePath(DONATION_INFO.venmo.qrCode)}
                alt="Venmo QR Code"
                className="w-48 h-48 mx-auto rounded-lg shadow-md object-cover"
                loading="lazy"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <QrCode className="w-5 h-5" />
                <span className="font-semibold">Scan QR Code</span>
              </div>
            </div>
          </Card>

          {/* Zelle Card */}
          <Card className="p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Zelle</h3>

            <div className="mb-6">
              <img
                src={getImagePath(DONATION_INFO.zelle.qrCode)}
                alt="Zelle QR Code"
                className="w-48 h-48 mx-auto rounded-lg shadow-md object-cover"
                loading="lazy"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <QrCode className="w-5 h-5" />
                <span className="font-semibold">Scan QR Code</span>
              </div>

              <p className="text-gray-600">
                Use your bank's Zelle service to send money
              </p>
            </div>
          </Card>
        </div>

        {/* Impact Information */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Your Donations Make a Difference
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Every contribution helps us provide religious services, community
            programs, and support to families in need. Your generosity enables
            us to continue serving the Sacramento Shia Muslim community.
          </p>
        </div>
      </div>
    </section>
  );
};
