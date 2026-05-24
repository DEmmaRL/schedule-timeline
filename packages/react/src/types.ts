import type React from 'react';

import type {
  Activity,
  Event,
  DaySchedule,
  TimelineConfig,
  ColorTheme,
  TimeMarker,
} from '@demmarl/schedule-timeline-core';

export type {
  Activity,
  Event,
  DaySchedule,
  TimelineConfig,
  ColorTheme,
  TimeMarker,
} from '@demmarl/schedule-timeline-core';

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
