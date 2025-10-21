import { SafeUser } from './safe-user.entity';

export class EnrichedUser extends SafeUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public totalTasks: number,
    public completedTasks: number,
  ) {
    super(id, name, email);
  }
}
