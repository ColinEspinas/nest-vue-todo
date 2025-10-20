export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'low' | 'medium';
  completed: boolean;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateTask {
  title: string;
  description: string;
  priority: 'high' | 'low' | 'medium';
  deadline?: Date;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  priority?: 'high' | 'low' | 'medium';
  completed?: boolean;
  deadline?: Date;
}
