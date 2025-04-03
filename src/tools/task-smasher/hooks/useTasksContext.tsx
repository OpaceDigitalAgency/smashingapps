import React, { createContext, useContext, ReactNode } from 'react';
import { useTasks } from './useTasks';
import { TasksContextType } from '../types';

// Create context for tasks
const TasksContext = createContext<TasksContextType | undefined>(undefined);

// Provider component
export const TasksProvider = ({
  children,
  initialUseCase
}: {
  children: ReactNode;
  initialUseCase?: string;
}) => {
  const tasksData = useTasks(initialUseCase);
  
  return <TasksContext.Provider value={tasksData}>{children}</TasksContext.Provider>;
};

// Hook to use the tasks context
export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }
  return context;
};