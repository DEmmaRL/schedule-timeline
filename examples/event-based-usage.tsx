import React from 'react';
import { ScheduleTimeline, Event, createEvent, createDayEvents } from '@demmarl/schedule-timeline';

// Ejemplo 1: Uso básico con array de eventos
const BasicEventExample = () => {
  // Los eventos pueden venir de cualquier fuente: API, base de datos, archivo, etc.
  const events: Event[] = [
    {
      id: 1,
      title: 'Ceremonia de Apertura',
      startTime: '09:00',
      endTime: '10:00',
      date: '2024-03-21',
      type: 'opening',
      description: 'Bienvenida y presentación del evento',
    },
    {
      id: 2,
      title: 'Workshop de Algoritmos',
      startTime: '10:00',
      endTime: '12:00',
      date: '2024-03-21',
      type: 'theory',
      description: 'Introducción a algoritmos avanzados',
    },
    {
      id: 3,
      title: 'Almuerzo',
      startTime: '12:00',
      endTime: '13:00',
      date: '2024-03-21',
      type: 'break',
    },
    {
      id: 4,
      title: 'Competencia Principal',
      startTime: '09:00',
      endTime: '14:00',
      date: '2024-03-22',
      type: 'contest',
      description: 'Competencia de programación',
    },
  ];

  return (
    <ScheduleTimeline
      events={events}
      onEventClick={(event) => {
        console.log('Clicked event:', event);
      }}
    />
  );
};

// Ejemplo 2: Cargando eventos desde una API
const ApiEventExample = () => {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simular carga desde API
    const loadEvents = async () => {
      try {
        // Aquí harías tu llamada real a la API
        const response = await fetch('/api/events');
        const data = await response.json();
        
        // Los datos pueden venir en cualquier formato, solo necesitas convertirlos a Event[]
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
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) return <div>Cargando eventos...</div>;

  return (
    <ScheduleTimeline
      events={events}
      onEventClick={(event) => {
        alert(`Evento: ${event.title}\nHora: ${event.startTime} - ${event.endTime}`);
      }}
    />
  );
};

// Ejemplo 3: Usando las funciones helper
const HelperFunctionExample = () => {
  const events = [
    // Crear eventos individuales
    createEvent(
      'Registro',
      '08:00',
      '09:00',
      '2024-03-21',
      { type: 'registration', description: 'Registro de participantes' }
    ),
    
    // Crear múltiples eventos del mismo día
    ...createDayEvents('2024-03-21', [
      {
        title: 'Keynote',
        startTime: '09:00',
        endTime: '10:00',
        type: 'opening',
        description: 'Charla magistral de apertura',
      },
      {
        title: 'Coffee Break',
        startTime: '10:00',
        endTime: '10:30',
        type: 'break',
      },
      {
        title: 'Workshop A',
        startTime: '10:30',
        endTime: '12:00',
        type: 'theory',
      },
    ]),
    
    // Eventos del segundo día
    ...createDayEvents('2024-03-22', [
      {
        title: 'Competencia',
        startTime: '09:00',
        endTime: '14:00',
        type: 'contest',
        description: 'Competencia principal de programación',
      },
      {
        title: 'Ceremonia de Clausura',
        startTime: '15:00',
        endTime: '16:00',
        type: 'closing',
      },
    ]),
  ];

  return (
    <ScheduleTimeline
      events={events}
      config={{
        startHour: 8,
        endHour: 18,
        pixelsPerMinute: 3,
      }}
      onEventClick={(event) => {
        console.log('Event details:', event);
      }}
    />
  );
};

// Ejemplo 4: Integración con base de datos (cualquier formato)
const DatabaseIntegrationExample = () => {
  const [events, setEvents] = React.useState<Event[]>([]);

  // Función para cargar desde tu base de datos
  const loadFromDatabase = async () => {
    // Ejemplo con diferentes formatos de DB
    const dbData = await fetch('/api/schedule').then(r => r.json());
    
    // Convertir tu formato de DB al formato Event
    const events: Event[] = dbData.activities.map((activity: any) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      startTime: activity.start_time, // Tu formato
      endTime: activity.end_time,     // Tu formato
      date: activity.date,            // Tu formato
      type: activity.type,
      color: activity.custom_color,
    }));
    
    setEvents(events);
  };

  // Función para guardar en tu base de datos
  const saveToDatabase = async (updatedEvents: Event[]) => {
    // Convertir de Event[] a tu formato de DB
    const dbFormat = {
      activities: updatedEvents.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start_time: event.startTime,
        end_time: event.endTime,
        date: event.date,
        type: event.type,
        custom_color: event.color,
      }))
    };
    
    await fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dbFormat),
    });
  };

  React.useEffect(() => {
    loadFromDatabase();
  }, []);

  return (
    <div>
      <div className="mb-4">
        <button 
          onClick={() => saveToDatabase(events)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Guardar en DB
        </button>
        <button 
          onClick={loadFromDatabase}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
        >
          Cargar desde DB
        </button>
      </div>
      
      <ScheduleTimeline
        events={events}
        onEventClick={(event) => {
          // Aquí puedes abrir un modal de edición, etc.
          console.log('Edit event:', event);
        }}
      />
    </div>
  );
};

export { 
  BasicEventExample, 
  ApiEventExample, 
  HelperFunctionExample, 
  DatabaseIntegrationExample 
};
