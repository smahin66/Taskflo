import { Task } from '../types';

// Local storage keys
const TASKS_STORAGE_KEY = 'taskflow-tasks';
const CATEGORIES_STORAGE_KEY = 'taskflow-categories';

// Get tasks from local storage
export const getTasks = (): Task[] => {
  try {
    const tasksJSON = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!tasksJSON) return [];
    
    const tasks: Task[] = JSON.parse(tasksJSON);
    
    // Convert date strings to Date objects
    return tasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : null
    }));
  } catch (error) {
    console.error('Error loading tasks from local storage:', error);
    return [];
  }
};

// Save tasks to local storage
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to local storage:', error);
  }
};

// Get categories from local storage
export const getCategories = (): string[] => {
  try {
    const categoriesJSON = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!categoriesJSON) return ['Work', 'Personal', 'Shopping', 'Health'];
    
    return JSON.parse(categoriesJSON);
  } catch (error) {
    console.error('Error loading categories from local storage:', error);
    return ['Work', 'Personal', 'Shopping', 'Health'];
  }
};

// Save categories to local storage
export const saveCategories = (categories: string[]): void => {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories to local storage:', error);
  }
};

// Extract categories from tasks and merge with existing categories
export const extractCategoriesFromTasks = (tasks: Task[]): string[] => {
  const existingCategories = getCategories();
  
  const categoriesFromTasks = tasks
    .map(task => task.category)
    .filter(category => category && !existingCategories.includes(category));
  
  const uniqueCategories = [...new Set([...existingCategories, ...categoriesFromTasks])];
  
  return uniqueCategories;
};