import { useState, useEffect, useCallback } from 'react';
import { DaySchedule, Activity } from '../types';
import { 
  DatabaseSchedule, 
  DatabaseActivity,
  convertDatabaseToSchedule, 
  convertScheduleToDatabase,
  exportToICS 
} from '../utils/dataUtils';

export interface ScheduleDataHookOptions {
  // Función para cargar datos desde la base de datos
  loadFromDatabase?: () => Promise<DatabaseSchedule>;
  
  // Función para guardar datos en la base de datos
  saveToDatabase?: (data: DatabaseSchedule) => Promise<void>;
  
  // Función para cargar desde ICS
  loadFromICS?: (file: File) => Promise<string>;
  
  // Auto-save después de cambios
  autoSave?: boolean;
  
  // Intervalo de auto-save en ms
  autoSaveInterval?: number;
}

export interface ScheduleDataHook {
  // Estado actual del schedule
  schedule: DaySchedule[];
  
  // Estado de carga
  loading: boolean;
  
  // Errores
  error: string | null;
  
  // Funciones para manipular datos
  setSchedule: (schedule: DaySchedule[]) => void;
  addActivity: (dayIndex: number, activity: Activity) => void;
  updateActivity: (dayIndex: number, activityIndex: number, activity: Partial<Activity>) => void;
  removeActivity: (dayIndex: number, activityIndex: number) => void;
  
  // Funciones de persistencia
  save: () => Promise<void>;
  load: () => Promise<void>;
  exportICS: (title?: string) => Promise<string>;
  importICS: (file: File) => Promise<void>;
  
  // Función para resetear
  reset: () => void;
}

export interface ScheduleDataHookOptions {
  // Función para cargar datos desde la base de datos
  loadFromDatabase?: () => Promise<DatabaseSchedule>;
  
  // Función para guardar datos en la base de datos
  saveToDatabase?: (data: DatabaseSchedule) => Promise<void>;
  
  // Función para cargar desde ICS
  loadFromICS?: (file: File) => Promise<string>;
  
  // Auto-save después de cambios
  autoSave?: boolean;
  
  // Intervalo de auto-save en ms
  autoSaveInterval?: number;
}

export interface ScheduleDataHook {
  // Estado actual del schedule
  schedule: DaySchedule[];
  
  // Estado de carga
  loading: boolean;
  
  // Errores
  error: string | null;
  
  // Funciones para manipular datos
  setSchedule: (schedule: DaySchedule[]) => void;
  addActivity: (dayIndex: number, activity: Activity) => void;
  updateActivity: (dayIndex: number, activityIndex: number, activity: Partial<Activity>) => void;
  removeActivity: (dayIndex: number, activityIndex: number) => void;
  
  // Funciones de persistencia
  save: () => Promise<void>;
  load: () => Promise<void>;
  exportICS: (title?: string) => Promise<string>;
  importICS: (file: File) => Promise<void>;
  
  // Función para resetear
  reset: () => void;
}

export function useScheduleData(
  initialSchedule: DaySchedule[] = [],
  options: ScheduleDataHookOptions = {}
): ScheduleDataHook {
  const [schedule, setScheduleState] = useState<DaySchedule[]>(initialSchedule);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Auto-save effect
  useEffect(() => {
    if (options.autoSave && hasChanges && options.saveToDatabase) {
      const interval = setInterval(async () => {
        try {
          await save();
          setHasChanges(false);
        } catch (err) {
          console.error('Auto-save failed:', err);
        }
      }, options.autoSaveInterval || 30000); // 30 segundos por defecto

      return () => clearInterval(interval);
    }
  }, [hasChanges, options.autoSave, options.autoSaveInterval]);

  const setSchedule = useCallback((newSchedule: DaySchedule[]) => {
    setScheduleState(newSchedule);
    setHasChanges(true);
    setError(null);
  }, []);

  const addActivity = useCallback((dayIndex: number, activity: Activity) => {
    setScheduleState(prev => {
      const newSchedule = [...prev];
      if (newSchedule[dayIndex]) {
        newSchedule[dayIndex] = {
          ...newSchedule[dayIndex],
          activities: [...newSchedule[dayIndex].activities, activity]
        };
      }
      return newSchedule;
    });
    setHasChanges(true);
  }, []);

  const updateActivity = useCallback((dayIndex: number, activityIndex: number, activityUpdate: Partial<Activity>) => {
    setScheduleState(prev => {
      const newSchedule = [...prev];
      if (newSchedule[dayIndex]?.activities[activityIndex]) {
        newSchedule[dayIndex] = {
          ...newSchedule[dayIndex],
          activities: newSchedule[dayIndex].activities.map((activity, index) =>
            index === activityIndex ? { ...activity, ...activityUpdate } : activity
          )
        };
      }
      return newSchedule;
    });
    setHasChanges(true);
  }, []);

  const removeActivity = useCallback((dayIndex: number, activityIndex: number) => {
    setScheduleState(prev => {
      const newSchedule = [...prev];
      if (newSchedule[dayIndex]) {
        newSchedule[dayIndex] = {
          ...newSchedule[dayIndex],
          activities: newSchedule[dayIndex].activities.filter((_, index) => index !== activityIndex)
        };
      }
      return newSchedule;
    });
    setHasChanges(true);
  }, []);

  const save = useCallback(async () => {
    if (!options.saveToDatabase) {
      throw new Error('No save function provided');
    }

    setLoading(true);
    setError(null);

    try {
      const dbData = convertScheduleToDatabase(schedule);
      await options.saveToDatabase(dbData);
      setHasChanges(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [schedule, options.saveToDatabase]);

  const load = useCallback(async () => {
    if (!options.loadFromDatabase) {
      throw new Error('No load function provided');
    }

    setLoading(true);
    setError(null);

    try {
      const dbData = await options.loadFromDatabase();
      const newSchedule = convertDatabaseToSchedule(dbData);
      setScheduleState(newSchedule);
      setHasChanges(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options.loadFromDatabase]);

  const exportICS = useCallback(async (title?: string) => {
    try {
      return await exportToICS(schedule, title);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export ICS';
      setError(errorMessage);
      throw err;
    }
  }, [schedule]);

  const importICS = useCallback(async (file: File) => {
    if (!options.loadFromICS) {
      // Implementación básica si no se proporciona función personalizada
      const text = await file.text();
      // Aquí podrías usar parseICSToSchedule del dataUtils
      throw new Error('ICS import not implemented');
    }

    setLoading(true);
    setError(null);

    try {
      const icsContent = await options.loadFromICS(file);
      // Procesar el contenido ICS y convertir a schedule
      // const newSchedule = parseICSToSchedule(icsContent);
      // setScheduleState(newSchedule);
      setHasChanges(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import ICS';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options.loadFromICS]);

  const reset = useCallback(() => {
    setScheduleState(initialSchedule);
    setHasChanges(false);
    setError(null);
  }, [initialSchedule]);

  // Cargar datos iniciales si se proporciona función de carga
  useEffect(() => {
    if (options.loadFromDatabase && schedule.length === 0) {
      load().catch(console.error);
    }
  }, []);

  return {
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
  };
}
