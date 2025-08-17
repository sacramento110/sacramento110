import React from 'react';
import { Calendar, Clock, Bell } from 'lucide-react';

interface NoEventsStateProps {
  title?: string;
  message?: string;
  subMessage?: string;
  showNewsletter?: boolean;
  className?: string;
}

export const NoEventsState: React.FC<NoEventsStateProps> = ({
  title = "No Upcoming Events",
  message = "There are currently no upcoming events scheduled.",
  subMessage = "Please check back later for new announcements.",
  showNewsletter = true,
  className = ""
}) => {
  const scrollToNewsletter = () => {
    const newsletterSection = document.getElementById('newsletter');
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`text-center py-16 px-4 ${className}`}>
      {/* Animated Calendar Icon */}
      <div className="relative mb-8">
        <Calendar className="w-20 h-20 text-gray-300 mx-auto" />
        <div className="absolute -top-2 -right-2">
          <Clock className="w-8 h-8 text-gray-400 animate-pulse" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-md mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-2 text-lg">
          {message}
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          {subMessage}
        </p>
        
        {/* Call to Action */}
        {showNewsletter && (
          <div className="space-y-4">
            <div className="bg-islamic-green-50 border border-islamic-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Bell className="w-5 h-5 text-islamic-green-600" />
                <span className="font-medium text-islamic-green-800">Stay Updated</span>
              </div>
              <p className="text-sm text-islamic-green-700 mb-3">
                Subscribe to our newsletter to be the first to know about upcoming events and announcements.
              </p>
              <button
                onClick={scrollToNewsletter}
                className="bg-islamic-green-600 hover:bg-islamic-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Subscribe to Newsletter
              </button>
            </div>
            
            {/* Alternative suggestions */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>You can also:</p>
              <div className="space-x-4">
                <span>• Follow us on social media</span>
                <span>• Check our YouTube channel</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="mt-12 flex justify-center space-x-2">
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

interface LoadingEventsStateProps {
  className?: string;
}

export const LoadingEventsState: React.FC<LoadingEventsStateProps> = ({ className = "" }) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="relative mb-6">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto animate-pulse" />
      </div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading Events...</h3>
      <p className="text-gray-500">Please wait while we fetch the latest events.</p>
      
      {/* Loading skeleton */}
      <div className="mt-8 max-w-4xl mx-auto">
        <div className="flex space-x-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-80 bg-gray-100 rounded-lg animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ErrorEventsStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorEventsState: React.FC<ErrorEventsStateProps> = ({ 
  error, 
  onRetry, 
  className = "" 
}) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="relative mb-6">
        <Calendar className="w-16 h-16 text-red-300 mx-auto" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">!</span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-red-600 mb-2">Unable to Load Events</h3>
      <p className="text-gray-600 mb-4">{error}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-islamic-green-600 hover:bg-islamic-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
