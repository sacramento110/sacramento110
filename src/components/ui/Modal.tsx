import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  fullscreen?: boolean;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  fullscreen = false,
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      {fullscreen ? (
        <div className="flex items-center justify-center min-h-screen w-full h-screen py-1 xs:py-2 sm:py-3 md:py-4">
          {/* Close Button for fullscreen */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-2 right-2 xs:top-4 xs:right-4 bg-black bg-opacity-50 text-white rounded-full p-2 xs:p-3 hover:bg-opacity-70 transition-colors z-20 touch-friendly"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
            </button>
          )}
          {children}
        </div>
      ) : (
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 xs:-top-4 xs:-right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10 border-2 border-gray-200 touch-friendly"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 xs:w-6 xs:h-6 text-gray-600" />
          </button>

          {title && (
            <div className="px-4 xs:px-6 py-3 xs:py-4 border-b border-gray-200">
              <h2 className="text-lg xs:text-xl font-semibold text-gray-900">
                {title}
              </h2>
            </div>
          )}

          <div className="p-0 overflow-y-auto max-h-[70vh]">{children}</div>
        </div>
      )}
    </div>,
    document.body
  );
};
