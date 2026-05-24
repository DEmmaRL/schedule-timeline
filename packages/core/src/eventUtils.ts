import { Activity, DaySchedule, Event } from './types';

export function eventsToSchedule(events: Event[]): DaySchedule[] {
  if (!events || events.length === 0) {
    return [];
  }

  const groupedByDate = events.reduce((accumulator, event) => {
    const dateEvents = accumulator[event.date] || [];
    dateEvents.push(event);
    accumulator[event.date] = dateEvents;
    return accumulator;
  }, {} as Record<string, Event[]>);

  return Object.entries(groupedByDate)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, dayEvents]) => {
      const dateObj = new Date(`${date}T00:00:00`);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      const day = dateObj.getDate().toString();

      const activities: Activity[] = dayEvents
        .sort((left, right) => left.startTime.localeCompare(right.startTime))
        .map(event => ({
          id: event.id,
          time: `${event.startTime} - ${event.endTime}`,
          title: event.title,
          type: event.type,
          description: event.description,
          color: event.color,
          textColor: event.textColor,
        }));

      return {
        date,
        day,
        dayName,
        activities,
      };
    });
}

export function createEvent(
  title: string,
  startTime: string,
  endTime: string,
  date: string,
  options?: Partial<Omit<Event, 'title' | 'startTime' | 'endTime' | 'date'>>
): Event {
  return {
    title,
    startTime,
    endTime,
    date,
    ...options,
  };
}

export function createDayEvents(date: string, events: Omit<Event, 'date'>[]): Event[] {
  return events.map(event => ({
    ...event,
    date,
  }));
}
