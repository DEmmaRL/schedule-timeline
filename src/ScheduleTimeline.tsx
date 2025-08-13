import React from 'react';
import { ScheduleTimelineProps, Activity, Event, TimeMarker, TimelineConfig, ColorTheme } from './types';
import { eventsToSchedule } from './utils/eventUtils';

const defaultConfig: TimelineConfig = {
  startHour: 8,
  endHour: 19.5,
  pixelsPerMinute: 2.2,
  showTimeMarkers: true,
  timeMarkerInterval: 60,
  responsive: true,
};

const defaultColorTheme: ColorTheme = {
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
};

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  schedule,
  events,
  config = {},
  colorTheme = {},
  className = '',
  onActivityClick,
  onEventClick,
  onActivityHover,
  onEventHover,
  customActivityRenderer,
  customEventRenderer,
  showHeader = true,
  headerClassName = '',
  activityClassName = '',
}) => {
  // Determinar qué datos usar - priorizar events sobre schedule
  const finalSchedule = React.useMemo(() => {
    if (events && events.length > 0) {
      return eventsToSchedule(events);
    }
    return schedule || [];
  }, [events, schedule]);

  const finalConfig = { ...defaultConfig, ...config };
  const finalColorTheme = { ...defaultColorTheme, ...colorTheme };

  const timeToMinutes = (timeStr: string): number => {
    if (timeStr.includes('en adelante') || timeStr.includes('onwards')) {
      return (16 - finalConfig.startHour!) * 60; // Default to 4 PM
    }
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours - finalConfig.startHour!) * 60 + minutes;
  };

  const getDuration = (timeRange: string): number => {
    if (timeRange.includes('en adelante') || timeRange.includes('onwards')) {
      return 120; // 2 hours default for open-ended activities
    }
    const [start, end] = timeRange.split(' - ');
    if (!end) return 60; // Default 1 hour if no end time
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    return endMinutes - startMinutes;
  };

  const getActivityStyle = (activity: Activity): { background: string; text: string } => {
    // Priority: activity.color > theme by type > default
    if (activity.color) {
      return {
        background: activity.color,
        text: activity.textColor || 'text-gray-900',
      };
    }

    const themeStyle = finalColorTheme[activity.type || 'default'] || finalColorTheme.default;
    return {
      background: themeStyle.background,
      text: themeStyle.text || 'text-gray-900',
    };
  };

  // Calculate total minutes and height
  const totalHours = finalConfig.endHour! - finalConfig.startHour!;
  const totalMinutes = totalHours * 60;
  const totalHeight = totalMinutes * finalConfig.pixelsPerMinute!;

  // Generate time markers
  const timeMarkers: TimeMarker[] = [];
  if (finalConfig.showTimeMarkers) {
    const intervalMinutes = finalConfig.timeMarkerInterval!;
    for (let minutes = 0; minutes <= totalMinutes; minutes += intervalMinutes) {
      const hour = Math.floor(minutes / 60) + finalConfig.startHour!;
      const minute = minutes % 60;
      const timeStr = `${hour}:${minute.toString().padStart(2, '0')}`;
      timeMarkers.push({
        time: timeStr,
        position: minutes * finalConfig.pixelsPerMinute!,
      });
    }
  }

  const headerHeight = showHeader ? 48 : 0;

  // Crear un mapa de eventos originales para los handlers
  const eventMap = React.useMemo(() => {
    if (!events) return new Map();
    
    const map = new Map<string, Event>();
    events.forEach(event => {
      const key = `${event.date}-${event.startTime}-${event.title}`;
      map.set(key, event);
    });
    return map;
  }, [events]);

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto overflow-y-hidden rounded-lg">
        <div
          className="flex overflow-hidden"
          style={{ 
            minWidth: '800px', 
            height: `${totalHeight + headerHeight}px` 
          }}
        >
          {/* Time column */}
          <div
            className={`w-16 md:w-24 bg-gray-200/20 relative flex-shrink-0 ${
              finalConfig.responsive ? 'w-16 md:w-24' : 'w-24'
            }`}
            style={{ height: `${totalHeight + headerHeight}px` }}
          >
            {showHeader && (
              <div className={`bg-gray-200 p-3 font-semibold text-center text-xs md:text-sm h-12 flex items-center justify-center ${headerClassName}`}>
                Time
              </div>
            )}
            {timeMarkers.map((marker, index) => (
              <div
                key={index}
                className="absolute left-0 right-0 px-1 md:px-2 py-1 text-xs font-medium text-center bg-gray-100"
                style={{ top: `${marker.position + headerHeight}px` }}
              >
                {marker.time}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {finalSchedule.map((daySchedule, dayIndex) => (
            <div
              key={dayIndex}
              className="flex-1 relative min-w-[100px]"
              style={{ height: `${totalHeight + headerHeight}px` }}
            >
              {/* Day header */}
              {showHeader && (
                <div className={`bg-gray-200/30 p-3 font-semibold text-center text-xs md:text-sm h-12 flex items-center justify-center ${headerClassName}`}>
                  {daySchedule.day} {daySchedule.date}
                </div>
              )}

              {/* Activities */}
              {daySchedule.activities.map((activity, actIndex) => {
                const startTime = activity.time.split(' - ')[0];
                const startMinutes = timeToMinutes(startTime);
                const duration = getDuration(activity.time);
                const top = startMinutes * finalConfig.pixelsPerMinute! + headerHeight;
                const height = duration * finalConfig.pixelsPerMinute!;
                const style = getActivityStyle(activity);

                const activityStyle: React.CSSProperties = {
                  top: `${top}px`,
                  height: `${height}px`,
                  margin: '2px',
                };

                const handleClick = () => {
                  // Si tenemos eventos originales, usar el handler de eventos
                  if (events && onEventClick) {
                    const eventKey = `${daySchedule.date}-${startTime}-${activity.title}`;
                    const originalEvent = eventMap.get(eventKey);
                    if (originalEvent) {
                      onEventClick(originalEvent);
                      return;
                    }
                  }
                  
                  // Fallback al handler de actividades
                  if (onActivityClick) {
                    onActivityClick(activity, dayIndex);
                  }
                };

                const handleMouseEnter = () => {
                  // Similar lógica para hover
                  if (events && onEventHover) {
                    const eventKey = `${daySchedule.date}-${startTime}-${activity.title}`;
                    const originalEvent = eventMap.get(eventKey);
                    if (originalEvent) {
                      onEventHover(originalEvent);
                      return;
                    }
                  }
                  
                  if (onActivityHover) {
                    onActivityHover(activity, dayIndex);
                  }
                };

                // Usar renderer personalizado si está disponible
                if (events && customEventRenderer) {
                  const eventKey = `${daySchedule.date}-${startTime}-${activity.title}`;
                  const originalEvent = eventMap.get(eventKey);
                  if (originalEvent) {
                    return (
                      <div
                        key={activity.id || actIndex}
                        className="absolute left-0 right-0"
                        style={activityStyle}
                        onClick={handleClick}
                        onMouseEnter={handleMouseEnter}
                      >
                        {customEventRenderer(originalEvent, activityStyle)}
                      </div>
                    );
                  }
                }

                if (customActivityRenderer) {
                  return (
                    <div
                      key={activity.id || actIndex}
                      className="absolute left-0 right-0"
                      style={activityStyle}
                      onClick={handleClick}
                      onMouseEnter={handleMouseEnter}
                    >
                      {customActivityRenderer(activity, activityStyle)}
                    </div>
                  );
                }

                return (
                  <div
                    key={activity.id || actIndex}
                    className={`absolute left-0 right-0 rounded-lg p-1 md:p-2 text-center ${style.background} ${style.text} flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-shadow ${activityClassName}`}
                    style={activityStyle}
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    title={activity.description || activity.title}
                  >
                    <div className="font-medium text-xs leading-tight">
                      <div className="font-bold mb-1 text-xs md:text-sm">
                        {activity.time}
                      </div>
                      <div className="text-xs md:text-sm">
                        {activity.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleTimeline;
