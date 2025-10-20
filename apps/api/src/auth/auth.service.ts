import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { NewUserDTO } from '../users/dtos/new-user.dto';
import { DuplicateUserError } from '../users/errors/duplicate-user.error';
import { JwtService } from '@nestjs/jwt';
import { PayloadUser } from './types/payload-user.type';
import { JwtPayload } from './types/jwt-payload.type';
import { SafeUser } from '../users/entities/safe-user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(email: string, password: string): Promise<{ token: string; user: SafeUser }> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.login(user);
  }

  async validateUser(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isMatch = await this.comparePasswords(password, user.password);
      if (isMatch) {
        return new SafeUser(user.id, user.name, user.email);
      }
    }
    return null;
  }

  async login(user: SafeUser): Promise<{ token: string; user: SafeUser }> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return { token, user };
  }

  async register(user: NewUserDTO): Promise<User> {
    try {
      user.password = await this.hashPassword(user.password);
      return await this.usersService.create(user);
    } catch (error) {
      if (error instanceof DuplicateUserError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async getUser(user: PayloadUser): Promise<SafeUser> {
    const foundUser = await this.usersService.findByEmail(user.email);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return new SafeUser(foundUser.id, foundUser.name, foundUser.email);
  }

  private hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashed);
  }
}
