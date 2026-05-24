# Quick Usage Example

## Installation
```bash
npm install @demmarl/schedule-timeline
```

## Basic Example (React)
```tsx
import React from 'react';
import { ScheduleTimeline, createDaySchedule, createActivity } from '@demmarl/schedule-timeline';

const MyApp = () => {
  const schedule = [
    createDaySchedule('2024-03-21', '21', 'Thursday', [
      createActivity('9:00 - 10:00', 'Opening Ceremony', 'opening'),
      createActivity('10:00 - 12:00', 'Workshop Session', 'theory'),
      createActivity('12:00 - 13:00', 'Lunch Break', 'break'),
      createActivity('13:00 - 17:00', 'Competition', 'contest'),
    ]),
    createDaySchedule('2024-03-22', '22', 'Friday', [
      createActivity('9:00 - 11:00', 'Final Competition', 'contest'),
      createActivity('11:00 - 12:00', 'Awards Ceremony', 'closing'),
    ]),
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1>Event Schedule</h1>
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

## Vanilla JS / Astro Example
The core renderer doesn't require React and is perfect for Astro, Vue, or plain HTML.

### Using the Web Component
```html
<script type="module">
  import { registerScheduleTimelineElement } from '@demmarl/schedule-timeline-core/web-component';
  registerScheduleTimelineElement();
</script>

<schedule-timeline
  events='[{"title":"Opening","startTime":"09:00","endTime":"10:00","date":"2026-06-01","type":"opening"}]'
  config='{"startHour":8,"endHour":20}'
></schedule-timeline>
```

### Using Programmatic Mount
```html
<div id="timeline"></div>
<script type="module">
  import { renderTimeline } from '@demmarl/schedule-timeline-core';

  renderTimeline(document.getElementById('timeline'), {
    events: [
      { title: 'Workshop', startTime: '10:00', endTime: '12:00', date: '2026-06-01', type: 'theory' }
    ],
    config: { startHour: 8, endHour: 20 }
  });
</script>
```

## Customization

### Configuration Options
```tsx
const config = {
  startHour: 8,
  endHour: 18,
  pixelsPerMinute: 3,
  timeMarkerInterval: 30, // Every 30 minutes
};
```

### Custom Color Themes
Use hex, RGB, or CSS variables.
```tsx
const customTheme = {
  opening: { background: '#a855f7', text: '#ffffff' },
  theory: { background: 'rgba(59, 130, 246, 0.5)', text: '#1e3a8a' },
  contest: { background: 'var(--my-custom-red)', text: 'white' },
};

<ScheduleTimeline
  schedule={schedule}
  config={config}
  colorTheme={customTheme}
/>
```

## Styling
The component uses inline styles for layout and provides CSS Variables for easy theming:
- **CSS Variables:** Override any default color using `--st-color-[type]` and `--st-text-[type]`.
- **Custom Classes:** Pass `className`, `headerClassName`, or `activityClassName` to add your own styles.
- **Framework Agnostic:** No longer depends on Tailwind CSS or any other CSS framework.
