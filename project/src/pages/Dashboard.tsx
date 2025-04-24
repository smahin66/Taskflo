import React from 'react';
import TaskOverview from '../components/Dashboard/TaskOverview';
import { Task } from '../types';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <TaskOverview tasks={tasks} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-dark-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activité récente</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Aucune activité pour le moment. Ajoutez des tâches pour commencer !</p>
          ) : (
            <div className="space-y-4">
              {tasks
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map(task => (
                  <div key={task.id} className="flex items-center border-b border-gray-100 dark:border-dark-700 pb-3">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      task.completed ? 'bg-green-500 dark:bg-green-400' : 'bg-blue-500 dark:bg-blue-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {task.completed ? 'Terminée' : 'Créée'} le {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {task.dueDate && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Échéance : {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-dark-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribution des priorités</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">Aucune tâche pour le moment. Ajoutez des tâches pour voir leur distribution !</p>
          ) : (
            <>
              {['high', 'medium', 'low'].map(priority => {
                const count = tasks.filter(task => task.priority === priority).length;
                const percentage = Math.round((count / tasks.length) * 100) || 0;
                
                const colorClasses = {
                  high: 'bg-red-500 dark:bg-red-400',
                  medium: 'bg-yellow-500 dark:bg-yellow-400',
                  low: 'bg-green-500 dark:bg-green-400'
                };
                
                return (
                  <div key={priority} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm capitalize font-medium text-gray-700 dark:text-gray-300">
                        Priorité {priority === 'high' ? 'haute' : priority === 'medium' ? 'moyenne' : 'basse'}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2.5">
                      <div 
                        className={`${colorClasses[priority as keyof typeof colorClasses]} h-2.5 rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Distribution par catégorie</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(
                    tasks.reduce((acc, task) => {
                      const category = task.category || 'Non catégorisé';
                      acc[category] = (acc[category] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([category, count]) => (
                    <div 
                      key={category} 
                      className="bg-gray-50 dark:bg-dark-700 rounded-xl p-3 border border-gray-100 dark:border-dark-600"
                    >
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{category}</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;