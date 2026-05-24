// Main component exports
export { ScheduleTimeline } from './ScheduleTimeline';

// Type exports
export type { // These now come from the core package
  Activity,
  Event,
  DaySchedule,
  TimelineConfig,
  ColorTheme,
  TimeMarker,
} from '@demmarl/schedule-timeline-core';
export type { ScheduleTimelineProps } from './types';

// Event utilities
export { eventsToSchedule, createEvent, createDayEvents } from '@demmarl/schedule-timeline-core';

// ICS utilities (calendar standard)
export { eventsToICS, icsToEvents, downloadICS, loadICSFile } from '@demmarl/schedule-timeline-core/ics';

// Utility functions that users might find helpful (backward compatibility)
export const createActivity = (
  time: string,
  title: string,
  type?: string,
  options?: Partial<Pick<import('@demmarl/schedule-timeline-core').Activity, 'id' | 'description' | 'color' | 'textColor'>>
): import('@demmarl/schedule-timeline-core').Activity => ({
  time,
  title,
  type,
  ...options,
});

export const createDaySchedule = (
  date: string,
  day: string,
  dayName: string,
  activities: import('@demmarl/schedule-timeline-core').Activity[]
): import('@demmarl/schedule-timeline-core').DaySchedule => ({
  date,
  day,
  dayName,
  activities,
});

// Predefined color themes
export const colorThemes = {
  default: {
    registration: { background: 'rgba(147, 197, 253, 0.6)', text: '#1e3a8a' },
    opening: { background: 'rgba(244, 114, 182, 0.6)', text: '#831843' },
    theory: { background: 'rgba(254, 215, 170, 0.6)', text: '#9a3412' },
    break: { background: 'rgba(191, 219, 254, 0.6)', text: '#1e3a8a' },
    contest: { background: 'rgba(249, 168, 212, 0.6)', text: '#831843' },
    upsolving: { background: 'rgba(187, 247, 208, 0.6)', text: '#14532d' },
    icpc: { background: 'rgba(253, 224, 71, 0.6)', text: '#713f12' },
    chill: { background: 'rgba(216, 180, 254, 0.6)', text: '#581c87' },
    closing: { background: 'rgba(252, 165, 165, 0.6)', text: '#7f1d1d' },
    default: { background: 'rgba(243, 244, 246, 0.6)', text: '#111827' },
  },
  minimal: {
    default: { background: 'rgba(243, 244, 246, 1)', text: '#1f2937' },
    primary: { background: 'rgba(219, 234, 254, 1)', text: '#1e40af' },
    secondary: { background: 'rgba(209, 250, 229, 1)', text: '#065f46' },
    accent: { background: 'rgba(243, 232, 255, 1)', text: '#5b21b6' },
  },
  dark: {
    default: { background: 'rgba(55, 65, 81, 1)', text: '#f9fafb' },
    primary: { background: 'rgba(30, 64, 175, 1)', text: '#dbeafe' },
    secondary: { background: 'rgba(6, 95, 70, 1)', text: '#d1fae5' },
    accent: { background: 'rgba(91, 33, 182, 1)', text: '#f3e8ff' },
  },
};
