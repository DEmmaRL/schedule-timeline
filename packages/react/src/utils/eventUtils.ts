import { Event, DaySchedule, Activity } from '../types';

/**
 * Convierte un array de eventos a formato de schedule
 * Esta es la única conversión que necesitamos - simple y flexible
 */
export function eventsToSchedule(events: Event[]): DaySchedule[] {
  // Agrupar eventos por fecha
  const groupedByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Convertir a formato DaySchedule
  return Object.entries(groupedByDate)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB)) // Ordenar por fecha
    .map(([date, dayEvents]) => {
      const dateObj = new Date(date);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      const dayNumber = dateObj.getDate().toString();

      // Convertir eventos a actividades
      const activities: Activity[] = dayEvents
        .sort((a, b) => a.startTime.localeCompare(b.startTime)) // Ordenar por hora
        .map(event => ({
          id: event.id,
          time: `${event.startTime} - ${event.endTime}`,
          title: event.title,
          description: event.description,
          type: event.type,
          color: event.color,
          textColor: event.textColor,
        }));

      return {
        date,
        day: dayNumber,
        dayName,
        activities,
      };
    });
}

/**
 * Función helper para crear eventos fácilmente
 */
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

/**
 * Función helper para crear múltiples eventos del mismo día
 */
export function createDayEvents(
  date: string,
  events: Array<{
    title: string;
    startTime: string;
    endTime: string;
    type?: string;
    description?: string;
    color?: string;
    textColor?: string;
  }>
): Event[] {
  return events.map((event, index) => ({
    id: `${date}-${index}`,
    date,
    ...event,
  }));
}
