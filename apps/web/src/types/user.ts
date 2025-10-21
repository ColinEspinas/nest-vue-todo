export type User = {
  id: string;
  email: string;
  name: string;
};

export type EnrichedUser = User & {
  totalTasks: number;
  completedTasks: number;
};

export type NewUser = {
  name: string;
  email: string;
  password: string;
};
