import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Task, BlockedResource } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const isExtensionAvailable = () => {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage;
};

export const useBlockedResources = (tasks: Task[]) => {
  useEffect(() => {
    const updateExtensionBlockedResources = async () => {
      try {
        // Check if extension is available
        if (!isExtensionAvailable()) {
          console.log('Chrome extension not available');
          return;
        }

        // Get all running tasks with blocked resources
        const runningTasks = tasks.filter(task => 
          task.timerStatus === 'running' && 
          task.blocked_resources && 
          task.blocked_resources.length > 0
        );

        // If no running tasks with blocked resources, disable blocking
        if (runningTasks.length === 0) {
          await chrome.runtime.sendMessage({
            type: 'UPDATE_BLOCKED_RESOURCES',
            resources: [],
            isBlocking: false
          });
          return;
        }

        // Get all blocked resources for running tasks
        const { data: resources, error } = await supabase
          .from('blocked_resources')
          .select('*')
          .in('id', runningTasks.flatMap(task => task.blocked_resources || []));

        if (error) throw error;

        // Update extension with blocked resources
        await chrome.runtime.sendMessage({
          type: 'UPDATE_BLOCKED_RESOURCES',
          resources: resources || [],
          isBlocking: true
        });
      } catch (error) {
        console.error('Error updating extension blocked resources:', error);
      }
    };

    updateExtensionBlockedResources();
  }, [tasks]);
};