export interface Event {
  id?: string | number;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  type?: string;
  description?: string;
  color?: string;
  textColor?: string;
}

export interface Activity {
  id?: string | number;
  time: string;
  title: string;
  type?: string;
  description?: string;
  color?: string;
  textColor?: string;
}

export interface DaySchedule {
  date: string;
  day: string;
  dayName: string;
  activities: Activity[];
}

export interface TimelineConfig {
  startHour?: number;
  endHour?: number;
  pixelsPerMinute?: number;
  showTimeMarkers?: boolean;
  timeMarkerInterval?: number;
  responsive?: boolean;
}

export interface ColorTheme {
  [type: string]: {
    background: string;
    text: string;
  };
}

export interface TimeMarker {
  time: string;
  position: number;
}
