import React from 'react';
import { 
  ScheduleManager, 
  useScheduleData, 
  DatabaseSchedule,
  convertDatabaseToSchedule 
} from '@demmarl/schedule-timeline';

// Ejemplo de integración con una API REST
const DatabaseIntegrationExample = () => {
  // Funciones para integrar con tu base de datos
  const loadFromDatabase = async (): Promise<DatabaseSchedule> => {
    const response = await fetch('/api/schedule');
    const data = await response.json();
    return data;
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
        autoSaveInterval: 30000, // Auto-save cada 30 segundos
      }}
      showEditControls={true}
      showImportExport={true}
      onScheduleChange={(schedule) => {
        console.log('Schedule changed:', schedule);
      }}
      onError={(error) => {
        console.error('Schedule error:', error);
      }}
    />
  );
};

// Ejemplo usando el hook directamente para más control
const CustomDatabaseIntegration = () => {
  const {
    schedule,
    loading,
    error,
    save,
    load,
    exportICS,
    addActivity,
  } = useScheduleData([], {
    loadFromDatabase: async () => {
      // Tu lógica de carga desde DB
      const response = await fetch('/api/schedule');
      return response.json();
    },
    saveToDatabase: async (data) => {
      // Tu lógica de guardado en DB
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
  });

  const handleAddActivity = () => {
    addActivity(0, {
      time: '14:00 - 15:00',
      title: 'Nueva Actividad',
      type: 'workshop',
    });
  };

  const handleExport = async () => {
    try {
      const icsContent = await exportICS('Mi Horario');
      // Descargar archivo
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'horario.ics';
      a.click();
    } catch (err) {
      console.error('Error al exportar:', err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="mb-4 space-x-2">
        <button onClick={save} className="px-4 py-2 bg-blue-500 text-white rounded">
          Guardar
        </button>
        <button onClick={load} className="px-4 py-2 bg-green-500 text-white rounded">
          Cargar
        </button>
        <button onClick={handleAddActivity} className="px-4 py-2 bg-purple-500 text-white rounded">
          Agregar Actividad
        </button>
        <button onClick={handleExport} className="px-4 py-2 bg-orange-500 text-white rounded">
          Exportar ICS
        </button>
      </div>
      
      <ScheduleTimeline schedule={schedule} />
    </div>
  );
};

// Ejemplo con datos estáticos convertidos desde formato de DB
const StaticDatabaseFormatExample = () => {
  // Datos en formato de base de datos
  const dbData: DatabaseSchedule = {
    activities: [
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
        title: 'Competencia',
        startTime: '09:00',
        endTime: '14:00',
        date: '2024-03-22',
        type: 'contest',
        description: 'Competencia principal de programación',
      },
    ],
    metadata: {
      title: 'ICPC Regional 2024',
      description: 'Competencia regional de programación',
      timezone: 'America/Mexico_City',
    },
  };

  // Convertir a formato de schedule
  const schedule = convertDatabaseToSchedule(dbData);

  return (
    <div>
      <h2>Horario desde Base de Datos</h2>
      <ScheduleTimeline schedule={schedule} />
    </div>
  );
};

export { 
  DatabaseIntegrationExample, 
  CustomDatabaseIntegration, 
  StaticDatabaseFormatExample 
};
