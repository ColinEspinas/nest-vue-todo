import { NewUserDTO } from '../dtos/new-user.dto';
import { EnrichedUser } from '../entities/enriched-user.entity';
import { SafeUser } from '../entities/safe-user.entity';
import { User } from '../entities/user.entity';

export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(newUser: NewUserDTO): Promise<User>;
  abstract enrichUser(user: SafeUser): Promise<EnrichedUser | null>;
}
