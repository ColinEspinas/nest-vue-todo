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
import { UpdateUserDTO } from '../users/dtos/update-user.dto';
import { DuplicateUserError } from '../users/errors/duplicate-user.error';
import { JwtService } from '@nestjs/jwt';
import { PayloadUser } from './types/payload-user.type';
import { JwtPayload } from './types/jwt-payload.type';
import { SafeUser } from '../users/entities/safe-user.entity';
import { EnrichedUser } from 'src/users/entities/enriched-user.entity';

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

  async getUser(user: PayloadUser): Promise<EnrichedUser> {
    const foundUser = await this.usersService.findByEmail(user.email);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    const enrichedUser = await this.usersService.enrichUser(foundUser);
    if (!enrichedUser) {
      throw new NotFoundException('Enriched user data not found');
    }
    return enrichedUser;
  }

  async updateUser(user: PayloadUser, updateData: UpdateUserDTO): Promise<EnrichedUser> {
    try {
      const foundUser = await this.usersService.findByEmail(user.email);
      if (!foundUser) {
        throw new NotFoundException('User not found');
      }

      await this.usersService.update(foundUser.id, updateData);

      const updatedUser = await this.usersService.findById(foundUser.id);
      if (!updatedUser) {
        throw new NotFoundException('Updated user not found');
      }

      const enrichedUser = await this.usersService.enrichUser(updatedUser);
      if (!enrichedUser) {
        throw new NotFoundException('Enriched user data not found');
      }

      return enrichedUser;
    } catch (error) {
      if (error instanceof DuplicateUserError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  private hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashed);
  }
}
