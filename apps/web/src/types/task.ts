export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'low' | 'medium';
  completed: boolean;
  deadline?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateTask {
  title: string;
  description: string;
  priority: 'high' | 'low' | 'medium';
  deadline?: Date | null;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  priority?: 'high' | 'low' | 'medium';
  completed?: boolean;
  deadline?: Date | null;
}

export const orderValues = [
  'created_desc',
  'created_asc',
  'deadline_asc',
  'deadline_desc',
  'priority_asc',
  'priority_desc',
] as const;

export type Order = (typeof orderValues)[number];
