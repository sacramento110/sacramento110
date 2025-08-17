import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';


export const PrayerTimesSection: React.FC = () => {
  const { prayerTimesArray, loading, error, refetch } = usePrayerTimes();

  if (loading) {
    return (
      <section id="prayer-times" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading prayer times...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="prayer-times" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refetch} icon={RefreshCw}>
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="prayer-times" className="py-20 bg-gradient-to-br from-islamic-green-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="w-8 h-8 text-islamic-green-600" />
            <h2 className="text-4xl md:text-5xl font-bold islamic-text-gradient">
              Prayer Times
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Daily prayer times following the Shia Jafaria method
          </p>
          
          {/* Date */}
          <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>



        {/* Prayer Times Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
          {prayerTimesArray.map((prayer) => (
            <Card
              key={prayer.name}
              className={`prayer-card ${prayer.isActive ? 'active' : ''}`}
            >
              {/* Prayer Icon */}
              <div className="text-4xl mb-3">
                {prayer.icon}
              </div>
              
              {/* Prayer Name */}
              <h3 className={`font-semibold text-lg mb-2 ${
                prayer.isActive ? 'text-islamic-green-700' : 'text-gray-800'
              }`}>
                {prayer.name}
              </h3>
              
              {/* Prayer Time */}
              <p className={`text-xl font-bold ${
                prayer.isActive ? 'text-islamic-green-600' : 'text-gray-700'
              }`}>
                {prayer.time}
              </p>
              
              {/* Active Indicator */}
              {prayer.isActive && (
                <div className="mt-3">
                  <span className="inline-block bg-islamic-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Next
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>



        {/* Mobile Optimization Note */}
        <div className="mt-8 md:hidden">
          <p className="text-xs text-gray-500 text-center">
            Swipe horizontally to view all prayer times
          </p>
        </div>
      </div>
    </section>
  );
};
