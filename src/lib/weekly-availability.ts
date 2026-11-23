export type WeeklyAvailabilityWindow = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

type LocalDateTimeParts = {
  year: string;
  month: string;
  day: string;
  weekday: string;
  hour: string;
  minute: string;
  second: string;
};

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function localParts(date: Date, timeZone: string): LocalDateTimeParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: values.year,
    month: values.month,
    day: values.day,
    weekday: values.weekday,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
}

function minutesSinceMidnight(parts: LocalDateTimeParts, date: Date): number {
  return (
    Number(parts.hour) * 60 +
    Number(parts.minute) +
    Number(parts.second) / 60 +
    date.getUTCMilliseconds() / 60_000
  );
}

/**
 * Checks a requested appointment against the provider's weekly wall-clock
 * availability in the provider's IANA timezone. Overnight windows are not
 * supported by the weekly availability schema and are rejected.
 */
export function isWithinWeeklyAvailability(
  requestedDate: Date,
  durationMinutes: number | undefined,
  timeZone: string,
  windows: WeeklyAvailabilityWindow[]
): boolean {
  if (!Number.isFinite(requestedDate.getTime())) return false;

  const startParts = localParts(requestedDate, timeZone);
  const startDay = WEEKDAY_INDEX[startParts.weekday];
  const startMinute = minutesSinceMidnight(startParts, requestedDate);
  const duration = durationMinutes ?? 0;
  const endDate = new Date(requestedDate.getTime() + duration * 60_000);
  const endParts = localParts(endDate, timeZone);

  // Weekly windows cannot span midnight. This also handles DST transitions:
  // both instants are converted independently into the provider's local zone.
  const sameLocalDate =
    startParts.year === endParts.year &&
    startParts.month === endParts.month &&
    startParts.day === endParts.day;
  if (!sameLocalDate) return false;

  const endMinute = minutesSinceMidnight(endParts, endDate);

  return windows.some((window) => {
    if (window.dayOfWeek !== startDay) return false;
    const [startHour, startMinutes] = window.startTime.split(':').map(Number);
    const [endHour, endMinutes] = window.endTime.split(':').map(Number);
    const windowStart = startHour * 60 + startMinutes;
    const windowEnd = endHour * 60 + endMinutes;

    if (duration === 0) {
      return startMinute >= windowStart && startMinute < windowEnd;
    }
    return startMinute >= windowStart && endMinute <= windowEnd;
  });
}
