import React, { useMemo, useState } from 'react';
import { Task } from '../../types';
import TaskCard from '../TaskList/TaskCard';
import WeeklyProgressChart from './WeeklyProgressChart';
import DayTasksModal from './DayTasksModal';
import { format, startOfWeek, addDays, isToday, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, Plus, Calendar } from 'lucide-react';

interface WeeklyViewProps {
  tasks: Task[];
  onTaskToggle: (id: string) => void;
  onTaskDelete: (id: string) => void;
  onTaskEdit: (task: Task) => void;
  onTimerStart?: (taskId: string) => void;
  onTimerPause?: (taskId: string) => void;
  onTimerStop?: (taskId: string) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({
  tasks,
  onTaskToggle,
  onTaskDelete,
  onTaskEdit,
  onTimerStart,
  onTimerPause,
  onTimerStop
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, []);

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate;
      return isSameDay(taskDate, date);
    }).sort((a, b) => {
      if (a.completed === b.completed) {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.completed ? 1 : -1;
    });
  };

  const calculateDayCompletion = (date: Date) => {
    const dayTasks = getTasksForDay(date);
    if (dayTasks.length === 0) return 0;
    
    const completedTasks = dayTasks.filter(task => task.completed);
    return Math.round((completedTasks.length / dayTasks.length) * 100);
  };

  const handleAddTask = (date: Date) => {
    const tempId = `temp-${Date.now()}`;
    const newTask: Task = {
      id: tempId,
      title: '',
      description: '',
      completed: false,
      createdAt: new Date(),
      dueDate: date,
      category: '',
      priority: 'medium',
      timerStatus: 'not_started',
      timerDuration: undefined,
      timerStartedAt: undefined,
      workSessionDuration: undefined
    };
    onTaskEdit(newTask);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Calendar className="w-7 h-7 text-blue-500 dark:text-blue-400" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Vue hebdomadaire</h2>
        </div>
      </div>
      
      <WeeklyProgressChart tasks={tasks} />
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayTasks = getTasksForDay(day);
          const completionRate = calculateDayCompletion(day);
          const isCurrentDay = isToday(day);
          
          return (
            <div 
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`
                aspect-square bg-white dark:bg-dark-800 rounded-2xl shadow-sm
                border-2 ${isCurrentDay ? 'border-blue-500 dark:border-blue-400' : 'border-gray-100 dark:border-dark-700'}
                flex flex-col overflow-hidden cursor-pointer
                ${isCurrentDay ? 'ring-2 ring-blue-500/20 dark:ring-blue-400/20' : ''}
                transition-all duration-200 hover:shadow-md hover:scale-[1.02]
              `}
            >
              <div className={`
                px-4 py-3
                ${isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500/50 dark:border-blue-400/50' : 'bg-gray-50 dark:bg-dark-700/50'}
                border-b border-gray-100 dark:border-dark-700
              `}>
                <div className="space-y-1">
                  <h3 className={`text-base font-semibold tracking-wide ${
                    isCurrentDay 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {format(day, 'EEEE', { locale: fr })}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format(day, 'd MMMM', { locale: fr })}
                    </p>
                    
                    {dayTasks.length > 0 && (
                      <div className={`
                        flex items-center px-2 py-0.5 rounded-full text-xs
                        ${completionRate === 100 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
                      `}>
                        <CheckCircle className={`w-3 h-3 mr-1 ${
                          completionRate === 100 
                            ? 'text-green-500 dark:text-green-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`} />
                        <span className="font-medium">
                          {completionRate}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 px-4 py-3 space-y-2 overflow-y-auto">
                {dayTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                    <Calendar className="w-6 h-6 mb-2 opacity-50" />
                    <p className="text-sm">Aucune tâche</p>
                  </div>
                ) : (
                  dayTasks.slice(0, 2).map(task => (
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
                  ))
                )}
                {dayTasks.length > 2 && (
                  <div className="text-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                    +{dayTasks.length - 2} autres tâches
                  </div>
                )}
              </div>

              <div className="px-4 py-3 mt-auto border-t border-gray-100 dark:border-dark-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddTask(day);
                  }}
                  className="flex items-center justify-center w-full py-2 px-3 text-sm font-medium
                  text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 
                  hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl
                  transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Ajouter
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <DayTasksModal
          date={selectedDate}
          tasks={getTasksForDay(selectedDate)}
          onClose={() => setSelectedDate(null)}
          onTaskToggle={onTaskToggle}
          onTaskDelete={onTaskDelete}
          onTaskEdit={onTaskEdit}
          onTimerStart={onTimerStart}
          onTimerPause={onTimerPause}
          onTimerStop={onTimerStop}
        />
      )}
    </div>
  );
};

export default WeeklyView;