import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X, Calendar, CheckCircle } from 'lucide-react';
import { Task } from '../../types';
import TaskCard from '../TaskList/TaskCard';

interface DayTasksModalProps {
  date: Date;
  tasks: Task[];
  onClose: () => void;
  onTaskToggle: (id: string) => void;
  onTaskDelete: (id: string) => void;
  onTaskEdit: (task: Task) => void;
  onTimerStart?: (taskId: string) => void;
  onTimerPause?: (taskId: string) => void;
  onTimerStop?: (taskId: string) => void;
}

const DayTasksModal: React.FC<DayTasksModalProps> = ({
  date,
  tasks,
  onClose,
  onTaskToggle,
  onTaskDelete,
  onTaskEdit,
  onTimerStart,
  onTimerPause,
  onTimerStop
}) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {format(date, 'EEEE d MMMM', { locale: fr })}
                </h2>
                <div className="flex items-center mt-1">
                  <CheckCircle className={`w-4 h-4 mr-1.5 ${
                    completionRate === 100 
                      ? 'text-green-500 dark:text-green-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {completedTasks} sur {tasks.length} tâches terminées ({completionRate}%)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
              hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Aucune tâche pour ce jour
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Ajoutez des tâches pour commencer à organiser votre journée
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default DayTasksModal;