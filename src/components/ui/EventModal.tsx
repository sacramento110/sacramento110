import React from 'react';
import { Modal } from './Modal';
import { EventModalProps } from '@/types/event';
import { formatEventDateRange } from '@/utils/dateHelpers';
import { Calendar, Clock, MapPin, User, Building2 } from 'lucide-react';
import { ShareEventButton } from './ShareEventButton';

export const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="event-modal relative">
        {/* Full-size event image */}
        <div className="relative">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            loading="lazy"
          />
          
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg"></div>
          
          {/* Event details overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{event.title}</h2>
                {event.description && (
                  <p className="text-gray-200 mb-4 text-sm md:text-base">{event.description}</p>
                )}
              </div>
              
              {/* Share button */}
              <ShareEventButton event={event} />
            </div>
            
            {/* Event information grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
              {/* Date */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-islamic-green-400 flex-shrink-0" />
                <span>{formatEventDateRange(event.dateStart, event.dateEnd)}</span>
              </div>
              
              {/* Time */}
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-islamic-green-400 flex-shrink-0" />
                <span>{event.time}</span>
              </div>
              
              {/* Speaker */}
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-islamic-green-400 flex-shrink-0" />
                <span>{event.speaker}</span>
              </div>
              
              {/* Location */}
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-islamic-green-400 flex-shrink-0" />
                <span>{event.location}</span>
              </div>
              
              {/* Hosted by */}
              <div className="flex items-center space-x-2 md:col-span-2">
                <Building2 className="w-4 h-4 text-islamic-green-400 flex-shrink-0" />
                <span>Hosted by {event.hostedBy}</span>
              </div>
            </div>
            
            {/* Multi-day indicator */}
            {event.isMultiDay && event.daysRemaining && (
              <div className="mt-4 inline-block bg-islamic-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                Day {(new Date(event.dateEnd!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) + 1 - (event.daysRemaining)} of {Math.ceil((new Date(event.dateEnd!).getTime() - new Date(event.dateStart).getTime()) / (1000 * 60 * 60 * 24)) + 1}
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile-friendly additional info section */}
        <div className="md:hidden mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Event Details</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Date:</strong> {formatEventDateRange(event.dateStart, event.dateEnd)}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Speaker:</strong> {event.speaker}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Hosted by:</strong> {event.hostedBy}</p>
            {event.description && (
              <p><strong>Description:</strong> {event.description}</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
