export class Task {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public priority: 'high' | 'low' | 'medium',
    public completed: boolean,
    public deadline: Date | null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public userId: string,
  ) {}
}
