import React, { useState } from 'react';
import StatCard from './StatCard';
import Chart from './Chart';
import { CheckCircle, ListChecks, Clock, AlertTriangle, BarChart2, LineChart, PieChart } from 'lucide-react';
import { Task, ChartData } from '../../types';

interface TaskOverviewProps {
  tasks: Task[];
}

const TaskOverview: React.FC<TaskOverviewProps> = ({ tasks }) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'doughnut'>('line');
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  const overdueTasks = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
  ).length;
  
  const isValidDate = (date: string | Date | null | undefined): boolean => {
    if (!date) return false;
    const timestamp = new Date(date).getTime();
    return !isNaN(timestamp);
  };

  const generateChartData = (): ChartData[] => {
    const data: ChartData[] = [];
    const today = new Date();
    const taskMap = new Map<string, { added: number, completed: number }>();
    
    // Initialize the last 7 days with zero values
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      taskMap.set(dateStr, { added: 0, completed: 0 });
    }
    
    // Count tasks added and completed per day
    tasks.forEach(task => {
      if (isValidDate(task.createdAt)) {
        const createdDate = new Date(task.createdAt).toISOString().split('T')[0];
        if (taskMap.has(createdDate)) {
          const dayData = taskMap.get(createdDate)!;
          dayData.added++;
          taskMap.set(createdDate, dayData);
        }
        
        if (task.completed) {
          const completedDate = new Date(task.createdAt).toISOString().split('T')[0];
          if (taskMap.has(completedDate)) {
            const dayData = taskMap.get(completedDate)!;
            dayData.completed++;
            taskMap.set(completedDate, dayData);
          }
        }
      }
    });
    
    // Convert Map to data array
    taskMap.forEach((value, key) => {
      data.push({
        date: key,
        added: value.added,
        completed: value.completed,
        failed: 0
      });
    });
    
    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  const chartData = generateChartData();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total des tâches"
          value={totalTasks}
          icon={ListChecks}
          color="bg-blue-500 dark:bg-blue-600"
        />
        <StatCard
          title="Terminées"
          value={completedTasks}
          icon={CheckCircle}
          color="bg-green-500 dark:bg-green-600"
        />
        <StatCard
          title="En cours"
          value={pendingTasks}
          icon={Clock}
          color="bg-yellow-500 dark:bg-yellow-600"
        />
        <StatCard
          title="En retard"
          value={overdueTasks}
          icon={AlertTriangle}
          color="bg-red-500 dark:bg-red-600"
        />
      </div>
      
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-dark-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Progression des tâches</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Taux de complétion</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{completionRate}%</span>
            </div>
            <div className="mt-2 h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 dark:bg-blue-600 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-lg transition-colors ${
                chartType === 'line'
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              <LineChart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-lg transition-colors ${
                chartType === 'bar'
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              <BarChart2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChartType('doughnut')}
              className={`p-2 rounded-lg transition-colors ${
                chartType === 'doughnut'
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              <PieChart className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <Chart data={chartData} type={chartType} />
      </div>
    </div>
  );
};

export default TaskOverview;