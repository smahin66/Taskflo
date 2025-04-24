import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { 
  Plus, X, Timer, Calendar, Tag, Flag, 
  AlignLeft, Clock, CheckCircle2, AlertTriangle,
  Globe, Monitor
} from 'lucide-react';
import { Task, Category, BlockedResource } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialTask?: Task | null;
  categories: Category[];
}

const initialTaskState: Omit<Task, 'id' | 'createdAt'> = {
  title: '',
  description: '',
  completed: false,
  dueDate: null,
  category: '',
  priority: 'medium',
  timerDuration: undefined,
  timerStatus: 'not_started',
  workSessionDuration: undefined,
  blocked_resources: []
};

const TaskForm: React.FC<TaskFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialTask,
  categories
}) => {
  const { t } = useLanguage();
  const [task, setTask] = useState<Omit<Task, 'id' | 'createdAt'>>(
    initialTask 
      ? { 
          title: initialTask.title, 
          description: initialTask.description, 
          completed: initialTask.completed, 
          dueDate: initialTask.dueDate, 
          category: initialTask.category,
          priority: initialTask.priority,
          timerDuration: initialTask.timerDuration,
          timerStatus: initialTask.timerStatus,
          workSessionDuration: initialTask.workSessionDuration,
          blocked_resources: initialTask.blocked_resources || []
        } 
      : initialTaskState
  );
  
  const [error, setError] = useState('');
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [blockedResources, setBlockedResources] = useState<BlockedResource[]>([]);

  useEffect(() => {
    if (initialTask) {
      setTask({
        title: initialTask.title,
        description: initialTask.description,
        completed: initialTask.completed,
        dueDate: initialTask.dueDate,
        category: initialTask.category,
        priority: initialTask.priority,
        timerDuration: initialTask.timerDuration,
        timerStatus: initialTask.timerStatus,
        workSessionDuration: initialTask.workSessionDuration,
        blocked_resources: initialTask.blocked_resources || []
      });
      setShowTimerSettings(!!initialTask.timerDuration);
    }

    loadBlockedResources();
  }, [initialTask]);

  const loadBlockedResources = async () => {
    try {
      const { data, error } = await supabase
        .from('blocked_resources')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBlockedResources(data || []);
    } catch (error) {
      console.error('Error loading blocked resources:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value ? parseInt(value, 10) : undefined }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTask(prev => ({ ...prev, dueDate: value ? new Date(value) : null }));
  };

  const handleBlockedResourceToggle = (resourceId: string) => {
    setTask(prev => ({
      ...prev,
      blocked_resources: prev.blocked_resources?.includes(resourceId)
        ? prev.blocked_resources.filter(id => id !== resourceId)
        : [...(prev.blocked_resources || []), resourceId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.title.trim()) {
      setError('Le titre est requis');
      return;
    }
    
    onSubmit(task);
    setTask(initialTaskState);
    setError('');
  };

  const priorityOptions = [
    { value: 'low', label: 'Basse', color: 'text-green-500 dark:text-green-400' },
    { value: 'medium', label: 'Moyenne', color: 'text-yellow-500 dark:text-yellow-400' },
    { value: 'high', label: 'Haute', color: 'text-red-500 dark:text-red-400' }
  ];

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-dark-700">
      {/* Form header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          {initialTask ? (
            <>
              <CheckCircle2 className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
              Modifier la tâche
            </>
          ) : (
            <>
              <Plus className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
              Nouvelle tâche
            </>
          )}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 
          hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors duration-200"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title input */}
        <div>
          <div className="flex items-center mb-1.5">
            <AlignLeft className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Titre
            </label>
          </div>
          <input
            name="title"
            value={task.title}
            onChange={handleChange}
            placeholder="Entrez le titre de la tâche"
            className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700 
            border ${error ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-dark-600'}
            rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
            transition-all duration-200`}
          />
          {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
        </div>
        
        {/* Description textarea */}
        <div>
          <div className="flex items-center mb-1.5">
            <AlignLeft className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
          </div>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Ajoutez une description détaillée"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700 
            border border-gray-300 dark:border-dark-600 rounded-xl 
            text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
            transition-all duration-200 min-h-[100px]"
          />
        </div>

        {/* Due date and priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-1.5">
              <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date d'échéance
              </label>
            </div>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
              onChange={handleDateChange}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700 
              border border-gray-300 dark:border-dark-600 rounded-xl 
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
              transition-all duration-200"
            />
          </div>

          <div>
            <div className="flex items-center mb-1.5">
              <Flag className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Priorité
              </label>
            </div>
            <div className="flex space-x-2">
              {priorityOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTask(prev => ({ ...prev, priority: option.value as 'low' | 'medium' | 'high' }))}
                  className={`flex-1 py-2 px-3 rounded-xl border transition-all duration-200 ${
                    task.priority === option.value
                      ? 'bg-gray-100 dark:bg-dark-700 border-gray-300 dark:border-dark-600'
                      : 'bg-white dark:bg-dark-800 border-transparent hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <AlertTriangle className={`w-4 h-4 mr-1.5 ${option.color}`} />
                    <span className={`text-sm font-medium ${
                      task.priority === option.value
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category select */}
        <div>
          <div className="flex items-center mb-1.5">
            <Tag className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Catégorie
            </label>
          </div>
          <select
            name="category"
            value={task.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700 
            border border-gray-300 dark:border-dark-600 rounded-xl 
            text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
            transition-all duration-200"
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Timer settings */}
        <div>
          <button
            type="button"
            onClick={() => setShowTimerSettings(!showTimerSettings)}
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Timer className="w-4 h-4 mr-1.5" />
            {showTimerSettings ? 'Masquer les paramètres du minuteur' : 'Afficher les paramètres du minuteur'}
          </button>

          {showTimerSettings && (
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center mb-1.5">
                  <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Durée de la tâche (minutes)
                  </label>
                </div>
                <input
                  type="number"
                  name="timerDuration"
                  value={task.timerDuration || ''}
                  onChange={handleNumberChange}
                  min="1"
                  placeholder="60"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700 
                  border border-gray-300 dark:border-dark-600 rounded-xl 
                  text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                  transition-all duration-200"
                />
              </div>

              <div>
                <div className="flex items-center mb-1.5">
                  <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Durée de la session de travail (minutes)
                  </label>
                </div>
                <input
                  type="number"
                  name="workSessionDuration"
                  value={task.workSessionDuration || ''}
                  onChange={handleNumberChange}
                  min="1"
                  placeholder="120"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-700 
                  border border-gray-300 dark:border-dark-600 rounded-xl 
                  text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                  transition-all duration-200"
                />
              </div>

              {/* Blocked resources */}
              <div>
                <div className="flex items-center mb-1.5">
                  <Globe className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ressources à bloquer
                  </label>
                </div>
                <div className="space-y-2 mt-2">
                  {blockedResources.map(resource => (
                    <label
                      key={resource.id}
                      className="flex items-center p-3 bg-gray-50 dark:bg-dark-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={task.blocked_resources?.includes(resource.id)}
                        onChange={() => handleBlockedResourceToggle(resource.id)}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-dark-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                      <div className="ml-3 flex items-center">
                        {resource.type === 'website' ? (
                          <Globe className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2" />
                        ) : (
                          <Monitor className="w-4 h-4 text-purple-500 dark:text-purple-400 mr-2" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {resource.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {resource.url}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-dark-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            variant="primary"
          >
            <div className="flex items-center">
              <Plus className="h-4 w-4 mr-1.5" />
              {initialTask ? 'Mettre à jour' : 'Ajouter la tâche'}
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;