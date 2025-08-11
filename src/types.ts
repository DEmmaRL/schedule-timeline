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
  schedule: DaySchedule[];
  config?: TimelineConfig;
  colorTheme?: ColorTheme;
  className?: string;
  onActivityClick?: (activity: Activity, dayIndex: number) => void;
  onActivityHover?: (activity: Activity, dayIndex: number) => void;
  customActivityRenderer?: (activity: Activity, style: React.CSSProperties) => React.ReactNode;
  showHeader?: boolean;
  headerClassName?: string;
  activityClassName?: string;
}

export interface TimeMarker {
  time: string;
  position: number;
}
