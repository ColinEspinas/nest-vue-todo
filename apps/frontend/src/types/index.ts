export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Todo {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  executionDate?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDto {
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  executionDate?: string;
}

export interface UpdateTodoDto {
  title?: string;
  content?: string;
  priority?: 'high' | 'medium' | 'low';
  executionDate?: string;
  completed?: boolean;
}
