import React from 'react';
import TaskCard from './TaskCard';
import { Task } from '../../types';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (id: string) => void;
  onTaskDelete: (id: string) => void;
  onTaskEdit: (task: Task) => void;
  onTimerStart?: (taskId: string) => void;
  onTimerPause?: (taskId: string) => void;
  onTimerStop?: (taskId: string) => void;
  filter: string;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onTaskToggle, 
  onTaskDelete, 
  onTaskEdit,
  onTimerStart,
  onTimerPause,
  onTimerStop,
  filter
}) => {
  const { t } = useLanguage();
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return task.category === filter;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">{t('no_tasks_found')}</h3>
        <p className="text-gray-500">
          {filter === 'all' 
            ? t('no_tasks_yet')
            : t('no_tasks_filter')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 mt-4">
      {filteredTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onTaskToggle={onTaskToggle}
          onTaskDelete={onTaskDelete}
          onTaskEdit={onTaskEdit}
          onTimerStart={onTimerStart}
          onTimerPause={onTimerPause}
          onTimerStop={onTimerStop}
        />
      ))}
    </div>
  );
};

export default TaskList;