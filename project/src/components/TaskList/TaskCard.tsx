import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Trash2, Edit, Timer, Play, Pause, StopCircle } from 'lucide-react';
import { Task } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface TaskCardProps {
  task: Task;
  onTaskToggle: (id: string) => void;
  onTaskDelete: (id: string) => void;
  onTaskEdit: (task: Task) => void;
  onTimerStart?: (taskId: string) => void;
  onTimerPause?: (taskId: string) => void;
  onTimerStop?: (taskId: string) => void;
}

const priorityColors = {
  low: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400',
  medium: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-400',
  high: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400',
};

const timerStatusColors = {
  not_started: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
  running: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-400',
  paused: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-400',
  completed: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400',
  failed: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400',
};

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onTaskToggle, 
  onTaskDelete, 
  onTaskEdit,
  onTimerStart,
  onTimerPause,
  onTimerStop
}) => {
  const { t } = useLanguage();
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  useEffect(() => {
    let intervalId: number;

    if (task.timerStatus === 'running' && task.timerStartedAt && task.timerDuration) {
      const updateRemainingTime = () => {
        const startTime = new Date(task.timerStartedAt!).getTime();
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        const remainingTime = (task.timerDuration! * 60) - elapsedSeconds;
        
        setRemainingSeconds(remainingTime > 0 ? remainingTime : 0);
      };

      updateRemainingTime();
      intervalId = window.setInterval(updateRemainingTime, 1000);
    } else if (task.timerStatus === 'not_started' && task.timerDuration) {
      setRemainingSeconds(task.timerDuration * 60);
    } else if (task.timerStatus === 'completed' || task.timerStatus === 'failed') {
      setRemainingSeconds(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [task.timerStatus, task.timerStartedAt, task.timerDuration]);
  
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h${minutes.toString().padStart(2, '0')}m${seconds.toString().padStart(2, '0')}s`;
    }
    return `${minutes}m${seconds.toString().padStart(2, '0')}s`;
  };

  const renderTimerControls = () => {
    if (!task.timerDuration) return null;

    return (
      <div className="flex items-center space-x-2">
        {task.timerStatus === 'not_started' && (
          <button
            onClick={() => onTimerStart?.(task.id)}
            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-colors duration-200"
            title={t('start_timer')}
          >
            <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        )}
        
        {task.timerStatus === 'running' && (
          <>
            <button
              onClick={() => onTimerPause?.(task.id)}
              className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 rounded-full transition-colors duration-200"
              title={t('pause_timer')}
            >
              <Pause className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </button>
            <button
              onClick={() => onTimerStop?.(task.id)}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors duration-200"
              title={t('stop_timer')}
            >
              <StopCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </>
        )}
        
        {task.timerStatus === 'paused' && (
          <>
            <button
              onClick={() => onTimerStart?.(task.id)}
              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-colors duration-200"
              title={t('resume_timer')}
            >
              <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
            <button
              onClick={() => onTimerStop?.(task.id)}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors duration-200"
              title={t('stop_timer')}
            >
              <StopCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </>
        )}
      </div>
    );
  };
  
  return (
    <div 
      className={`
        bg-white dark:bg-dark-800 rounded-xl shadow-sm p-4
        transition-all duration-200
        ${task.completed ? 'opacity-70' : 'hover:shadow-md'}
        border border-gray-100 dark:border-dark-700
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <button 
              onClick={() => onTaskToggle(task.id)}
              className="mr-3 focus:outline-none transition-transform duration-300 hover:scale-110"
              aria-label={task.completed ? t('mark_incomplete') : t('mark_complete')}
            >
              {task.completed ? (
                <CheckCircle className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              )}
            </button>
            <div className="flex-1">
              <h3 
                className={`font-medium text-gray-900 dark:text-white ${
                  task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
              )}
              <div className="flex items-center mt-2 flex-wrap gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                  {t(task.priority)}
                </span>
                {task.category && (
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                    {task.category}
                  </span>
                )}
                {task.dueDate && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isOverdue 
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400' 
                      : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-400'
                  }`}>
                    {isOverdue ? t('overdue') : t('due')}: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                {task.timerDuration && remainingSeconds !== null && (
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center ${timerStatusColors[task.timerStatus]}`}>
                    <Timer className="w-3 h-3 mr-1" />
                    {formatTime(remainingSeconds)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {renderTimerControls()}
          <button
            onClick={() => onTaskEdit(task)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
            aria-label={t('edit_task')}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onTaskDelete(task.id)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
            aria-label={t('delete_task')}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;