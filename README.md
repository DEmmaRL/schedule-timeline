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

## Database Integration & ICS Support

### Using ScheduleManager with Database

```tsx
import { ScheduleManager, DatabaseSchedule } from '@demmarl/schedule-timeline';

const MyApp = () => {
  const loadFromDatabase = async (): Promise<DatabaseSchedule> => {
    const response = await fetch('/api/schedule');
    return response.json();
  };

  const saveToDatabase = async (data: DatabaseSchedule): Promise<void> => {
    await fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  return (
    <ScheduleManager
      dataOptions={{
        loadFromDatabase,
        saveToDatabase,
        autoSave: true,
        autoSaveInterval: 30000, // Auto-save every 30 seconds
      }}
      showEditControls={true}
      showImportExport={true}
      onScheduleChange={(schedule) => console.log('Schedule updated:', schedule)}
      onError={(error) => console.error('Error:', error)}
    />
  );
};
```

### Using the Hook Directly

```tsx
import { useScheduleData, ScheduleTimeline } from '@demmarl/schedule-timeline';

const CustomScheduleApp = () => {
  const {
    schedule,
    loading,
    error,
    save,
    load,
    exportICS,
    addActivity,
    updateActivity,
  } = useScheduleData([], {
    loadFromDatabase: async () => {
      const response = await fetch('/api/schedule');
      return response.json();
    },
    saveToDatabase: async (data) => {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
  });

  const handleExportICS = async () => {
    const icsContent = await exportICS('My Schedule');
    // Download the file
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule.ics';
    a.click();
  };

  return (
    <div>
      <div className="controls">
        <button onClick={save}>Save</button>
        <button onClick={load}>Load</button>
        <button onClick={handleExportICS}>Export ICS</button>
      </div>
      <ScheduleTimeline schedule={schedule} />
    </div>
  );
};
```

### Database Format

The library expects database activities in this format:

```typescript
interface DatabaseActivity {
  id: string | number;
  title: string;
  description?: string;
  startTime: string; // "09:00" or ISO string
  endTime: string;   // "10:00" or ISO string
  date: string;      // "2024-03-21" (YYYY-MM-DD)
  type?: string;     // For theming
  color?: string;
  textColor?: string;
}

interface DatabaseSchedule {
  activities: DatabaseActivity[];
  metadata?: {
    title?: string;
    description?: string;
    timezone?: string;
  };
}
```

### Converting Data Formats

```tsx
import { 
  convertDatabaseToSchedule, 
  convertScheduleToDatabase 
} from '@demmarl/schedule-timeline';

// Convert from database format to schedule format
const schedule = convertDatabaseToSchedule(databaseData);

// Convert from schedule format to database format
const databaseData = convertScheduleToDatabase(schedule, 2024);
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
