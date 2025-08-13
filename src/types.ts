export interface Activity {
  id?: string | number;
  time: string;
  title: string;
  type?: string;
  description?: string;
  color?: string;
  textColor?: string;
}

// Nuevo tipo de evento simple y flexible
export interface Event {
  id?: string | number;
  title: string;
  description?: string;
  startTime: string; // "09:00" o "09:30"
  endTime: string;   // "10:00" o "10:30"
  date: string;      // "2024-03-21" (YYYY-MM-DD)
  type?: string;     // Para theming
  color?: string;
  textColor?: string;
}

export interface DaySchedule {
  date: string;
  day: string;
  activities: Activity[];
}

export interface TimelineConfig {
  startHour?: number;
  endHour?: number;
  pixelsPerMinute?: number;
  showTimeMarkers?: boolean;
  timeMarkerInterval?: number; // in minutes
  responsive?: boolean;
}

export interface ColorTheme {
  [key: string]: {
    background: string;
    text?: string;
    border?: string;
  };
}

export interface ScheduleTimelineProps {
  // Mantener schedule para compatibilidad hacia atrás
  schedule?: DaySchedule[];
  
  // Nueva prop más flexible - array de eventos
  events?: Event[];
  
  config?: TimelineConfig;
  colorTheme?: ColorTheme;
  className?: string;
  
  // Handlers para el formato schedule (compatibilidad)
  onActivityClick?: (activity: Activity, dayIndex: number) => void;
  onActivityHover?: (activity: Activity, dayIndex: number) => void;
  
  // Handlers para el formato events (nuevo)
  onEventClick?: (event: Event) => void;
  onEventHover?: (event: Event) => void;
  
  // Renderers personalizados
  customActivityRenderer?: (activity: Activity, style: React.CSSProperties) => React.ReactNode;
  customEventRenderer?: (event: Event, style: React.CSSProperties) => React.ReactNode;
  
  showHeader?: boolean;
  headerClassName?: string;
  activityClassName?: string;
}

export interface TimeMarker {
  time: string;
  position: number;
}
