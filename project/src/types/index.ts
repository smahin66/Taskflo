export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate: Date | null;
  category: string;
  priority: 'low' | 'medium' | 'high';
  timerDuration?: number;
  timerStartedAt?: Date;
  timerStatus: 'not_started' | 'running' | 'paused' | 'completed' | 'failed';
  workSessionDuration?: number;
  blocked_resources?: string[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  user_id?: string;
  created_at?: string;
}

export interface BlockedResource {
  id: string;
  user_id: string;
  url: string;
  name: string;
  type: 'website' | 'application';
  created_at: string;
}

export type ChartData = {
  date: string;
  completed: number;
  added: number;
  failed: number;
};

export interface Timer {
  duration: number;
  remainingTime: number;
  status: 'not_started' | 'running' | 'paused' | 'completed' | 'failed';
}