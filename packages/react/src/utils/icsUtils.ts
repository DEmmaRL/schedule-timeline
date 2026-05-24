import { Event } from '../types';

/**
 * Convierte eventos a formato ICS (estándar de calendarios)
 */
export function eventsToICS(events: Event[], calendarName: string = 'Schedule'): string {
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Schedule Timeline//Schedule Timeline//EN',
    `X-WR-CALNAME:${calendarName}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  events.forEach(event => {
    const startDateTime = formatICSDateTime(event.date, event.startTime);
    const endDateTime = formatICSDateTime(event.date, event.endTime);
    const uid = event.id ? `${event.id}@schedule-timeline` : `${startDateTime}-${event.title.replace(/\s+/g, '-')}@schedule-timeline`;
    
    icsLines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      `SUMMARY:${escapeICSText(event.title)}`,
      ...(event.description ? [`DESCRIPTION:${escapeICSText(event.description)}`] : []),
      ...(event.type ? [`CATEGORIES:${escapeICSText(event.type)}`] : []),
      `DTSTAMP:${formatICSDateTime(new Date().toISOString().split('T')[0], new Date().toTimeString().slice(0, 5))}`,
      'END:VEVENT'
    );
  });

  icsLines.push('END:VCALENDAR');
  return icsLines.join('\r\n');
}

/**
 * Convierte contenido ICS a eventos
 */
export function icsToEvents(icsContent: string): Event[] {
  const events: Event[] = [];
  const lines = icsContent.split(/\r?\n/);
  
  let currentEvent: Partial<Event> = {};
  let inEvent = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {};
    } else if (line === 'END:VEVENT' && inEvent) {
      if (currentEvent.title && currentEvent.startTime && currentEvent.endTime && currentEvent.date) {
        events.push(currentEvent as Event);
      }
      inEvent = false;
    } else if (inEvent) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.substring(0, colonIndex);
      const value = line.substring(colonIndex + 1);
      
      switch (key) {
        case 'SUMMARY':
          currentEvent.title = unescapeICSText(value);
          break;
        case 'DESCRIPTION':
          currentEvent.description = unescapeICSText(value);
          break;
        case 'DTSTART':
          const startParsed = parseICSDateTime(value);
          currentEvent.date = startParsed.date;
          currentEvent.startTime = startParsed.time;
          break;
        case 'DTEND':
          const endParsed = parseICSDateTime(value);
          currentEvent.endTime = endParsed.time;
          break;
        case 'CATEGORIES':
          currentEvent.type = unescapeICSText(value);
          break;
        case 'UID':
          // Extraer ID si tiene el formato esperado
          const uidMatch = value.match(/^(\d+)@/);
          if (uidMatch) {
            currentEvent.id = parseInt(uidMatch[1]);
          }
          break;
      }
    }
  }
  
  return events;
}

/**
 * Descarga eventos como archivo ICS
 */
export function downloadICS(events: Event[], filename: string = 'schedule.ics', calendarName?: string): void {
  const icsContent = eventsToICS(events, calendarName);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Carga eventos desde un archivo ICS
 */
export function loadICSFile(file: File): Promise<Event[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const events = icsToEvents(content);
        resolve(events);
      } catch (error) {
        reject(new Error('Error parsing ICS file: ' + error));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

// Funciones auxiliares
function formatICSDateTime(date: string, time: string): string {
  // Convertir "2024-03-21" y "09:00" a "20240321T090000"
  const datePart = date.replace(/-/g, '');
  const timePart = time.replace(':', '') + '00';
  return `${datePart}T${timePart}`;
}

function parseICSDateTime(icsDateTime: string): { date: string; time: string } {
  // Convertir "20240321T090000" a { date: "2024-03-21", time: "09:00" }
  if (icsDateTime.length >= 15) {
    const year = icsDateTime.substring(0, 4);
    const month = icsDateTime.substring(4, 6);
    const day = icsDateTime.substring(6, 8);
    const hour = icsDateTime.substring(9, 11);
    const minute = icsDateTime.substring(11, 13);
    
    return {
      date: `${year}-${month}-${day}`,
      time: `${hour}:${minute}`
    };
  }
  
  // Fallback
  return {
    date: new Date().toISOString().split('T')[0],
    time: '00:00'
  };
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

function unescapeICSText(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}
