import React, { useState } from 'react';

export const HijriCalendarSection: React.FC = () => {
  // Calendar view state for mobile
  const [mobileViewMode, setMobileViewMode] = useState<
    'AGENDA' | 'WEEK' | 'MONTH'
  >('AGENDA');

  // This will be replaced with the actual IMAM-US calendar embed URL
  // For now using placeholder - we'll get the real URL from IMAM-US website
  const IMAM_CALENDAR_EMBED_URL =
    'https://calendar.google.com/calendar/embed?src=social%40imam-us.org&ctz=America%2FLos_Angeles';

  // Get appropriate height for different view modes
  const getMobileHeight = (mode: string) => {
    switch (mode) {
      case 'AGENDA':
        return '500';
      case 'WEEK':
        return '400';
      case 'MONTH':
        return '450';
      default:
        return '500';
    }
  };

  // View mode options for mobile
  const viewModes = [
    { key: 'AGENDA', label: '📋 Today', icon: '📋' },
    { key: 'WEEK', label: '📆 This Week', icon: '📆' },
    { key: 'MONTH', label: '📅 This Month', icon: '📅' },
  ] as const;

  return (
    <section
      id="hijri-calendar"
      className="py-8 md:py-20 bg-white min-h-screen md:min-h-0"
    >
      <div className="container mx-auto px-4 xs:px-6">
        {/* Section Header */}
        <div className="text-center mb-6 xs:mb-12">
          <h2 className="text-2xl xs:text-3xl md:text-5xl font-bold mb-3 xs:mb-4 islamic-text-gradient leading-tight">
            📅 Shia Islamic Calendar
          </h2>
          <div className="w-16 xs:w-20 h-1 bg-islamic-gold-500 mx-auto mb-4 xs:mb-6"></div>
        </div>

        {/* Calendar Container - Mobile First Design */}
        <div className="max-w-6xl mx-auto">
          {/* Live IMAM-US Calendar */}
          <div className="block">
            {/* Desktop/Tablet View - Full Calendar */}
            <div className="hidden md:block">
              <div className="relative overflow-hidden rounded-lg shadow-lg border border-gray-200">
                <iframe
                  src={`${IMAM_CALENDAR_EMBED_URL}&mode=MONTH&height=600&wkst=1&bgcolor=%23FFFFFF&color=%23059669&showTitle=1&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0`}
                  style={{ border: 0 }}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  title="IMAM-US Hijri Calendar"
                  className="w-full"
                />
              </div>
            </div>

            {/* Mobile View - Compact Agenda */}
            <div className="block md:hidden">
              {/* Mobile View Toggle Buttons */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {viewModes.map(mode => (
                    <button
                      key={mode.key}
                      onClick={() => setMobileViewMode(mode.key)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                        mobileViewMode === mode.key
                          ? 'bg-islamic-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-1">{mode.icon}</span>
                      {mode.label.replace(mode.icon + ' ', '')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-lg shadow-lg border border-gray-200">
                <iframe
                  src={`${IMAM_CALENDAR_EMBED_URL}&mode=${mobileViewMode}&height=${getMobileHeight(mobileViewMode)}&wkst=1&bgcolor=%23FFFFFF&color=%23059669&showTitle=1&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0`}
                  style={{ border: 0 }}
                  width="100%"
                  height={getMobileHeight(mobileViewMode)}
                  frameBorder="0"
                  scrolling="no"
                  title="IMAM-US Hijri Calendar Mobile"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Information Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Live calendar • Auto-updates from IMAM-US</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Powered by{' '}
              <a
                href="https://imam-us.org/imam-hijri-calendar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-islamic-green-600 hover:underline"
              >
                IMAM-US.org
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
