import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user.entity';
import { NewUserDTO } from './dtos/new-user.dto';
import { DuplicateUserError } from './errors/duplicate-user.error';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;

  const mockUserId = 'test-user-id';
  const mockEmail = 'test@example.com';
  const mockName = 'Test User';
  const mockHashedPassword = '$2b$10$hashedPassword123';

  const mockUser = new User(mockUserId, mockName, mockEmail, mockHashedPassword);
  const mockNewUserDto: NewUserDTO = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: '$2b$10$hashedNewPassword123',
  };

  const createMockTestingModule = async (): Promise<TestingModule> => {
    return Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();
  };

  beforeEach(async () => {
    const module = await createMockTestingModule();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);

    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be properly initialized', () => {
      expect(usersService).toBeDefined();
      expect(usersService).toBeInstanceOf(UsersService);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await usersService.findByEmail(mockEmail);

      expect(result).toEqual(mockUser);
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
    });

    it('should return null when user is not found', async () => {
      const nonExistentEmail = 'nonexistent@example.com';
      usersRepository.findByEmail.mockResolvedValue(null);

      const result = await usersService.findByEmail(nonExistentEmail);

      expect(result).toBeNull();
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(nonExistentEmail);
      expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should successfully create a new user', async () => {
      const expectedUser = new User(
        'new-user-id',
        'Jane Doe',
        'jane@example.com',
        '$2b$10$hashedNewPassword123',
      );
      usersRepository.create.mockResolvedValue(expectedUser);

      const result = await usersService.create(mockNewUserDto);

      expect(result).toEqual(expectedUser);
      expect(usersRepository.create).toHaveBeenCalledWith(mockNewUserDto);
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should propagate DuplicateUserError when user already exists', async () => {
      const duplicateError = new DuplicateUserError('User with this email already exists');
      usersRepository.create.mockRejectedValue(duplicateError);

      await expect(usersService.create(mockNewUserDto)).rejects.toThrow(DuplicateUserError);
      expect(usersRepository.create).toHaveBeenCalledWith(mockNewUserDto);
    });
  });
});
