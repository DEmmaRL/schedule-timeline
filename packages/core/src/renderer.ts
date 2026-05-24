import { Activity, ColorTheme, DaySchedule, Event, TimelineConfig, TimeMarker } from './types';
import { eventsToSchedule } from './eventUtils';

type StyleLike = Record<string, string | number>;

export interface TimelineRenderProps {
  schedule?: DaySchedule[];
  events?: Event[];
  config?: TimelineConfig;
  colorTheme?: ColorTheme;
  className?: string;
  onActivityClick?: (activity: Activity, dayIndex: number) => void;
  onActivityHover?: (activity: Activity, dayIndex: number) => void;
  onEventClick?: (event: Event) => void;
  onEventHover?: (event: Event) => void;
  renderActivityMarkup?: (activity: Activity, style: StyleLike) => string | null | undefined;
  renderEventMarkup?: (event: Event, style: StyleLike) => string | null | undefined;
  showHeader?: boolean;
  headerClassName?: string;
  activityClassName?: string;
}

export interface TimelineInstance {
  update(nextProps: TimelineRenderProps): void;
  destroy(): void;
}

const defaultConfig: Required<TimelineConfig> = {
  startHour: 8,
  endHour: 19.5,
  pixelsPerMinute: 2.2,
  showTimeMarkers: true,
  timeMarkerInterval: 60,
  responsive: true,
};

const defaultColorTheme: ColorTheme = {
  registration: { background: 'var(--st-color-registration, rgba(147, 197, 253, 0.6))', text: 'var(--st-text-registration, #1e3a8a)' },
  opening: { background: 'var(--st-color-opening, rgba(244, 114, 182, 0.6))', text: 'var(--st-text-opening, #831843)' },
  theory: { background: 'var(--st-color-theory, rgba(254, 215, 170, 0.6))', text: 'var(--st-text-theory, #9a3412)' },
  break: { background: 'var(--st-color-break, rgba(191, 219, 254, 0.6))', text: 'var(--st-text-break, #1e3a8a)' },
  contest: { background: 'var(--st-color-contest, rgba(249, 168, 212, 0.6))', text: 'var(--st-text-contest, #831843)' },
  upsolving: { background: 'var(--st-color-upsolving, rgba(187, 247, 208, 0.6))', text: 'var(--st-text-upsolving, #14532d)' },
  icpc: { background: 'var(--st-color-icpc, rgba(253, 224, 71, 0.6))', text: 'var(--st-text-icpc, #713f12)' },
  chill: { background: 'var(--st-color-chill, rgba(216, 180, 254, 0.6))', text: 'var(--st-text-chill, #581c87)' },
  closing: { background: 'var(--st-color-closing, rgba(252, 165, 165, 0.6))', text: 'var(--st-text-closing, #7f1d1d)' },
  default: { background: 'var(--st-color-default, rgba(243, 244, 246, 0.6))', text: 'var(--st-text-default, #111827)' },
};

export function renderTimeline(container: HTMLElement, props: TimelineRenderProps): TimelineInstance {
  const mount = document.createElement('div');
  container.replaceChildren(mount);

  let currentProps = { ...props };

  const render = () => {
    mount.replaceChildren(createTimelineMarkup(currentProps));
  };

  render();

  return {
    update(nextProps: TimelineRenderProps) {
      currentProps = {
        ...currentProps,
        ...nextProps,
        config: {
          ...currentProps.config,
          ...nextProps.config,
        },
        colorTheme: {
          ...currentProps.colorTheme,
          ...nextProps.colorTheme,
        },
      };
      render();
    },
    destroy() {
      container.replaceChildren();
    },
  };
}

function createTimelineMarkup(props: TimelineRenderProps): HTMLElement {
  const finalSchedule = props.events && props.events.length > 0 ? eventsToSchedule(props.events) : props.schedule || [];
  const finalConfig = { ...defaultConfig, ...props.config };
  const finalColorTheme = { ...defaultColorTheme, ...props.colorTheme };
  const totalMinutes = (finalConfig.endHour - finalConfig.startHour) * 60;
  const totalHeight = totalMinutes * finalConfig.pixelsPerMinute;
  const headerHeight = props.showHeader === false ? 0 : 48;
  const timeMarkers = createTimeMarkers(finalConfig, totalMinutes);
  const eventMap = createEventMap(props.events || []);

  const outer = document.createElement('div');
  outer.className = props.className || '';
  outer.style.cssText = [
    'background: white',
    'border-radius: 12px',
    'box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12)',
    'overflow: hidden',
    'width: 100%',
  ].join('; ');

  const scroll = document.createElement('div');
  scroll.style.cssText = 'overflow-x: auto; overflow-y: hidden; border-radius: 8px;';

  const row = document.createElement('div');
  row.style.cssText = `display: flex; overflow: hidden; min-width: 800px; height: ${totalHeight + headerHeight}px;`;

  row.appendChild(createTimeColumn(timeMarkers, finalConfig, headerHeight, totalHeight + headerHeight, props.headerClassName));

  finalSchedule.forEach((daySchedule, dayIndex) => {
    row.appendChild(
      createDayColumn(daySchedule, dayIndex, finalConfig, headerHeight, totalHeight, finalColorTheme, props, eventMap)
    );
  });

  scroll.appendChild(row);
  outer.appendChild(scroll);
  return outer;
}

function createTimeColumn(
  timeMarkers: TimeMarker[],
  config: Required<TimelineConfig>,
  headerHeight: number,
  columnHeight: number,
  headerClassName?: string
): HTMLElement {
  const column = document.createElement('div');
  column.style.cssText = [
    `width: ${config.responsive ? '80px' : '96px'}`,
    'background: rgba(229, 231, 235, 0.2)',
    'position: relative',
    'flex-shrink: 0',
    `height: ${columnHeight}px`,
  ].join('; ');

  const header = document.createElement('div');
  header.textContent = 'Time';
  header.className = headerClassName || '';
  header.style.cssText = [
    'background: rgba(229, 231, 235, 0.9)',
    'padding: 12px',
    'font-weight: 600',
    'text-align: center',
    'font-size: 12px',
    'height: 48px',
    'display: flex',
    'align-items: center',
    'justify-content: center',
  ].filter(Boolean).join('; ');
  column.appendChild(header);

  timeMarkers.forEach(marker => {
    const markerNode = document.createElement('div');
    markerNode.textContent = marker.time;
    markerNode.style.cssText = [
      'position: absolute',
      'left: 0',
      'right: 0',
      'padding: 4px 8px',
      'font-size: 12px',
      'font-weight: 500',
      'text-align: center',
      'background: rgba(243, 244, 246, 1)',
      `top: ${marker.position + headerHeight}px`,
    ].join('; ');
    column.appendChild(markerNode);
  });

  return column;
}

function createDayColumn(
  daySchedule: DaySchedule,
  dayIndex: number,
  config: Required<TimelineConfig>,
  headerHeight: number,
  totalHeight: number,
  colorTheme: ColorTheme,
  props: TimelineRenderProps,
  eventMap: Map<string, Event>
): HTMLElement {
  const column = document.createElement('div');
  column.style.cssText = `flex: 1; position: relative; min-width: 100px; height: ${totalHeight + headerHeight}px;`;

  if (props.showHeader !== false) {
    const header = document.createElement('div');
    header.textContent = `${daySchedule.dayName} ${daySchedule.day}`;
    header.className = props.headerClassName || '';
    header.style.cssText = [
      'background: rgba(229, 231, 235, 0.3)',
      'padding: 12px',
      'font-weight: 600',
      'text-align: center',
      'font-size: 12px',
      'height: 48px',
      'display: flex',
      'align-items: center',
      'justify-content: center',
    ].filter(Boolean).join('; ');
    column.appendChild(header);
  }

  (daySchedule.activities || []).forEach((activity, activityIndex) => {
    const startTime = activity.time.split(' - ')[0];
    const startMinutes = timeToMinutes(startTime, config.startHour);
    const duration = getDuration(activity.time, config.startHour);
    const top = startMinutes * config.pixelsPerMinute + headerHeight;
    const height = duration * config.pixelsPerMinute;
    const style = getActivityStyle(activity, colorTheme);
    const eventKey = `${daySchedule.date}-${startTime}-${activity.title}`;
    const originalEvent = eventMap.get(eventKey);

    const card = document.createElement('div');
    card.className = props.activityClassName || '';
    card.style.cssText = [
      'position: absolute',
      'left: 0',
      'right: 0',
      `top: ${top}px`,
      `height: ${height}px`,
      'margin: 2px',
      'border-radius: 10px',
      'padding: 8px',
      'display: flex',
      'align-items: center',
      'justify-content: center',
      'box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12)',
      'cursor: pointer',
      'transition: box-shadow 150ms ease',
      `background: ${style.background}`,
      `color: ${style.text}`,
    ].filter(Boolean).join('; ');

    card.addEventListener('click', () => {
      if (originalEvent && props.onEventClick) {
        props.onEventClick(originalEvent);
        return;
      }

      props.onActivityClick?.(activity, dayIndex);
    });

    card.addEventListener('mouseenter', () => {
      if (originalEvent && props.onEventHover) {
        props.onEventHover(originalEvent);
        return;
      }

      props.onActivityHover?.(activity, dayIndex);
    });

    const content = document.createElement('div');
    const customMarkup = originalEvent
      ? props.renderEventMarkup?.(originalEvent, { top, height, margin: 2 })
      : props.renderActivityMarkup?.(activity, { top, height, margin: 2 });

    if (customMarkup) {
      content.innerHTML = customMarkup;
      card.appendChild(content);
      column.appendChild(card);
      return;
    }

    content.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; text-align: center;';

    const time = document.createElement('div');
    time.textContent = activity.time;
    time.style.cssText = 'font-weight: 700; margin-bottom: 4px; font-size: 12px; line-height: 1.2;';

    const title = document.createElement('div');
    title.textContent = activity.title;
    title.style.cssText = 'font-size: 12px; line-height: 1.2;';

    content.appendChild(time);
    content.appendChild(title);
    card.appendChild(content);
    column.appendChild(card);
  });

  return column;
}

function createTimeMarkers(config: Required<TimelineConfig>, totalMinutes: number): TimeMarker[] {
  const markers: TimeMarker[] = [];

  if (!config.showTimeMarkers) {
    return markers;
  }

  for (let minutes = 0; minutes <= totalMinutes; minutes += config.timeMarkerInterval) {
    const hour = Math.floor(minutes / 60) + config.startHour;
    const minute = minutes % 60;
    markers.push({
      time: `${hour}:${minute.toString().padStart(2, '0')}`,
      position: minutes * config.pixelsPerMinute,
    });
  }

  return markers;
}

function createEventMap(events: Event[]): Map<string, Event> {
  const map = new Map<string, Event>();

  events.forEach(event => {
    map.set(`${event.date}-${event.startTime}-${event.title}`, event);
  });

  return map;
}

function timeToMinutes(timeStr: string, startHour = defaultConfig.startHour): number {
  if (timeStr.includes('en adelante') || timeStr.includes('onwards')) {
    return (16 - startHour) * 60;
  }

  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours - startHour) * 60 + minutes;
}

function getDuration(timeRange: string, startHour = defaultConfig.startHour): number {
  if (timeRange.includes('en adelante') || timeRange.includes('onwards')) {
    return 120;
  }

  const [start, end] = timeRange.split(' - ');
  if (!end) {
    return 60;
  }

  const startMinutes = timeToMinutes(start, startHour);
  const endMinutes = timeToMinutes(end, startHour);
  return endMinutes - startMinutes;
}

function getActivityStyle(activity: Activity, colorTheme: ColorTheme): { background: string; text: string } {
  if (activity.color) {
    return {
      background: activity.color,
      text: activity.textColor || '#111827',
    };
  }

  const themeStyle = colorTheme[activity.type || 'default'] || colorTheme.default;
  return {
    background: themeStyle.background,
    text: themeStyle.text || '#111827',
  };
}
