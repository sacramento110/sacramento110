import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { Clock, RefreshCw } from 'lucide-react';
import React from 'react';
import { QiblaSection } from './QiblaSection';

export const PrayerTimesSection: React.FC = () => {
  const { prayerTimesArray, loading, error, refetch } = usePrayerTimes();

  if (loading) {
    return (
      <section
        id="prayer-times"
        className="py-8 md:py-20 bg-white min-h-screen md:min-h-0"
      >
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
      <section
        id="prayer-times"
        className="py-8 md:py-20 bg-white min-h-screen md:min-h-0"
      >
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
    <section
      id="prayer-times"
      className="py-20 bg-gradient-to-br from-islamic-green-50 to-white"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="w-8 h-8 text-islamic-green-600" />
            <h2 className="text-4xl md:text-5xl font-bold islamic-text-gradient">
              Prayer Times
            </h2>
          </div>

          {/* Date */}
          <div className="flex items-center justify-center mt-3 md:mt-6 text-sm text-gray-500">
            <span>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Prayer Times Grid - Desktop */}
        <div
          className="hidden md:grid gap-4 max-w-6xl mx-auto"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          }}
        >
          {prayerTimesArray.map(prayer => (
            <Card
              key={prayer.name}
              className={`prayer-card ${prayer.isActive ? 'active' : ''}`}
            >
              {/* Prayer Icon */}
              <div className="text-3xl xs:text-4xl mb-2 xs:mb-3">
                {prayer.icon}
              </div>

              {/* Prayer Name */}
              <h3
                className={`font-semibold text-base xs:text-lg mb-1 xs:mb-2 ${
                  prayer.isActive ? 'text-islamic-green-700' : 'text-gray-800'
                }`}
              >
                {prayer.name}
              </h3>

              {/* Prayer Time */}
              <p
                className={`text-lg xs:text-xl font-bold ${
                  prayer.isActive ? 'text-islamic-green-600' : 'text-gray-700'
                }`}
              >
                {prayer.time}
              </p>

              {/* Active Indicator */}
              {prayer.isActive && (
                <div className="mt-2 xs:mt-3">
                  <span className="inline-block bg-islamic-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Next
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Prayer Times Horizontal Scroll - Mobile */}
        <div className="md:hidden">
          {/* Mobile Scroll Hint */}
          <div className="mb-4 text-center">
            <p className="text-xs text-gray-500">
              Swipe horizontally to view all prayer times
            </p>
          </div>

          <div className="scroll-container mobile-scroll px-4 -mx-4">
            {prayerTimesArray.map(prayer => (
              <Card
                key={prayer.name}
                className={`prayer-card flex-shrink-0 w-36 xs:w-40 ${prayer.isActive ? 'active' : ''}`}
              >
                {/* Prayer Icon */}
                <div className="text-2xl xs:text-3xl mb-2">{prayer.icon}</div>

                {/* Prayer Name */}
                <h3
                  className={`font-semibold text-sm xs:text-base mb-1 ${
                    prayer.isActive ? 'text-islamic-green-700' : 'text-gray-800'
                  }`}
                >
                  {prayer.name}
                </h3>

                {/* Prayer Time */}
                <p
                  className={`text-base xs:text-lg font-bold ${
                    prayer.isActive ? 'text-islamic-green-600' : 'text-gray-700'
                  }`}
                >
                  {prayer.time}
                </p>

                {/* Active Indicator */}
                {prayer.isActive && (
                  <div className="mt-2">
                    <span className="inline-block bg-islamic-green-600 text-white text-xs px-2 py-1 rounded-full">
                      Next
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Qibla Direction Finder - Mobile Only, Collapsible */}
        <div className="mt-8 md:mt-12 max-w-md mx-auto">
          <QiblaSection />
        </div>
      </div>
    </section>
  );
};
