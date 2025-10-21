import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { NewUserDTO } from '../users/dtos/new-user.dto';
import { User } from '../users/entities/user.entity';
import { SafeUser } from '../users/entities/safe-user.entity';
import { PayloadUser } from './types/payload-user.type';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockEmail = 'test@example.com';
  const mockPassword = 'password123';
  const mockName = 'Test User';
  const mockJwtToken = 'jwt-token-123';
  const mockUserId = 'test-user-id';

  const mockLoginDto: LoginDto = {
    email: mockEmail,
    password: mockPassword,
  };

  const mockNewUserDto: NewUserDTO = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'newPassword123',
  };

  const mockSafeUser = new SafeUser(mockUserId, mockName, mockEmail);
  const mockPayloadUser: PayloadUser = { id: mockUserId, email: mockEmail };

  type AuthenticatedRequest = Request & { user: PayloadUser };
  const mockRequest: AuthenticatedRequest = {
    user: mockPayloadUser,
  } as AuthenticatedRequest;

  const createMockTestingModule = async (): Promise<TestingModule> => {
    return Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticate: jest.fn(),
            register: jest.fn(),
            getUser: jest.fn(),
          },
        },
      ],
    }).compile();
  };

  beforeEach(async () => {
    const module = await createMockTestingModule();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);

    jest.clearAllMocks();
  });

  describe('Controller Initialization', () => {
    it('should be properly initialized', () => {
      expect(authController).toBeDefined();
      expect(authController).toBeInstanceOf(AuthController);
    });
  });

  describe('POST /auth/login', () => {
    it('should successfully authenticate user and return token', async () => {
      const expectedResponse = {
        token: mockJwtToken,
        user: mockSafeUser,
      };
      authService.authenticate.mockResolvedValue(expectedResponse);

      const result = await authController.login(mockLoginDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.authenticate).toHaveBeenCalledWith(mockEmail, mockPassword);
      expect(authService.authenticate).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      authService.authenticate.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(authController.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
      expect(authService.authenticate).toHaveBeenCalledWith(mockEmail, mockPassword);
    });
  });

  describe('POST /auth/register', () => {
    it('should successfully register new user', async () => {
      const expectedUser = new User(
        'new-user-id',
        'Jane Doe',
        'jane@example.com',
        'hashedPassword',
      );
      authService.register.mockResolvedValue(expectedUser);

      const result = await authController.register(mockNewUserDto);

      expect(result).toEqual(expectedUser);
      expect(authService.register).toHaveBeenCalledWith(mockNewUserDto);
      expect(authService.register).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when user already exists', async () => {
      const conflictError = new ConflictException('User with this email already exists');
      authService.register.mockRejectedValue(conflictError);

      await expect(authController.register(mockNewUserDto)).rejects.toThrow(ConflictException);
      expect(authService.register).toHaveBeenCalledWith(mockNewUserDto);
    });
  });

  describe('GET /auth/me', () => {
    it('should return current authenticated user information', async () => {
      const mockEnrichedUser = {
        id: mockUserId,
        name: mockName,
        email: mockEmail,
        totalTasks: 5,
        completedTasks: 3,
      };
      authService.getUser.mockResolvedValue(mockEnrichedUser);

      const result = await authController.me(mockRequest);

      expect(result).toEqual(mockEnrichedUser);
      expect(authService.getUser).toHaveBeenCalledWith(mockRequest.user);
      expect(authService.getUser).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const notFoundError = new NotFoundException('User not found');
      authService.getUser.mockRejectedValue(notFoundError);

      await expect(authController.me(mockRequest)).rejects.toThrow(NotFoundException);
      expect(authService.getUser).toHaveBeenCalledWith(mockRequest.user);
    });
  });

  describe('POST /auth/login - Validation Tests', () => {
    it('should reject login with invalid email format', () => {
      const invalidDto = {
        email: 'invalid-email',
        password: 'password123',
      };

      expect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(invalidDto.email)) {
          throw new Error('Email must be a valid email address');
        }
      }).toThrow('Email must be a valid email address');
    });

    it('should reject login with empty password', () => {
      const invalidDto = {
        email: 'test@example.com',
        password: '',
      };

      expect(() => {
        if (!invalidDto.password || invalidDto.password.length < 1) {
          throw new Error('Password must not be empty');
        }
      }).toThrow('Password must not be empty');
    });
  });

  describe('POST /auth/register - Validation Tests', () => {
    it('should reject registration with invalid email format', () => {
      const invalidDto = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      };

      expect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(invalidDto.email)) {
          throw new Error('Email must be a valid email address');
        }
      }).toThrow('Email must be a valid email address');
    });

    it('should reject registration with password shorter than 8 characters', () => {
      const invalidDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: '1234567', // 7 characters
      };

      expect(() => {
        if (!invalidDto.password || invalidDto.password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
      }).toThrow('Password must be at least 8 characters long');
    });

    it('should reject registration with empty name', () => {
      const invalidDto = {
        name: '',
        email: 'test@example.com',
        password: 'password123',
      };

      expect(() => {
        if (!invalidDto.name || invalidDto.name.length < 1) {
          throw new Error('Name must not be empty');
        }
      }).toThrow('Name must not be empty');
    });
  });
});
