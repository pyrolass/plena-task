import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { SignUpRequestDto } from './dto/SignUpDto';
import { SignInRequestDto } from './dto/SignInDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { BlockUserDto } from './dto/BlockUserDto';

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findById: jest.fn(),
  aggregate: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token and user info if user exists', async () => {
      const signInRequestDto: SignInRequestDto = { username: 'testuser' };
      const mockUser = { _id: '12345', username: 'testuser' };
      const token = 'jwt-token';

      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(service['jwtService'], 'sign').mockReturnValue(token);

      const result = await service.signIn(signInRequestDto);

      expect(result).toEqual({
        user_id: '12345',
        username: 'testuser',
        token: token,
      });
    });

    it('should throw an error if user does not exist', async () => {
      const signInRequestDto: SignInRequestDto = { username: 'nonexistent' };

      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

      await expect(service.signIn(signInRequestDto)).rejects.toThrowError();
    });
  });

  describe('signUp', () => {
    it('should create a new user and return token and user info', async () => {
      const signUpRequestDto: SignUpRequestDto = {
        username: 'newuser',
        name: 'newuser',
        surname: 'newuser',
        birthdate: Date.now().toString(),
      };

      const mockUser = { _id: '12345', username: 'newuser' };
      const token = 'jwt-token';

      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(userModel, 'create').mockResolvedValue(mockUser as any);
      jest.spyOn(service['jwtService'], 'sign').mockReturnValue(token);

      const result = await service.signUp(signUpRequestDto);

      expect(result).toEqual({
        user_id: '12345',
        username: 'newuser',
        token: token,
      });
    });

    it('should throw an error if username already exists', async () => {
      const signUpRequestDto: SignUpRequestDto = {
        username: 'existinguser',
        name: 'existinguser',
        surname: 'existinguser',
        birthdate: Date.now().toString(),
      };

      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValue({ username: 'existinguser' } as any);

      await expect(service.signUp(signUpRequestDto)).rejects.toThrowError();
    });
  });

  describe('updateUser', () => {
    it('should update user information', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updateduser' };
      const user_id = '12345';
      const mockUser = { _id: '12345', username: 'updateduser' };

      jest
        .spyOn(userModel, 'findByIdAndUpdate')
        .mockResolvedValue(mockUser as any);

      const result = await service.updateUser(updateUserDto, user_id);

      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should mark user as deleted', async () => {
      const user_id = '12345';
      const mockUser = { _id: '12345', is_delete: true };

      jest
        .spyOn(userModel, 'findByIdAndUpdate')
        .mockResolvedValue(mockUser as any);

      const result = await service.deleteUser(user_id);

      expect(result).toEqual(mockUser);
    });
  });

  describe('blockUser', () => {
    it('should block a user', async () => {
      const blockUserDto: BlockUserDto = { user_id: '67890' };
      const user_id = '12345';
      const mockUser = { _id: '12345', blocked_users: [] };

      jest
        .spyOn(userModel, 'findById')
        .mockResolvedValue({ _id: '67890' } as any);
      jest
        .spyOn(userModel, 'findByIdAndUpdate')
        .mockResolvedValue(mockUser as any);

      const result = await service.blockUser(blockUserDto, user_id);

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user tries to block themselves', async () => {
      const blockUserDto: BlockUserDto = { user_id: '12345' };
      const user_id = '12345';

      await expect(
        service.blockUser(blockUserDto, user_id),
      ).rejects.toThrowError();
    });
  });

  describe('unblockUser', () => {
    it('should unblock a user', async () => {
      const blockUserDto: BlockUserDto = { user_id: '67890' };
      const user_id = '12345';
      const mockUser = { _id: '12345', blocked_users: [] };

      jest
        .spyOn(userModel, 'findById')
        .mockResolvedValue({ _id: '67890' } as any);
      jest
        .spyOn(userModel, 'findByIdAndUpdate')
        .mockResolvedValue(mockUser as any);

      const result = await service.unblockUser(blockUserDto, user_id);

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user to unblock does not exist', async () => {
      const blockUserDto: BlockUserDto = { user_id: 'nonexistent' };
      const user_id = '12345';

      jest.spyOn(userModel, 'findById').mockResolvedValue(null);

      await expect(
        service.unblockUser(blockUserDto, user_id),
      ).rejects.toThrowError();
    });
  });

  describe('getUser', () => {
    it('should return a user by username', async () => {
      const username = 'testuser';
      const mockUser = { _id: '12345', username: 'testuser' };

      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockUser as any);

      const result = await service.getUser(username);

      expect(result).toEqual(mockUser);
    });
  });

  describe('getUsers', () => {
    it('should return a list of users based on filters', async () => {
      const username = 'test';
      const min_age = 18;
      const max_age = 30;
      const user_id = '12345';
      const mockUser = {
        _id: '67890',
        username: 'testuser',
        birthdate: new Date('2000-01-01'),
      };
      const users = [mockUser];

      jest
        .spyOn(userModel, 'findById')
        .mockResolvedValue({ blocked_users: [] } as any);
      jest.spyOn(userModel, 'aggregate').mockResolvedValue(users as any);

      const result = await service.getUsers(
        username,
        min_age,
        max_age,
        user_id,
      );

      expect(result).toEqual({ users });
    });
  });
});
