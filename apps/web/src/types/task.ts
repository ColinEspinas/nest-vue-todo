export interface Tag {
  id: string;
  name: string;
  color: string | null;
  createdAt: Date;
  userId: string;
}

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
  tags: Tag[];
}

export interface CreateTask {
  title: string;
  description: string;
  priority: 'high' | 'low' | 'medium';
  deadline?: Date | null;
  tagIds: string[];
}

export interface UpdateTask {
  title?: string;
  description?: string;
  priority?: 'high' | 'low' | 'medium';
  completed?: boolean;
  deadline?: Date | null;
  tagIds?: string[];
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
