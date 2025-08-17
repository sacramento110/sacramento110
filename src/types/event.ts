export interface Event {
  id: string;
  title: string;
  description: string;
  dateStart: string;        // YYYY-MM-DD
  dateEnd?: string;         // YYYY-MM-DD (for multi-day events)
  time: string;            // "7:00 PM"
  speaker: string;
  hostedBy: string;
  location: string;
  imageUrl: string;        // Google Drive public URL
  imageDriveId: string;    // Google Drive file ID
  status: 'active' | 'inactive' | 'past';
  isMultiDay: boolean;
  isToday: boolean;
  isTomorrow: boolean;
  isUpcoming: boolean;
  daysRemaining?: number;  // for ongoing multi-day events
  createdAt: string;
  updatedAt: string;
  createdBy: string;       // admin email
  lastModifiedBy: string;  // admin email
}

export interface EventFormData {
  title: string;
  description: string;
  dateStart: string;
  dateEnd?: string;
  time: string;
  speaker: string;
  hostedBy: string;
  location: string;
  image: File | null;
}

export interface EventShareData {
  eventId: string;
  title: string;
  dateStart: string;
  dateEnd?: string;
  time: string;
  location: string;
  speaker: string;
  hostedBy: string;
  shareUrl: string;
}

export interface EventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

// Legacy interface for backward compatibility during migration
export interface LegacyEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  speaker: string;
  imageUrl: string;
  location?: string;
  isUpcoming: boolean;
  createdAt: string;
}
