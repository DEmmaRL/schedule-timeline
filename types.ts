/**
 * Represents a single event with a specific start and end time on a given date.
 * This is the primary data format for the schedule.
 */
export interface Event {
  id?: string | number;
  title: string;
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "12:00"
  date: string; // e.g., "2024-03-21"
  type?: string;
  description?: string;
  color?: string;
  textColor?: string;
}

/**
 * Represents an activity once it has been processed for rendering within a specific day.
 * This is mostly for internal use by the renderer.
 */
export interface Activity {
  time: string; // e.g., "9:00 - 10:00"
  title: string;
  type?: string;
  id?: string | number;
  description?: string;
  color?: string;
  textColor?: string;
}

/**
 * Represents a full day's schedule, including the day's label and its activities.
 * This is an alternative data format, often generated from a list of `Event` objects.
 */
export interface DaySchedule {
  day: string; // e.g., "21"
  dayLabel: string; // e.g., "Thursday"
  activities: Activity[];
}

/**
 * Configuration options for the timeline display.
 */
export interface TimelineConfig {
  startHour?: number;
  endHour?: number;
  pixelsPerMinute?: number;
  showTimeMarkers?: boolean;
  timeMarkerInterval?: number;
  responsive?: boolean;
}

/**
 * Defines the color scheme for different activity types.
 * The key is the activity `type`, and the value contains background and text color classes or styles.
 */
export interface ColorTheme {
  [type: string]: {
    background: string;
    text: string;
  };
}

/**
 * Represents a time marker on the timeline's vertical axis.
 */
export interface TimeMarker {
  time: string; // e.g., "9:00 AM"
  top: number; // position in pixels
}