import { NewUserDTO } from '../dtos/new-user.dto';
import { User } from '../entities/user.entity';

export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(newUser: NewUserDTO): Promise<User>;
}
