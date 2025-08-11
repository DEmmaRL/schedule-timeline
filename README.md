# Schedule Timeline Component

A flexible and customizable schedule timeline component for React applications. Perfect for displaying event schedules, daily agendas, conference programs, and more.

Originally created for TCMX 2025 (Taller de Ciencias de la Computación México), this component has been generalized to work with any type of schedule or timeline.

## Features

- 📅 **Flexible scheduling**: Support for multi-day schedules with customizable time ranges
- 🎨 **Customizable themes**: Built-in color themes and support for custom styling
- 📱 **Responsive design**: Works great on desktop and mobile devices
- ⚡ **TypeScript support**: Full TypeScript support with comprehensive type definitions
- 🎯 **Interactive**: Click and hover event handlers for activities
- 🔧 **Highly configurable**: Extensive configuration options for different use cases

## Installation

```bash
npm install @demmarl/schedule-timeline
```

## Basic Usage

```tsx
import React from 'react';
import { ScheduleTimeline, createDaySchedule, createActivity } from '@demmarl/schedule-timeline';

const MySchedule = () => {
  const schedule = [
    createDaySchedule('21', 'Thursday', [
      createActivity('9:00 - 10:00', 'Opening Ceremony', 'opening'),
      createActivity('10:00 - 12:00', 'Workshop Session', 'theory'),
      createActivity('12:00 - 13:00', 'Lunch Break', 'break'),
    ]),
    createDaySchedule('22', 'Friday', [
      createActivity('9:00 - 11:00', 'Competition', 'contest'),
      createActivity('11:00 - 11:30', 'Coffee Break', 'break'),
      createActivity('11:30 - 13:00', 'Awards Ceremony', 'closing'),
    ]),
  ];

  return (
    <ScheduleTimeline
      schedule={schedule}
      onActivityClick={(activity, dayIndex) => {
        console.log('Clicked:', activity.title, 'on day', dayIndex);
      }}
    />
  );
};
```

## Advanced Configuration

```tsx
import { ScheduleTimeline, colorThemes } from '@demmarl/schedule-timeline';

const AdvancedSchedule = () => {
  const config = {
    startHour: 8,
    endHour: 20,
    pixelsPerMinute: 3,
    showTimeMarkers: true,
    timeMarkerInterval: 30, // Every 30 minutes
  };

  const customTheme = {
    ...colorThemes.minimal,
    workshop: { background: 'bg-indigo-200', text: 'text-indigo-900' },
    networking: { background: 'bg-emerald-200', text: 'text-emerald-900' },
  };

  return (
    <ScheduleTimeline
      schedule={schedule}
      config={config}
      colorTheme={customTheme}
      className="my-custom-timeline"
      onActivityClick={handleActivityClick}
      onActivityHover={handleActivityHover}
    />
  );
};
```

## Custom Activity Renderer

```tsx
const CustomSchedule = () => {
  const customRenderer = (activity, style) => (
    <div className="custom-activity" style={style}>
      <div className="activity-icon">🎯</div>
      <div className="activity-content">
        <h4>{activity.title}</h4>
        <p>{activity.description}</p>
      </div>
    </div>
  );

  return (
    <ScheduleTimeline
      schedule={schedule}
      customActivityRenderer={customRenderer}
    />
  );
};
```

## API Reference

### ScheduleTimelineProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schedule` | `DaySchedule[]` | **required** | Array of day schedules |
| `config` | `TimelineConfig` | `{}` | Timeline configuration options |
| `colorTheme` | `ColorTheme` | `defaultTheme` | Color theme for activities |
| `className` | `string` | `''` | Additional CSS classes |
| `onActivityClick` | `(activity, dayIndex) => void` | `undefined` | Click handler for activities |
| `onActivityHover` | `(activity, dayIndex) => void` | `undefined` | Hover handler for activities |
| `customActivityRenderer` | `(activity, style) => ReactNode` | `undefined` | Custom activity renderer |
| `showHeader` | `boolean` | `true` | Show day headers |
| `headerClassName` | `string` | `''` | Additional CSS classes for headers |
| `activityClassName` | `string` | `''` | Additional CSS classes for activities |

### TimelineConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `startHour` | `number` | `8` | Start hour (24-hour format) |
| `endHour` | `number` | `19.5` | End hour (supports decimals) |
| `pixelsPerMinute` | `number` | `2.2` | Vertical scaling factor |
| `showTimeMarkers` | `boolean` | `true` | Show time markers on the left |
| `timeMarkerInterval` | `number` | `60` | Interval between time markers (minutes) |
| `responsive` | `boolean` | `true` | Enable responsive design |

### Activity

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `time` | `string` | ✅ | Time range (e.g., "9:00 - 10:00") |
| `title` | `string` | ✅ | Activity title |
| `type` | `string` | ❌ | Activity type for theming |
| `id` | `string \| number` | ❌ | Unique identifier |
| `description` | `string` | ❌ | Additional description |
| `color` | `string` | ❌ | Custom background color |
| `textColor` | `string` | ❌ | Custom text color |

## Built-in Themes

- `colorThemes.default` - Colorful theme with distinct colors for different activity types
- `colorThemes.minimal` - Clean, minimal theme with subtle colors
- `colorThemes.dark` - Dark theme for dark mode interfaces

## Styling

The component uses Tailwind CSS classes by default, but you can override styles using:

1. **Custom CSS classes**: Pass `className`, `headerClassName`, or `activityClassName`
2. **Custom themes**: Define your own `ColorTheme` object
3. **Inline colors**: Set `color` and `textColor` on individual activities
4. **Custom renderer**: Use `customActivityRenderer` for complete control

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
