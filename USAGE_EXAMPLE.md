# Quick Usage Example

## Installation
```bash
npm install @demmarl/schedule-timeline
```

## Basic Example
```tsx
import React from 'react';
import { ScheduleTimeline, createDaySchedule, createActivity } from '@demmarl/schedule-timeline';

const MyApp = () => {
  const schedule = [
    createDaySchedule('21', 'Thursday', [
      createActivity('9:00 - 10:00', 'Opening Ceremony', 'opening'),
      createActivity('10:00 - 12:00', 'Workshop Session', 'theory'),
      createActivity('12:00 - 13:00', 'Lunch Break', 'break'),
      createActivity('13:00 - 17:00', 'Competition', 'contest'),
    ]),
    createDaySchedule('22', 'Friday', [
      createActivity('9:00 - 11:00', 'Final Competition', 'contest'),
      createActivity('11:00 - 12:00', 'Awards Ceremony', 'closing'),
    ]),
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Schedule</h1>
      <ScheduleTimeline
        schedule={schedule}
        onActivityClick={(activity, dayIndex) => {
          alert(`Clicked: ${activity.title}`);
        }}
      />
    </div>
  );
};

export default MyApp;
```

## With Custom Configuration
```tsx
const config = {
  startHour: 8,
  endHour: 18,
  pixelsPerMinute: 3,
  timeMarkerInterval: 30, // Every 30 minutes
};

const customTheme = {
  opening: { background: 'bg-purple-200', text: 'text-purple-900' },
  theory: { background: 'bg-blue-200', text: 'text-blue-900' },
  contest: { background: 'bg-red-200', text: 'text-red-900' },
  break: { background: 'bg-gray-200', text: 'text-gray-700' },
  closing: { background: 'bg-green-200', text: 'text-green-900' },
};

<ScheduleTimeline
  schedule={schedule}
  config={config}
  colorTheme={customTheme}
/>
```

## TypeScript Support
The library is fully typed! You'll get autocompletion and type checking for all props and methods.

## Styling
The component uses Tailwind CSS classes by default, but you can customize it with:
- Custom CSS classes via `className` prop
- Custom color themes via `colorTheme` prop
- Individual activity colors via `activity.color` property
