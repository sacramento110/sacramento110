import React from 'react';
import { Calendar, Clock, Zap } from 'lucide-react';
import { getEventStatus, getDaysRemaining } from '@/utils/dateHelpers';

interface EventHighlightProps {
  dateStart: string;
  dateEnd?: string;
  className?: string;
}

export const EventHighlight: React.FC<EventHighlightProps> = ({ 
  dateStart, 
  dateEnd, 
  className = '' 
}) => {
  const status = getEventStatus(dateStart, dateEnd);
  const daysRemaining = getDaysRemaining(dateStart, dateEnd);

  const getHighlightConfig = () => {
    switch (status) {
      case 'today':
        return {
          text: 'Today',
          icon: <Zap className="w-3 h-3" />,
          className: 'bg-red-500 text-white border-red-600 shadow-red-500/50 animate-pulse'
        };
      
      case 'tomorrow':
        return {
          text: 'Tomorrow',
          icon: <Calendar className="w-3 h-3" />,
          className: 'bg-orange-500 text-white border-orange-600 shadow-orange-500/50'
        };
      
      case 'ongoing':
        return {
          text: `Day ${daysRemaining} left`,
          icon: <Clock className="w-3 h-3" />,
          className: 'bg-blue-500 text-white border-blue-600 shadow-blue-500/50'
        };
      
      default:
        return null;
    }
  };

  const config = getHighlightConfig();

  if (!config) return null;

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold border-2 shadow-lg ${config.className} ${className}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

interface EventCardBadgeProps {
  dateStart: string;
  dateEnd?: string;
  className?: string;
}

export const EventCardBadge: React.FC<EventCardBadgeProps> = ({ 
  dateStart, 
  dateEnd, 
  className = '' 
}) => {
  const status = getEventStatus(dateStart, dateEnd);

  if (status === 'upcoming' || status === 'past') return null;

  return (
    <div className={`absolute top-4 right-4 z-10 ${className}`}>
      <EventHighlight 
        dateStart={dateStart} 
        dateEnd={dateEnd} 
      />
    </div>
  );
};

interface MultiDayProgressProps {
  dateStart: string;
  dateEnd: string;
  className?: string;
}

export const MultiDayProgress: React.FC<MultiDayProgressProps> = ({ 
  dateStart, 
  dateEnd, 
  className = '' 
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(dateStart);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(dateEnd);
  endDate.setHours(0, 0, 0, 0);
  
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const elapsedDays = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const currentDay = Math.min(totalDays, elapsedDays + 1);
  const progress = (currentDay / totalDays) * 100;

  // Only show if event is ongoing
  if (today < startDate || today > endDate) return null;

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-lg p-2 ${className}`}>
      <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
        <span>Day {currentDay} of {totalDays}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-islamic-green-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
