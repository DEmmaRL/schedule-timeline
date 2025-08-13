import React from 'react';
import { 
  ScheduleTimeline, 
  Event, 
  eventsToICS, 
  icsToEvents, 
  downloadICS, 
  loadICSFile 
} from '@demmarl/schedule-timeline';

// Ejemplo completo con soporte ICS
const ICSIntegrationExample = () => {
  const [events, setEvents] = React.useState<Event[]>([
    {
      id: 1,
      title: 'Reunión de Equipo',
      startTime: '09:00',
      endTime: '10:00',
      date: '2024-03-21',
      type: 'meeting',
      description: 'Reunión semanal del equipo de desarrollo',
    },
    {
      id: 2,
      title: 'Presentación Cliente',
      startTime: '14:00',
      endTime: '15:30',
      date: '2024-03-21',
      type: 'presentation',
      description: 'Presentación del proyecto al cliente',
    },
    {
      id: 3,
      title: 'Workshop Técnico',
      startTime: '10:00',
      endTime: '12:00',
      date: '2024-03-22',
      type: 'workshop',
      description: 'Workshop sobre nuevas tecnologías',
    },
  ]);

  // Exportar a ICS (compatible con Google Calendar, Outlook, etc.)
  const handleExportICS = () => {
    downloadICS(events, 'mi-horario.ics', 'Mi Horario de Trabajo');
  };

  // Importar desde archivo ICS
  const handleImportICS = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedEvents = await loadICSFile(file);
      setEvents(prev => [...prev, ...importedEvents]);
      alert(`Importados ${importedEvents.length} eventos desde ${file.name}`);
    } catch (error) {
      alert('Error al importar archivo ICS: ' + error);
    }
  };

  // Generar contenido ICS para mostrar
  const handleShowICS = () => {
    const icsContent = eventsToICS(events, 'Mi Calendario');
    
    // Mostrar en una nueva ventana para que el usuario pueda ver el formato
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Contenido ICS</title></head>
          <body>
            <h2>Formato ICS Generado</h2>
            <p>Este es el contenido estándar ICS que se puede importar en cualquier aplicación de calendario:</p>
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto;">
${icsContent}
            </pre>
            <p><small>Puedes copiar este contenido y guardarlo como archivo .ics</small></p>
          </body>
        </html>
      `);
    }
  };

  // Agregar evento manualmente
  const handleAddEvent = () => {
    const newEvent: Event = {
      id: Date.now(),
      title: 'Nuevo Evento',
      startTime: '16:00',
      endTime: '17:00',
      date: '2024-03-21',
      type: 'other',
      description: 'Evento agregado manualmente',
    };
    
    setEvents(prev => [...prev, newEvent]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Integración con Estándar ICS</h2>
      
      {/* Controles */}
      <div className="mb-6 space-x-2 space-y-2">
        <button
          onClick={handleExportICS}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          📅 Exportar a ICS
        </button>
        
        <label className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer inline-block">
          📂 Importar ICS
          <input
            type="file"
            accept=".ics"
            onChange={handleImportICS}
            className="hidden"
          />
        </label>
        
        <button
          onClick={handleShowICS}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          👁️ Ver Formato ICS
        </button>
        
        <button
          onClick={handleAddEvent}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          ➕ Agregar Evento
        </button>
      </div>

      {/* Información */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800">¿Qué es ICS?</h3>
        <p className="text-blue-700 text-sm mt-1">
          ICS (iCalendar) es el estándar internacional para intercambio de información de calendario.
          Los archivos .ics son compatibles con Google Calendar, Outlook, Apple Calendar, y prácticamente
          todas las aplicaciones de calendario.
        </p>
      </div>

      {/* Timeline */}
      <ScheduleTimeline
        events={events}
        onEventClick={(event) => {
          alert(`Evento: ${event.title}\nHora: ${event.startTime} - ${event.endTime}\nDescripción: ${event.description || 'Sin descripción'}`);
        }}
        config={{
          startHour: 8,
          endHour: 18,
          pixelsPerMinute: 3,
        }}
      />

      {/* Lista de eventos */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Eventos Actuales ({events.length})</h3>
        <div className="space-y-2">
          {events.map(event => (
            <div key={event.id} className="p-3 bg-gray-50 rounded flex justify-between items-center">
              <div>
                <strong>{event.title}</strong>
                <span className="text-gray-600 ml-2">
                  {event.date} • {event.startTime} - {event.endTime}
                </span>
                {event.description && (
                  <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                )}
              </div>
              <button
                onClick={() => setEvents(prev => prev.filter(e => e.id !== event.id))}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Ejemplo simple de exportación
const SimpleICSExample = () => {
  const events: Event[] = [
    {
      id: 1,
      title: 'Conferencia Tech',
      startTime: '09:00',
      endTime: '17:00',
      date: '2024-04-15',
      type: 'conference',
      description: 'Conferencia anual de tecnología',
    },
  ];

  const exportToCalendar = () => {
    // Una línea para exportar a cualquier calendario
    downloadICS(events, 'conferencia-tech.ics', 'Conferencia Tech 2024');
  };

  return (
    <div>
      <ScheduleTimeline events={events} />
      <button onClick={exportToCalendar} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Agregar a mi Calendario
      </button>
    </div>
  );
};

export { ICSIntegrationExample, SimpleICSExample };
