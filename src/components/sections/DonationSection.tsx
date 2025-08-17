import React from 'react';
import { Heart, Smartphone, CreditCard, QrCode, ExternalLink } from 'lucide-react';
import { DONATION_INFO } from '@/utils/constants';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const DonationSection: React.FC = () => {
  return (
    <section id="donate" className="py-20 bg-gradient-to-br from-islamic-gold-50 to-white">
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
            Your generous donations help us serve the community better and maintain our programs
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
                src={DONATION_INFO.venmo.qrCode}
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
              
              <p className="text-gray-600">
                Open your Venmo app and scan the QR code above
              </p>
              
              <div className="text-lg font-semibold text-gray-800">
                {DONATION_INFO.venmo.handle}
              </div>
            </div>
            
            <Button
              onClick={() => window.open(`https://venmo.com/${DONATION_INFO.venmo.handle}`, '_blank')}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              icon={ExternalLink}
            >
              Open in Venmo
            </Button>
          </Card>

          {/* Zelle Card */}
          <Card className="p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Zelle</h3>
            
            <div className="mb-6">
              <img
                src={DONATION_INFO.zelle.qrCode}
                alt="Zelle QR Code"
                className="w-48 h-48 mx-auto rounded-lg shadow-md object-cover"
                loading="lazy"

              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-purple-600">
                <QrCode className="w-5 h-5" />
                <span className="font-semibold">Scan in Banking App</span>
              </div>
              
              <p className="text-gray-600">
                Scan QR code in your banking app to send payment
              </p>
              
              <div className="text-sm text-gray-800 space-y-1">
                <div className="font-semibold">{DONATION_INFO.zelle.organization}</div>
                <div className="text-purple-600">{DONATION_INFO.zelle.email}</div>
              </div>
            </div>
            
            <Button
              onClick={() => navigator.clipboard.writeText(DONATION_INFO.zelle.email)}
              variant="outline"
              className="mt-6 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
            >
              Copy Email Address
            </Button>
          </Card>
        </div>



        {/* Tax Information */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Sacramento Shia Muslim Association is a registered non-profit organization. 
            Donations may be tax-deductible. Please consult with your tax advisor.
          </p>
        </div>
      </div>
    </section>
  );
};
