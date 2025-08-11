import React, { useState } from 'react';
import { ScheduleTimeline, createDaySchedule, createActivity, colorThemes } from '@demmarl/schedule-timeline';

const App = () => {
  const [selectedExample, setSelectedExample] = useState('basic');

  // Ejemplo básico del README
  const basicSchedule = [
    createDaySchedule('21', 'Thursday', [
      createActivity('9:00 - 10:00', 'Opening Ceremony', 'opening'),
      createActivity('10:00 - 12:00', 'Workshop Session', 'theory'),
      createActivity('12:00 - 13:00', 'Lunch Break', 'break'),
      createActivity('13:00 - 15:00', 'Technical Talks', 'theory'),
      createActivity('15:00 - 15:30', 'Coffee Break', 'break'),
      createActivity('15:30 - 17:00', 'Panel Discussion', 'discussion'),
    ]),
    createDaySchedule('22', 'Friday', [
      createActivity('9:00 - 11:00', 'Competition', 'contest'),
      createActivity('11:00 - 11:30', 'Coffee Break', 'break'),
      createActivity('11:30 - 13:00', 'Awards Ceremony', 'closing'),
      createActivity('13:00 - 14:00', 'Networking Lunch', 'networking'),
    ]),
  ];

  // Ejemplo de conferencia
  const conferenceSchedule = [
    createDaySchedule('15', 'Monday', [
      createActivity('8:00 - 9:00', 'Registration & Coffee', 'registration'),
      createActivity('9:00 - 9:30', 'Welcome Keynote', 'keynote'),
      createActivity('9:30 - 10:30', 'AI in Healthcare', 'talk'),
      createActivity('10:30 - 11:00', 'Coffee Break', 'break'),
      createActivity('11:00 - 12:00', 'Machine Learning Workshop', 'workshop'),
      createActivity('12:00 - 13:00', 'Lunch', 'break'),
      createActivity('13:00 - 14:00', 'Data Science Panel', 'panel'),
      createActivity('14:00 - 15:00', 'Networking Session', 'networking'),
    ]),
    createDaySchedule('16', 'Tuesday', [
      createActivity('9:00 - 10:00', 'Cloud Computing Trends', 'talk'),
      createActivity('10:00 - 10:30', 'Coffee Break', 'break'),
      createActivity('10:30 - 12:00', 'Hands-on DevOps', 'workshop'),
      createActivity('12:00 - 13:00', 'Lunch', 'break'),
      createActivity('13:00 - 14:30', 'Security Best Practices', 'talk'),
      createActivity('14:30 - 15:00', 'Closing Remarks', 'closing'),
    ]),
  ];

  const handleActivityClick = (activity: any, dayIndex: number) => {
    alert(`Clicked: ${activity.title} on day ${dayIndex + 1}`);
  };

  const handleActivityHover = (activity: any, dayIndex: number) => {
    console.log('Hovered:', activity.title, 'on day', dayIndex + 1);
  };

  const customRenderer = (activity: any, style: any) => (
    <div className="custom-activity border-l-4 border-blue-500" style={style}>
      <div className="flex items-center gap-2">
        <div className="activity-icon">🎯</div>
        <div className="activity-content">
          <h4 className="font-bold text-sm">{activity.title}</h4>
          <p className="text-xs opacity-75">{activity.time}</p>
        </div>
      </div>
    </div>
  );

  const advancedConfig = {
    startHour: 8,
    endHour: 20,
    pixelsPerMinute: 3,
    showTimeMarkers: true,
    timeMarkerInterval: 30,
  };

  const customTheme = {
    ...colorThemes.minimal,
    workshop: { background: 'bg-indigo-200', text: 'text-indigo-900' },
    networking: { background: 'bg-emerald-200', text: 'text-emerald-900' },
    keynote: { background: 'bg-purple-200', text: 'text-purple-900' },
    panel: { background: 'bg-orange-200', text: 'text-orange-900' },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Schedule Timeline Component Demo
        </h1>
        
        {/* Selector de ejemplos */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSelectedExample('basic')}
              className={`px-4 py-2 rounded ${
                selectedExample === 'basic'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Ejemplo Básico
            </button>
            <button
              onClick={() => setSelectedExample('conference')}
              className={`px-4 py-2 rounded ${
                selectedExample === 'conference'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Conferencia
            </button>
            <button
              onClick={() => setSelectedExample('themed')}
              className={`px-4 py-2 rounded ${
                selectedExample === 'themed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Con Tema Personalizado
            </button>
            <button
              onClick={() => setSelectedExample('custom')}
              className={`px-4 py-2 rounded ${
                selectedExample === 'custom'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border'
              }`}
            >
              Renderer Personalizado
            </button>
          </div>
        </div>

        {/* Contenedor del timeline */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {selectedExample === 'basic' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Ejemplo Básico</h2>
              <ScheduleTimeline
                schedule={basicSchedule}
                onActivityClick={handleActivityClick}
                onActivityHover={handleActivityHover}
              />
            </div>
          )}

          {selectedExample === 'conference' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Conferencia</h2>
              <ScheduleTimeline
                schedule={conferenceSchedule}
                config={advancedConfig}
                onActivityClick={handleActivityClick}
                onActivityHover={handleActivityHover}
              />
            </div>
          )}

          {selectedExample === 'themed' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Con Tema Personalizado</h2>
              <ScheduleTimeline
                schedule={conferenceSchedule}
                config={advancedConfig}
                colorTheme={customTheme}
                onActivityClick={handleActivityClick}
                onActivityHover={handleActivityHover}
              />
            </div>
          )}

          {selectedExample === 'custom' && (
            <div>
              <h2 className="text-xl font-semibent mb-4">Renderer Personalizado</h2>
              <ScheduleTimeline
                schedule={basicSchedule}
                customActivityRenderer={customRenderer}
                onActivityClick={handleActivityClick}
                onActivityHover={handleActivityHover}
              />
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Instrucciones
          </h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Haz clic en cualquier actividad para ver un alert</li>
            <li>• Pasa el mouse sobre las actividades para ver logs en la consola</li>
            <li>• Cambia entre los diferentes ejemplos usando los botones</li>
            <li>• Abre las herramientas de desarrollador para ver los logs de hover</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
