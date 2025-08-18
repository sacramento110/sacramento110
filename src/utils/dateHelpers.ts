export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
