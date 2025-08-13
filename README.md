# Schedule Timeline Component

A flexible and customizable schedule timeline component for React applications. Perfect for displaying event schedules, daily agendas, conference programs, and more.

Originally created for and inspired by the ICPC TCMX 2025, this component has been generalized to work with any type of schedule or timeline.

## Features

- 📅 **Flexible scheduling**: Support for multi-day schedules with customizable time ranges
- 🎨 **Customizable themes**: Built-in color themes and support for custom styling
- 📱 **Responsive design**: Works great on desktop and mobile devices
- ⚡ **TypeScript support**: Full TypeScript support with comprehensive type definitions
- 🎯 **Interactive**: Click and hover event handlers for activities
- 🔧 **Highly configurable**: Extensive configuration options for different use cases
- 🗄️ **Database integration**: Built-in support for loading/saving schedule data
- 📋 **ICS support**: Import and export standard calendar files (.ics)
- 🔄 **Auto-save**: Automatic data persistence with configurable intervals
- ✏️ **Editable**: Built-in editing capabilities with the ScheduleManager component

## Demo

https://github.com/user-attachments/assets/d6bd78c7-2878-47b9-9845-8cf1dfd55f81

## Quick Start

### Installation

```bash
npm install @demmarl/schedule-timeline
```

### Basic Usage

```tsx
import React from 'react';
import { ScheduleTimeline, Event } from '@demmarl/schedule-timeline';

const MySchedule = () => {
  // Simple array of events - can come from anywhere (API, database, file, etc.)
  const events: Event[] = [
    {
      id: 1,
      title: 'Opening Ceremony',
      startTime: '09:00',
      endTime: '10:00',
      date: '2024-03-21',
      type: 'opening',
      description: 'Welcome and event presentation',
    },
    {
      id: 2,
      title: 'Workshop Session',
      startTime: '10:00',
      endTime: '12:00',
      date: '2024-03-21',
      type: 'theory',
    },
    {
      id: 3,
      title: 'Lunch Break',
      startTime: '12:00',
      endTime: '13:00',
      date: '2024-03-21',
      type: 'break',
    },
    {
      id: 4,
      title: 'Competition',
      startTime: '09:00',
      endTime: '14:00',
      date: '2024-03-22',
      type: 'contest',
    },
  ];

  return (
    <ScheduleTimeline
      events={events}
      onEventClick={(event) => {
        console.log('Clicked:', event.title);
      }}
    />
  );
};
```

### Loading Events from API/Database

```tsx
import React from 'react';
import { ScheduleTimeline, Event } from '@demmarl/schedule-timeline';

const ApiSchedule = () => {
  const [events, setEvents] = React.useState<Event[]>([]);

  React.useEffect(() => {
    const loadEvents = async () => {
      // Load from your API/database
      const response = await fetch('/api/events');
      const data = await response.json();
      
      // Convert your data format to Event[]
      const formattedEvents: Event[] = data.map((item: any) => ({
        id: item.id,
        title: item.name,
        startTime: item.start_time,
        endTime: item.end_time,
        date: item.event_date,
        type: item.category,
        description: item.details,
      }));
      
      setEvents(formattedEvents);
    };

    loadEvents();
  }, []);

  return (
    <ScheduleTimeline
      events={events}
      onEventClick={(event) => {
        // Handle event clicks - open modal, navigate, etc.
        console.log('Event clicked:', event);
      }}
    />
  );
};
```

### Using Helper Functions

```tsx
import { ScheduleTimeline, createEvent, createDayEvents } from '@demmarl/schedule-timeline';

const HelperExample = () => {
  const events = [
    // Create individual events
    createEvent('Registration', '08:00', '09:00', '2024-03-21', {
      type: 'registration',
      description: 'Participant registration'
    }),
    
    // Create multiple events for the same day
    ...createDayEvents('2024-03-21', [
      {
        title: 'Keynote',
        startTime: '09:00',
        endTime: '10:00',
        type: 'opening',
      },
      {
        title: 'Workshop',
        startTime: '10:30',
        endTime: '12:00',
        type: 'theory',
      },
    ]),
  ];

  return <ScheduleTimeline events={events} />;
};
```

## Development & Testing

### Interactive Development App

This project includes a development app for testing and visualizing the component:

```bash
# Option 1: Using the convenience script
./dev.sh

# Option 2: Manual steps
npm run build           # Build the library
cd dev-app && npm install && npm run dev

# Option 3: Using npm scripts
npm run dev-app         # Builds library and starts dev-app
```

Open `http://localhost:5173/` to see interactive examples with:
- Multiple schedule configurations
- Different themes and styling options
- Interactive event handlers
- Custom renderers

### Development Workflow

When making changes to the library:

1. **Edit source files** in `src/`
2. **Rebuild the library**: `npm run build`
3. **Dev-app updates automatically** (thanks to Vite's hot reload)

### Running Tests

```bash
npm test              # Run tests
npm run test:coverage # Run tests with coverage
npm run test:watch    # Run tests in watch mode
```

## Working with Your Data

The beauty of this approach is that you can use **any data source** and **any data format**. Just convert your data to the simple `Event[]` format:

### From Database

```tsx
// Your database might return data like this:
const dbData = [
  { id: 1, name: 'Meeting', start: '09:00', end: '10:00', day: '2024-03-21', category: 'work' },
  { id: 2, name: 'Lunch', start: '12:00', end: '13:00', day: '2024-03-21', category: 'break' },
];

// Convert to Event[] format:
const events: Event[] = dbData.map(item => ({
  id: item.id,
  title: item.name,
  startTime: item.start,
  endTime: item.end,
  date: item.day,
  type: item.category,
}));

<ScheduleTimeline events={events} />
```

### From API Response

```tsx
const loadEvents = async () => {
  const response = await fetch('/api/schedule');
  const apiData = await response.json();
  
  // Convert whatever format your API returns:
  const events = apiData.schedule.map(item => ({
    id: item.eventId,
    title: item.eventName,
    startTime: item.startHour,
    endTime: item.endHour,
    date: item.eventDate,
    type: item.eventType,
    description: item.notes,
  }));
  
  setEvents(events);
};
```

### Saving Changes

```tsx
const handleEventClick = async (event: Event) => {
  // Edit the event however you want
  const updatedEvent = { ...event, title: 'Updated Title' };
  
  // Update your local state
  setEvents(prev => prev.map(e => e.id === event.id ? updatedEvent : e));
  
  // Save to your backend in whatever format you need
  await fetch('/api/events/' + event.id, {
    method: 'PUT',
    body: JSON.stringify({
      name: updatedEvent.title,
      start_time: updatedEvent.startTime,
      end_time: updatedEvent.endTime,
      // ... your format
    }),
  });
};
```

## ICS Standard Support

The library includes built-in support for the ICS (iCalendar) standard, making it easy to import/export calendar data that works with Google Calendar, Outlook, Apple Calendar, and more.

### Export to ICS

```tsx
import { downloadICS, eventsToICS } from '@demmarl/schedule-timeline';

const MySchedule = () => {
  const events = [/* your events */];

  const exportToCalendar = () => {
    // Download as .ics file
    downloadICS(events, 'my-schedule.ics', 'My Event Schedule');
  };

  const getICSContent = () => {
    // Get ICS content as string (for API calls, etc.)
    const icsContent = eventsToICS(events, 'My Calendar');
    return icsContent;
  };

  return (
    <div>
      <ScheduleTimeline events={events} />
      <button onClick={exportToCalendar}>
        Add to Calendar
      </button>
    </div>
  );
};
```

### Import from ICS

```tsx
import { loadICSFile, icsToEvents } from '@demmarl/schedule-timeline';

const ImportExample = () => {
  const [events, setEvents] = useState([]);

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const importedEvents = await loadICSFile(file);
        setEvents(prev => [...prev, ...importedEvents]);
      } catch (error) {
        console.error('Import failed:', error);
      }
    }
  };

  const handleICSContent = (icsContent: string) => {
    // Parse ICS content from API, clipboard, etc.
    const events = icsToEvents(icsContent);
    setEvents(events);
  };

  return (
    <div>
      <input type="file" accept=".ics" onChange={handleFileImport} />
      <ScheduleTimeline events={events} />
    </div>
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
//TODO
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

Apache-2.0

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
