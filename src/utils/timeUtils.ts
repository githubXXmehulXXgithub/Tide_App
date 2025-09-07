import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const formatTideTime = (timestamp: number): string => {
  return dayjs.unix(timestamp).format('MMM D, h:mm A');
};

export const getTimeUntilTide = (timestamp: number): string => {
  const tideTime = dayjs.unix(timestamp);
  const now = dayjs();
  
  if (tideTime.isBefore(now)) {
    return 'Past';
  }
  
  const duration = tideTime.diff(now);
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const getCurrentTime = (): string => {
  return dayjs().format('MMM D, YYYY • h:mm:ss A');
};

export const isUpcomingTide = (timestamp: number): boolean => {
  return dayjs.unix(timestamp).isAfter(dayjs());
};