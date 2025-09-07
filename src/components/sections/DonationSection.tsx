import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DONATION_INFO, getImagePath } from '@/utils/constants';
import {
  CreditCard,
  ExternalLink,
  Heart,
  QrCode,
  Smartphone,
} from 'lucide-react';
import React from 'react';

export const DonationSection: React.FC = () => {
  const handleVenmoClick = () => {
    const venmoUsername = DONATION_INFO.venmo.handle.replace('@', '');

    // Correct Venmo URL scheme to open the app directly to a user's profile
    const venmoAppUrl = `venmo://users/${venmoUsername}`;
    const webVenmoUrl = `https://venmo.com/u/${venmoUsername}`;

    // Check if we're on mobile
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // On mobile, try to open the Venmo app
      try {
        window.location.href = venmoAppUrl;

        // Fallback to web version if app doesn't open
        setTimeout(() => {
          if (document.hasFocus()) {
            window.open(webVenmoUrl, '_blank');
          }
        }, 3000);
      } catch (error) {
        // If deep link fails, open web version
        window.open(webVenmoUrl, '_blank');
      }
    } else {
      // On desktop, open web version directly
      window.open(webVenmoUrl, '_blank');
    }
  };

  return (
    <section
      id="donate"
      className="py-8 md:py-20 bg-gradient-to-br from-islamic-gold-50 to-white min-h-screen md:min-h-0"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xs:gap-8 max-w-4xl mx-auto mb-8 xs:mb-12">
          {/* Venmo Card */}
          <Card className="p-6 xs:p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 xs:w-16 xs:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 xs:mb-6">
              <Smartphone className="w-6 h-6 xs:w-8 xs:h-8 text-blue-600" />
            </div>

            <h3 className="text-xl xs:text-2xl font-bold text-gray-800 mb-3 xs:mb-4">
              Venmo
            </h3>

            <div className="mb-4 xs:mb-6 flex justify-center">
              <img
                src={getImagePath(DONATION_INFO.venmo.qrCode)}
                alt="Venmo QR Code"
                className="max-w-40 max-h-40 xs:max-w-48 xs:max-h-48 w-auto h-auto mx-auto rounded-lg shadow-md object-contain"
                loading="lazy"
              />
            </div>

            <div className="space-y-3 xs:space-y-4">
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <QrCode className="w-4 h-4 xs:w-5 xs:h-5" />
                <span className="font-semibold text-sm xs:text-base">
                  Scan QR Code
                </span>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleVenmoClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full touch-friendly"
                  icon={ExternalLink}
                >
                  Open Venmo App
                </Button>
              </div>
            </div>
          </Card>

          {/* Zelle Card */}
          <Card className="p-6 xs:p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 xs:w-16 xs:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 xs:mb-6">
              <CreditCard className="w-6 h-6 xs:w-8 xs:h-8 text-green-600" />
            </div>

            <h3 className="text-xl xs:text-2xl font-bold text-gray-800 mb-3 xs:mb-4">
              Zelle
            </h3>

            <div className="mb-4 xs:mb-6 flex justify-center">
              <img
                src={getImagePath(DONATION_INFO.zelle.qrCode)}
                alt="Zelle QR Code"
                className="max-w-40 max-h-40 xs:max-w-48 xs:max-h-48 w-auto h-auto mx-auto rounded-lg shadow-md object-contain"
                loading="lazy"
              />
            </div>

            <div className="space-y-2 xs:space-y-3">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <QrCode className="w-4 h-4 xs:w-5 xs:h-5" />
                <span className="font-semibold text-sm xs:text-base">
                  Scan QR Code
                </span>
              </div>

              <p className="text-gray-600 text-sm xs:text-base">
                Use your bank&apos;s Zelle service to send money
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
            Every contribution helps us provide religious services and community
            programs. Your generosity enables us to continue serving the
            Sacramento Shia Muslim community.
          </p>
        </div>
      </div>
    </section>
  );
};
