export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getTimeUntil = (targetTime: string): string => {
  const now = new Date();
  const [time, period] = targetTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let targetHours = hours;
  if (period === 'PM' && hours !== 12) targetHours += 12;
  if (period === 'AM' && hours === 12) targetHours = 0;
  
  const target = new Date();
  target.setHours(targetHours, minutes, 0, 0);
  
  // If target time has passed today, set it for tomorrow
  if (target < now) {
    target.setDate(target.getDate() + 1);
  }
  
  const diff = target.getTime() - now.getTime();
  const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
  const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hoursLeft > 0) {
    return `${hoursLeft}h ${minutesLeft}m`;
  }
  return `${minutesLeft}m`;
};

export const getTimeUntilWithSeconds = (targetTime: string): string => {
  const now = new Date();
  const [time, period] = targetTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let targetHours = hours;
  if (period === 'PM' && hours !== 12) targetHours += 12;
  if (period === 'AM' && hours === 12) targetHours = 0;
  
  const target = new Date();
  target.setHours(targetHours, minutes, 0, 0);
  
  // If target time has passed today, set it for tomorrow
  if (target < now) {
    target.setDate(target.getDate() + 1);
  }
  
  const diff = target.getTime() - now.getTime();
  const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
  const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (hoursLeft > 0) {
    return `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;
  } else if (minutesLeft > 0) {
    return `${minutesLeft}m ${secondsLeft}s`;
  } else {
    return `${secondsLeft}s`;
  }
};



export const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatEventDateRange = (dateStart: string, dateEnd?: string): string => {
  if (!dateEnd) return formatEventDate(dateStart);
  
  const startDate = new Date(dateStart);
  const endDate = new Date(dateEnd);
  
  // Same year
  if (startDate.getFullYear() === endDate.getFullYear()) {
    // Same month
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${endDate.getDate()}, ${startDate.getFullYear()}`;
    }
    // Different months, same year
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${startDate.getFullYear()}`;
  }
  
  // Different years
  return `${formatEventDate(dateStart)} - ${formatEventDate(dateEnd)}`;
};

export const isEventToday = (dateStart: string, dateEnd?: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(dateStart);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = dateEnd ? new Date(dateEnd) : startDate;
  endDate.setHours(23, 59, 59, 999);
  
  return today >= startDate && today <= endDate;
};

export const isEventTomorrow = (dateStart: string): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const eventStart = new Date(dateStart);
  eventStart.setHours(0, 0, 0, 0);
  
  return tomorrow.getTime() === eventStart.getTime();
};

export const isEventUpcoming = (dateStart: string, dateEnd?: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const eventEndDate = dateEnd ? new Date(dateEnd) : new Date(dateStart);
  eventEndDate.setHours(23, 59, 59, 999);
  
  return eventEndDate >= today;
};

export const getDaysRemaining = (dateStart: string, dateEnd?: string): number | undefined => {
  if (!dateEnd) return undefined;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(dateStart);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(dateEnd);
  endDate.setHours(23, 59, 59, 999);
  
  // If event hasn't started yet, return undefined
  if (today < startDate) return undefined;
  
  // If event has ended, return undefined
  if (today > endDate) return undefined;
  
  // Calculate days remaining (including today)
  const diffTime = endDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getEventStatus = (dateStart: string, dateEnd?: string): 'today' | 'tomorrow' | 'upcoming' | 'ongoing' | 'past' => {
  if (isEventToday(dateStart, dateEnd)) {
    return dateEnd && getDaysRemaining(dateStart, dateEnd) ? 'ongoing' : 'today';
  }
  
  if (isEventTomorrow(dateStart)) {
    return 'tomorrow';
  }
  
  if (isEventUpcoming(dateStart, dateEnd)) {
    return 'upcoming';
  }
  
  return 'past';
};
