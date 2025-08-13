import { createEvents, EventAttributes } from 'ics';
import { DaySchedule, Activity } from '../types';

// Interfaz para datos de base de datos
export interface DatabaseActivity {
  id: string | number;
  title: string;
  description?: string;
  startTime: string; // ISO string o formato de tiempo
  endTime: string;
  date: string; // YYYY-MM-DD
  type?: string;
  color?: string;
  textColor?: string;
}

export interface DatabaseSchedule {
  activities: DatabaseActivity[];
  metadata?: {
    title?: string;
    description?: string;
    timezone?: string;
  };
}

/**
 * Convierte datos de base de datos a formato de schedule
 */
export function convertDatabaseToSchedule(dbData: DatabaseSchedule): DaySchedule[] {
  const groupedByDate = dbData.activities.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, DatabaseActivity[]>);

  return Object.entries(groupedByDate).map(([date, activities]) => {
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNumber = dateObj.getDate().toString();

    const scheduleActivities: Activity[] = activities.map(activity => ({
      id: activity.id,
      time: `${formatTime(activity.startTime)} - ${formatTime(activity.endTime)}`,
      title: activity.title,
      description: activity.description,
      type: activity.type,
      color: activity.color,
      textColor: activity.textColor,
    }));

    return {
      day: dayNumber,
      date: date,
      dayName,
      activities: scheduleActivities,
    };
  });
}

/**
 * Convierte schedule a formato de base de datos
 */
export function convertScheduleToDatabase(schedule: DaySchedule[], year: number = new Date().getFullYear()): DatabaseSchedule {
  const activities: DatabaseActivity[] = [];

  schedule.forEach(daySchedule => {
    const month = new Date().getMonth(); // Puedes parametrizar esto
    const date = new Date(year, month, parseInt(daySchedule.day));
    const dateString = date.toISOString().split('T')[0];

    daySchedule.activities.forEach(activity => {
      const [startTime, endTime] = parseTimeRange(activity.time);
      
      activities.push({
        id: activity.id || `${dateString}-${activity.title.replace(/\s+/g, '-').toLowerCase()}`,
        title: activity.title,
        description: activity.description,
        startTime,
        endTime,
        date: dateString,
        type: activity.type,
        color: activity.color,
        textColor: activity.textColor,
      });
    });
  });

  return { activities };
}

/**
 * Exporta schedule a formato ICS
 */
export function exportToICS(schedule: DaySchedule[], title: string = 'Schedule', year: number = new Date().getFullYear()): Promise<string> {
  const events: EventAttributes[] = [];

  schedule.forEach(daySchedule => {
    const month = new Date().getMonth();
    const date = new Date(year, month, parseInt(daySchedule.day));

    daySchedule.activities.forEach(activity => {
      const [startTime, endTime] = parseTimeRange(activity.time);
      const startDate = new Date(`${date.toDateString()} ${startTime}`);
      const endDate = new Date(`${date.toDateString()} ${endTime}`);

      events.push({
        title: activity.title,
        description: activity.description || '',
        start: [
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate(),
          startDate.getHours(),
          startDate.getMinutes()
        ],
        end: [
          endDate.getFullYear(),
          endDate.getMonth() + 1,
          endDate.getDate(),
          endDate.getHours(),
          endDate.getMinutes()
        ],
        uid: activity.id?.toString() || `${startDate.getTime()}-${activity.title}`,
        categories: activity.type ? [activity.type] : undefined,
      });
    });
  });

  return new Promise((resolve, reject) => {
    createEvents(events, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value || '');
      }
    });
  });
}

/**
 * Importa desde formato ICS (básico)
 */
export function parseICSToSchedule(icsContent: string): DaySchedule[] {
  // Implementación básica - podrías usar una librería más robusta como node-ical
  const lines = icsContent.split('\n');
  const events: any[] = [];
  let currentEvent: any = {};
  let inEvent = false;

  lines.forEach(line => {
    const trimmed = line.trim();
    
    if (trimmed === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {};
    } else if (trimmed === 'END:VEVENT') {
      inEvent = false;
      events.push(currentEvent);
    } else if (inEvent) {
      const [key, ...valueParts] = trimmed.split(':');
      const value = valueParts.join(':');
      
      if (key === 'SUMMARY') {
        currentEvent.title = value;
      } else if (key === 'DESCRIPTION') {
        currentEvent.description = value;
      } else if (key === 'DTSTART') {
        currentEvent.start = parseICSDateTime(value);
      } else if (key === 'DTEND') {
        currentEvent.end = parseICSDateTime(value);
      }
    }
  });

  // Convertir eventos a formato de schedule
  const groupedByDate = events.reduce((acc: Record<string, any[]>, event: any) => {
    if (!event.start) return acc;
    
    const date = event.start.toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, any[]>);

  return Object.entries(groupedByDate).map(([dateString, events]) => {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNumber = date.getDate().toString();

    const activities: Activity[] = events.map((event: any) => ({
      time: `${formatTime(event.start)} - ${formatTime(event.end)}`,
      title: event.title || 'Untitled Event',
      description: event.description,
    }));

    return {
      day: dayNumber,
      date: dateString,
      dayName,
      activities,
    };
  });
}

// Funciones auxiliares
function formatTime(timeInput: string | Date): string {
  let date: Date;
  
  if (typeof timeInput === 'string') {
    // Si es string, asumimos formato HH:MM o ISO
    if (timeInput.includes('T')) {
      date = new Date(timeInput);
    } else {
      date = new Date(`2000-01-01T${timeInput}`);
    }
  } else {
    date = timeInput;
  }
  
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  });
}

function parseTimeRange(timeRange: string): [string, string] {
  const [start, end] = timeRange.split(' - ').map(t => t.trim());
  return [start, end];
}

function parseICSDateTime(icsDateTime: string): Date {
  // Formato básico YYYYMMDDTHHMMSS
  if (icsDateTime.length >= 15) {
    const year = parseInt(icsDateTime.substr(0, 4));
    const month = parseInt(icsDateTime.substr(4, 2)) - 1;
    const day = parseInt(icsDateTime.substr(6, 2));
    const hour = parseInt(icsDateTime.substr(9, 2));
    const minute = parseInt(icsDateTime.substr(11, 2));
    const second = parseInt(icsDateTime.substr(13, 2));
    
    return new Date(year, month, day, hour, minute, second);
  }
  
  return new Date();
}
