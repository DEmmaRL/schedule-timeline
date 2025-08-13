import React, { useState } from 'react';
import { ScheduleTimeline } from '../ScheduleTimeline';
import { ScheduleTimelineProps } from '../types';
import { useScheduleData, ScheduleDataHookOptions } from '../hooks/useScheduleData';
import { DaySchedule, Activity } from '../types';

export interface ScheduleManagerProps extends Omit<ScheduleTimelineProps, 'schedule'> {
  // Configuración de datos
  dataOptions?: ScheduleDataHookOptions;
  
  // Schedule inicial (opcional si se carga desde DB)
  initialSchedule?: DaySchedule[];
  
  // Mostrar controles de edición
  showEditControls?: boolean;
  
  // Mostrar controles de importación/exportación
  showImportExport?: boolean;
  
  // Callback cuando se hacen cambios
  onScheduleChange?: (schedule: DaySchedule[]) => void;
  
  // Callback para errores
  onError?: (error: string) => void;
  
  // Personalización de la UI
  controlsClassName?: string;
  errorClassName?: string;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  dataOptions = {},
  initialSchedule = [],
  showEditControls = false,
  showImportExport = false,
  onScheduleChange,
  onError,
  controlsClassName = '',
  errorClassName = '',
  ...timelineProps
}) => {
  const {
    schedule,
    loading,
    error,
    setSchedule,
    addActivity,
    updateActivity,
    removeActivity,
    save,
    load,
    exportICS,
    importICS,
    reset,
  } = useScheduleData(initialSchedule, dataOptions);

  const [editingActivity, setEditingActivity] = useState<{
    dayIndex: number;
    activityIndex: number;
    activity: Activity;
  } | null>(null);

  // Notificar cambios al padre
  React.useEffect(() => {
    onScheduleChange?.(schedule);
  }, [schedule, onScheduleChange]);

  // Notificar errores al padre
  React.useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  const handleActivityClick = (activity: Activity, dayIndex: number) => {
    if (showEditControls) {
      const activityIndex = schedule[dayIndex].activities.findIndex(a => a === activity);
      setEditingActivity({ dayIndex, activityIndex, activity });
    }
    
    // Llamar al handler original si existe
    timelineProps.onActivityClick?.(activity, dayIndex);
  };

  const handleSaveActivity = (updatedActivity: Activity) => {
    if (editingActivity) {
      updateActivity(editingActivity.dayIndex, editingActivity.activityIndex, updatedActivity);
      setEditingActivity(null);
    }
  };

  const handleExportICS = async () => {
    try {
      const icsContent = await exportICS('My Schedule');
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'schedule.ics';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleImportICS = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importICS(file);
      } catch (err) {
        console.error('Import failed:', err);
      }
    }
  };

  return (
    <div className="schedule-manager">
      {/* Controles superiores */}
      {(showEditControls || showImportExport) && (
        <div className={`schedule-controls mb-4 flex gap-2 flex-wrap ${controlsClassName}`}>
          {showEditControls && (
            <>
              <button
                onClick={save}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={load}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load'}
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Reset
              </button>
            </>
          )}
          
          {showImportExport && (
            <>
              <button
                onClick={handleExportICS}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Export ICS
              </button>
              <label className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 cursor-pointer">
                Import ICS
                <input
                  type="file"
                  accept=".ics"
                  onChange={handleImportICS}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>
      )}

      {/* Mostrar errores */}
      {error && (
        <div className={`error-message mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded ${errorClassName}`}>
          {error}
        </div>
      )}

      {/* Timeline principal */}
      <ScheduleTimeline
        {...timelineProps}
        schedule={schedule}
        onActivityClick={handleActivityClick}
      />

      {/* Modal de edición */}
      {editingActivity && (
        <ActivityEditModal
          activity={editingActivity.activity}
          onSave={handleSaveActivity}
          onCancel={() => setEditingActivity(null)}
          onDelete={() => {
            removeActivity(editingActivity.dayIndex, editingActivity.activityIndex);
            setEditingActivity(null);
          }}
        />
      )}
    </div>
  );
};

// Componente modal para editar actividades
interface ActivityEditModalProps {
  activity: Activity;
  onSave: (activity: Activity) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const ActivityEditModal: React.FC<ActivityEditModalProps> = ({
  activity,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [formData, setFormData] = useState(activity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Edit Activity</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="9:00 - 10:00"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <input
              type="text"
              value={formData.type || ''}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="workshop, break, contest..."
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
