import React, { useState } from 'react';
import { Share2, MessageCircle, Copy, Check } from 'lucide-react';
import { Event } from '@/types/event';
import { formatEventDateRange } from '@/utils/dateHelpers';

interface ShareEventButtonProps {
  event: Event;
  className?: string;
  variant?: 'icon' | 'button';
}

export const ShareEventButton: React.FC<ShareEventButtonProps> = ({ 
  event, 
  className = '',
  variant = 'icon'
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateEventURL = (): string => {
    return `${window.location.origin}/events/${event.id}`;
  };

  const generateWhatsAppShareURL = (): string => {
    const eventURL = generateEventURL();
    const message = `🕌 ${event.title}\n\n` +
      `📅 ${formatEventDateRange(event.dateStart, event.dateEnd)}\n` +
      `🕐 ${event.time}\n` +
      `👤 Speaker: ${event.speaker}\n` +
      `📍 ${event.location}\n` +
      `🏢 Hosted by ${event.hostedBy}\n\n` +
      `View details: ${eventURL}`;
    
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  const copyEventLink = async (): Promise<void> => {
    try {
      const eventURL = generateEventURL();
      await navigator.clipboard.writeText(eventURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generateEventURL();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToWhatsApp = (): void => {
    const whatsappURL = generateWhatsAppShareURL();
    window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const handleShare = (): void => {
    if (navigator.share) {
      // Use native sharing if available
      navigator.share({
        title: event.title,
        text: `Join us for ${event.title} on ${formatEventDateRange(event.dateStart, event.dateEnd)} at ${event.time}`,
        url: generateEventURL()
      }).catch(console.error);
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  return (
    <div className="relative">
      {variant === 'icon' ? (
        <button
          onClick={handleShare}
          className={`p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm ${className}`}
          aria-label="Share event"
        >
          <Share2 className="w-5 h-5 text-white" />
        </button>
      ) : (
        <button
          onClick={handleShare}
          className={`flex items-center space-x-2 px-3 py-2 bg-islamic-green-600 hover:bg-islamic-green-700 text-white rounded-lg transition-colors ${className}`}
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      )}

      {/* Share menu */}
      {showShareMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowShareMenu(false)}
          />
          
          {/* Share options */}
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50">
            <button
              onClick={shareToWhatsApp}
              className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700"
            >
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span>Share on WhatsApp</span>
            </button>
            
            <button
              onClick={copyEventLink}
              className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
              <span>{copied ? 'Link copied!' : 'Copy link'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
