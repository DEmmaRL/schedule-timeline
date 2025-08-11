import React from 'react';
import { ScheduleTimeline, createDaySchedule, createActivity, colorThemes } from '../src';

// Example 1: Basic usage with your original TCMX data
const TCMXExample = () => {
  const schedule = [
    createDaySchedule('21', 'Jueves', [
      createActivity('8:00 - 9:00', 'Registro y entrega de kits', 'registration'),
      createActivity('9:00 - 9:20', 'Inauguración', 'opening'),
      createActivity('9:20 - 13:00', 'Sesión teórica + actividades', 'theory'),
      createActivity('13:00 - 14:30', 'Break para comer', 'break'),
      createActivity('14:30 - 19:30', 'Concurso', 'contest'),
    ]),
    createDaySchedule('22', 'Viernes', [
      createActivity('9:00 - 10:45', 'Sesión teórica', 'theory'),
      createActivity('10:45 - 11:15', 'Coffee Break', 'break'),
      createActivity('11:15 - 13:00', 'Upsolving', 'upsolving'),
      createActivity('13:00 - 14:30', 'Break para comer', 'break'),
      createActivity('14:30 - 19:30', 'Concurso', 'contest'),
    ]),
    createDaySchedule('23', 'Sábado', [
      createActivity('9:00 - 10:30', 'Chill time', 'chill'),
      createActivity('10:30 - 11:00', 'Coffee Break', 'break'),
      createActivity('11:00 - 16:00', 'Tercera fecha ICPC', 'icpc'),
      createActivity('16:00 - 19:30', 'Coffee and chill (Discusión sobre la tercera fecha)', 'chill'),
    ]),
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">TCMX 2025 Schedule</h2>
      <ScheduleTimeline
        schedule={schedule}
        onActivityClick={(activity, dayIndex) => {
          alert(`Clicked: ${activity.title} on day ${dayIndex + 1}`);
        }}
      />
    </div>
  );
};

// Example 2: Conference schedule with custom theme
const ConferenceExample = () => {
  const schedule = [
    createDaySchedule('15', 'Monday', [
      createActivity('9:00 - 9:30', 'Registration & Welcome Coffee', 'registration'),
      createActivity('9:30 - 10:30', 'Keynote: Future of AI', 'keynote'),
      createActivity('10:30 - 11:00', 'Coffee Break', 'break'),
      createActivity('11:00 - 12:30', 'Panel: Machine Learning Trends', 'panel'),
      createActivity('12:30 - 14:00', 'Lunch', 'break'),
      createActivity('14:00 - 15:30', 'Workshop: Deep Learning Basics', 'workshop'),
      createActivity('15:30 - 16:00', 'Coffee Break', 'break'),
      createActivity('16:00 - 17:00', 'Networking Session', 'networking'),
    ]),
    createDaySchedule('16', 'Tuesday', [
      createActivity('9:00 - 10:30', 'Technical Session: Computer Vision', 'technical'),
      createActivity('10:30 - 11:00', 'Coffee Break', 'break'),
      createActivity('11:00 - 12:30', 'Workshop: NLP Applications', 'workshop'),
      createActivity('12:30 - 14:00', 'Lunch', 'break'),
      createActivity('14:00 - 15:30', 'Industry Talks', 'industry'),
      createActivity('15:30 - 16:00', 'Coffee Break', 'break'),
      createActivity('16:00 - 17:00', 'Closing Ceremony', 'closing'),
    ]),
  ];

  const customTheme = {
    registration: { background: 'bg-blue-100', text: 'text-blue-800' },
    keynote: { background: 'bg-purple-200', text: 'text-purple-900' },
    panel: { background: 'bg-green-100', text: 'text-green-800' },
    workshop: { background: 'bg-orange-100', text: 'text-orange-800' },
    technical: { background: 'bg-indigo-100', text: 'text-indigo-800' },
    industry: { background: 'bg-yellow-100', text: 'text-yellow-800' },
    networking: { background: 'bg-pink-100', text: 'text-pink-800' },
    break: { background: 'bg-gray-100', text: 'text-gray-700' },
    closing: { background: 'bg-red-100', text: 'text-red-800' },
    default: { background: 'bg-gray-50', text: 'text-gray-600' },
  };

  const config = {
    startHour: 9,
    endHour: 17,
    pixelsPerMinute: 3,
    timeMarkerInterval: 30,
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">AI Conference 2025</h2>
      <ScheduleTimeline
        schedule={schedule}
        config={config}
        colorTheme={customTheme}
        onActivityClick={(activity, dayIndex) => {
          console.log('Activity clicked:', activity);
        }}
        onActivityHover={(activity, dayIndex) => {
          console.log('Activity hovered:', activity.title);
        }}
      />
    </div>
  );
};

// Example 3: Custom activity renderer
const CustomRendererExample = () => {
  const schedule = [
    createDaySchedule('20', 'Wednesday', [
      createActivity('10:00 - 11:00', 'Team Meeting', 'meeting', {
        description: 'Weekly team sync and planning',
        id: 'meeting-1',
      }),
      createActivity('11:30 - 12:30', 'Code Review', 'review', {
        description: 'Review pull requests and discuss architecture',
        id: 'review-1',
      }),
      createActivity('14:00 - 16:00', 'Development Sprint', 'development', {
        description: 'Focus time for feature development',
        id: 'dev-1',
      }),
    ]),
  ];

  const customRenderer = (activity: any, style: React.CSSProperties) => (
    <div
      className="rounded-lg p-2 border-l-4 border-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow"
      style={style}
    >
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-600 mb-1">
            {activity.time}
          </div>
          <div className="text-sm font-medium text-gray-900 mb-1">
            {activity.title}
          </div>
          {activity.description && (
            <div className="text-xs text-gray-500 line-clamp-2">
              {activity.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Custom Styled Schedule</h2>
      <ScheduleTimeline
        schedule={schedule}
        customActivityRenderer={customRenderer}
        config={{ startHour: 10, endHour: 16 }}
      />
    </div>
  );
};

// Main example component
const Examples = () => {
  return (
    <div className="space-y-12">
      <TCMXExample />
      <ConferenceExample />
      <CustomRendererExample />
    </div>
  );
};

export default Examples;
