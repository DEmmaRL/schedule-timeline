// Main component exports
export { ScheduleTimeline } from './ScheduleTimeline';

// Type exports
export type {
  Activity,
  Event,
  DaySchedule,
  TimelineConfig,
  ColorTheme,
  ScheduleTimelineProps,
  TimeMarker,
} from './types';

// Event utilities
export { eventsToSchedule, createEvent, createDayEvents } from './utils/eventUtils';

// ICS utilities (calendar standard)
export { eventsToICS, icsToEvents, downloadICS, loadICSFile } from './utils/icsUtils';

// Utility functions that users might find helpful (backward compatibility)
export const createActivity = (
  time: string,
  title: string,
  type?: string,
  options?: Partial<Pick<import('./types').Activity, 'id' | 'description' | 'color' | 'textColor'>>
): import('./types').Activity => ({
  time,
  title,
  type,
  ...options,
});

export const createDaySchedule = (
  date: string,
  day: string,
  activities: import('./types').Activity[]
): import('./types').DaySchedule => ({
  date,
  day,
  activities,
});

// Predefined color themes
export const colorThemes = {
  default: {
    registration: { background: 'bg-blue-300/60', text: 'text-blue-900' },
    opening: { background: 'bg-pink-400/60', text: 'text-pink-900' },
    theory: { background: 'bg-orange-200/60', text: 'text-orange-900' },
    break: { background: 'bg-blue-200/60', text: 'text-blue-900' },
    contest: { background: 'bg-pink-300/60', text: 'text-pink-900' },
    upsolving: { background: 'bg-green-200/60', text: 'text-green-900' },
    icpc: { background: 'bg-yellow-300/60', text: 'text-yellow-900' },
    chill: { background: 'bg-purple-300/60', text: 'text-purple-900' },
    closing: { background: 'bg-red-300/60', text: 'text-red-900' },
    default: { background: 'bg-gray-100/60', text: 'text-gray-900' },
  },
  minimal: {
    default: { background: 'bg-gray-100', text: 'text-gray-800' },
    primary: { background: 'bg-blue-100', text: 'text-blue-800' },
    secondary: { background: 'bg-green-100', text: 'text-green-800' },
    accent: { background: 'bg-purple-100', text: 'text-purple-800' },
  },
  dark: {
    default: { background: 'bg-gray-700', text: 'text-gray-100' },
    primary: { background: 'bg-blue-600', text: 'text-blue-100' },
    secondary: { background: 'bg-green-600', text: 'text-green-100' },
    accent: { background: 'bg-purple-600', text: 'text-purple-100' },
  },
};
