// Mock bcrypt module before importing any other modules
const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
};

// This is crucial - we need to mock the module before importing anything else
jest.mock('bcrypt', () => mockBcrypt);

import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { SafeUser } from '../users/entities/safe-user.entity';
import { NewUserDTO } from '../users/dtos/new-user.dto';
import { DuplicateUserError } from '../users/errors/duplicate-user.error';
import { PayloadUser } from './types/payload-user.type';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUserId = 'test-user-id';
  const mockEmail = 'test@example.com';
  const mockName = 'Test User';
  const mockPassword = 'password123';
  const mockHashedPassword = '$2b$10$hashedPassword123';
  const mockJwtToken = 'jwt-token-123';

  const mockUser = new User(mockUserId, mockName, mockEmail, mockHashedPassword);
  const mockSafeUser = new SafeUser(mockUserId, mockName, mockEmail);
  const mockPayloadUser: PayloadUser = { id: mockUserId, email: mockEmail };

  const createMockTestingModule = async (): Promise<TestingModule> => {
    return Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            enrichUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();
  };

  beforeEach(async () => {
    const module = await createMockTestingModule();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
    mockBcrypt.hash.mockReset();
    mockBcrypt.compare.mockReset();
  });

  describe('Service Initialization', () => {
    it('should be properly initialized', () => {
      expect(authService).toBeDefined();
      expect(authService).toBeInstanceOf(AuthService);
    });
  });

  describe('login', () => {
    it('should generate JWT token and return user data', async () => {
      jwtService.signAsync.mockResolvedValue(mockJwtToken);

      const result = await authService.login(mockSafeUser);

      expect(result).toEqual({
        token: mockJwtToken,
        user: mockSafeUser,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUserId,
        email: mockEmail,
      });
      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUser', () => {
    const enrichedUser = {
      id: mockUserId,
      name: mockName,
      email: mockEmail,
      totalTasks: 5,
      completedTasks: 3,
    };

    it('should return EnrichedUser when user exists and enrichment succeeds', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.enrichUser.mockResolvedValue(enrichedUser);

      const result = await authService.getUser(mockPayloadUser);

      expect(result).toEqual(enrichedUser);
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(usersService.enrichUser).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(authService.getUser(mockPayloadUser)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockEmail);
    });

    it('should throw NotFoundException when enrichment fails', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.enrichUser.mockResolvedValue(null);

      await expect(authService.getUser(mockPayloadUser)).rejects.toThrow(
        new NotFoundException('Enriched user data not found'),
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(usersService.enrichUser).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('authenticate', () => {
    it('should return token and user when credentials are valid', async () => {
      const expectedResponse = { token: mockJwtToken, user: mockSafeUser };

      mockBcrypt.compare.mockResolvedValue(true);
      usersService.findByEmail.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue(mockJwtToken);

      const result = await authService.authenticate(mockEmail, mockPassword);

      expect(result).toEqual(expectedResponse);
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHashedPassword);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(authService.authenticate(mockEmail, mockPassword)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockBcrypt.compare.mockResolvedValue(false);
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.authenticate(mockEmail, mockPassword)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHashedPassword);
    });
  });

  describe('validateUser', () => {
    it('should return SafeUser when credentials are valid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true);

      const result = await authService.validateUser(mockEmail, mockPassword);

      expect(result).toEqual(mockSafeUser);
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHashedPassword);
    });

    it('should return null when user does not exist', async () => {
      const nonExistentEmail = 'nonexistent@example.com';
      const attemptedPassword = 'somePassword123';
      usersService.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser(nonExistentEmail, attemptedPassword);

      expect(result).toBeNull();
      expect(usersService.findByEmail).toHaveBeenCalledWith(nonExistentEmail);
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null when password is incorrect', async () => {
      const wrongPassword = 'wrongPassword123';
      usersService.findByEmail.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false);

      const result = await authService.validateUser(mockEmail, wrongPassword);

      expect(result).toBeNull();
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(wrongPassword, mockHashedPassword);
    });
  });

  describe('register', () => {
    const newUserDto: NewUserDTO = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'newPassword123',
    };
    const hashedNewPassword = '$2b$10$hashedNewPassword123';

    it('should successfully register new user', async () => {
      const expectedUser = new User(
        'new-user-id',
        'Jane Doe',
        'jane@example.com',
        hashedNewPassword,
      );
      mockBcrypt.hash.mockResolvedValue(hashedNewPassword);
      usersService.create.mockResolvedValue(expectedUser);

      const result = await authService.register(newUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockBcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(usersService.create).toHaveBeenCalledWith({
        ...newUserDto,
        password: hashedNewPassword,
      });
      expect(usersService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when user already exists', async () => {
      mockBcrypt.hash.mockResolvedValue(hashedNewPassword);
      usersService.create.mockRejectedValue(new DuplicateUserError());

      await expect(authService.register(newUserDto)).rejects.toThrow(ConflictException);
      expect(usersService.create).toHaveBeenCalledTimes(1);
    });
  });
});
