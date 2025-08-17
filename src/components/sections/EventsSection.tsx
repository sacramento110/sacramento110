import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Building2, ChevronRight } from 'lucide-react';
import { Event } from '@/types/event';
import { Card } from '@/components/ui/Card';
import { EventModal } from '@/components/ui/EventModal';
import { EventCardBadge, MultiDayProgress } from '@/components/ui/EventHighlight';
import { ShareEventButton } from '@/components/ui/ShareEventButton';
import { NoEventsState, LoadingEventsState, ErrorEventsState } from '@/components/ui/NoEventsState';
import { useModal } from '@/hooks/useModal';
import { 
  formatEventDateRange, 
  isEventToday, 
  isEventTomorrow, 
  isEventUpcoming,
  getDaysRemaining
} from '@/utils/dateHelpers';

export const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();

  // Enhanced mock events data with new Event interface
  const mockEvents: Event[] = [
    {
      id: 'event-1',
      title: 'Majlis E Chelum',
      description: 'Join us for the commemorative Majlis with Maulana Qasim Ali Zaidi',
      dateStart: '2025-01-20',
      time: '8:15 PM',
      speaker: 'Maulana Qasim Ali Zaidi',
      hostedBy: 'SSMA Sacramento',
      imageUrl: '/images/Ashura-E-Arabaaeen-8-10-25.JPG',
      imageDriveId: 'drive-id-1',
      location: 'SSMA Center, Sacramento',
      status: 'active',
      isMultiDay: false,
      isToday: false,
      isTomorrow: false,
      isUpcoming: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      createdBy: 'admin@ssma.org',
      lastModifiedBy: 'admin@ssma.org'
    },
    {
      id: 'event-2',
      title: 'Majlis e Khamsa',
      description: 'Five nights of lectures by Allama Yasir Naqvi',
      dateStart: '2025-01-22',
      dateEnd: '2025-01-26',
      time: '7:00 PM',
      speaker: 'Allama Yasir Naqvi',
      hostedBy: 'SSMA Sacramento',
      imageUrl: '/images/Majlis-E-Khamsa-7-21-25.JPG',
      imageDriveId: 'drive-id-2',
      location: 'SSMA Center, Sacramento',
      status: 'active',
      isMultiDay: true,
      isToday: false,
      isTomorrow: true,
      isUpcoming: true,
      daysRemaining: 5,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      createdBy: 'admin@ssma.org',
      lastModifiedBy: 'admin@ssma.org'
    },
    {
      id: 'event-3',
      title: 'Muharram 1-10',
      description: 'Ten nights of Muharram commemorations',
      dateStart: '2025-06-27',
      dateEnd: '2025-07-06',
      time: '6:30 PM',
      speaker: 'Syed Ali Haider Abidi',
      hostedBy: 'SSMA Sacramento',
      imageUrl: '/images/MajlisMuharram-06-27-25.JPG',
      imageDriveId: 'drive-id-3',
      location: 'SSMA Center, Sacramento',
      status: 'active',
      isMultiDay: true,
      isToday: false,
      isTomorrow: false,
      isUpcoming: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      createdBy: 'admin@ssma.org',
      lastModifiedBy: 'admin@ssma.org'
    }
  ];

  useEffect(() => {
    // Fetch events from Google Apps Script
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Import eventsService dynamically to avoid build issues
        const { eventsService } = await import('@/services/eventsService');
        
        // Get events from backend
        const { events: fetchedEvents } = await eventsService.getActiveEvents();
        
        // Process events with dynamic status calculation
        const processedEvents = fetchedEvents.map(event => ({
          ...event,
          isToday: isEventToday(event.dateStart, event.dateEnd),
          isTomorrow: isEventTomorrow(event.dateStart),
          isUpcoming: isEventUpcoming(event.dateStart, event.dateEnd),
          daysRemaining: getDaysRemaining(event.dateStart, event.dateEnd)
        }));
        
        setEvents(processedEvents);
        setError(null);
      } catch (err) {
        console.error('Events error:', err);
        
        // Fallback to mock data for development
        const processedEvents = mockEvents.map(event => ({
          ...event,
          isToday: isEventToday(event.dateStart, event.dateEnd),
          isTomorrow: isEventTomorrow(event.dateStart),
          isUpcoming: isEventUpcoming(event.dateStart, event.dateEnd),
          daysRemaining: getDaysRemaining(event.dateStart, event.dateEnd)
        }));
        
        setEvents(processedEvents);
        setError('Using demo data. Connect to Google Apps Script for live events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle deep link modal opening
  useEffect(() => {
    const handleOpenEventModal = (event: CustomEvent) => {
      const { eventId } = event.detail;
      const targetEvent = events.find(e => e.id === eventId);
      if (targetEvent) {
        setSelectedEvent(targetEvent);
        openModal();
      }
    };

    window.addEventListener('openEventModal', handleOpenEventModal as EventListener);
    return () => {
      window.removeEventListener('openEventModal', handleOpenEventModal as EventListener);
    };
  }, [events, openModal]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    openModal();
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    closeModal();
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Trigger refetch
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  };

  const upcomingEvents = events.filter(event => event.status === 'active' && event.isUpcoming);

  return (
    <section id="events" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="w-8 h-8 text-islamic-green-600" />
            <h2 className="text-4xl md:text-5xl font-bold islamic-text-gradient">
              Upcoming Events
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Join us for lectures, community gatherings, and religious observances
          </p>
          <div className="w-24 h-1 bg-islamic-green-500 mx-auto mt-6"></div>
        </div>

        {/* Loading State */}
        {loading && <LoadingEventsState />}

        {/* Error State */}
        {error && !loading && (
          <ErrorEventsState error={error} onRetry={handleRetry} />
        )}

        {/* Events Display */}
        {!loading && !error && upcomingEvents.length > 0 && (
          <>
            {/* Events Horizontal Scroll */}
            <div className="scroll-container">
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="flex-shrink-0 w-80 overflow-hidden hover:shadow-xl group cursor-pointer"
                  hover
                  onClick={() => handleEventClick(event)}
                >
                  {/* Event Image with Overlays */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    
                    {/* Event Status Badge */}
                    <EventCardBadge 
                      dateStart={event.dateStart}
                      dateEnd={event.dateEnd}
                    />
                    
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-islamic-green-600 text-white px-3 py-2 rounded-lg shadow-lg">
                      <div className="text-xs font-medium">
                        {formatEventDateRange(event.dateStart, event.dateEnd)}
                      </div>
                    </div>

                    {/* Multi-day Progress */}
                    {event.isMultiDay && event.daysRemaining && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <MultiDayProgress 
                          dateStart={event.dateStart}
                          dateEnd={event.dateEnd!}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Event Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-xl text-gray-800 group-hover:text-islamic-green-600 transition-colors flex-1">
                        {event.title}
                      </h3>
                      <ShareEventButton 
                        event={event} 
                        variant="icon"
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-3">
                      {/* Speaker */}
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <User className="w-4 h-4 text-islamic-green-600" />
                        <span className="font-medium">{event.speaker}</span>
                      </div>
                      
                      {/* Time */}
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-islamic-green-600" />
                        <span>{event.time}</span>
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-islamic-green-600" />
                        <span>{event.location}</span>
                      </div>

                      {/* Hosted By */}
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Building2 className="w-4 h-4 text-islamic-green-600" />
                        <span>{event.hostedBy}</span>
                      </div>
                    </div>
                    
                    {/* View Details Button */}
                    <div className="mt-6">
                      <button className="flex items-center space-x-2 text-islamic-green-600 hover:text-islamic-green-700 font-medium transition-colors group/btn">
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Mobile Scroll Hint */}
            <div className="mt-6 text-center md:hidden">
              <p className="text-sm text-gray-500">
                Swipe horizontally to see more events
              </p>
            </div>
          </>
        )}

        {/* No Events State */}
        {!loading && !error && upcomingEvents.length === 0 && (
          <NoEventsState />
        )}

        {/* Event Modal */}
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </section>
  );
};
