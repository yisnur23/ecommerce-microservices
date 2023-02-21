import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;
  let user: User;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findUserByEmail: jest.fn(),
            findUserById: jest.fn(),
            findUserByUsername: jest.fn(),
            createUser: jest.fn(),
            userNameExists: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    user = {
      id: 'user_id',
      email: 'user@email.com',
      username: 'username',
      addresses: [],
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUserByEmail', () => {
    it('should return user', async () => {
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);
      const result = await service.findUserByEmail(user.email);
      expect(userRepository.findUserByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(user.email);
      expect(result).toEqual(user);
    });

    it('should throw a not found exception if a user is not found', async () => {
      const email = 'user@email.com';
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);
      try {
        await service.findUserByEmail(email);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(`user with email ${email} not found`);
      }
    });
  });

  describe('findUserById', () => {
    it('should return user', async () => {
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(user);
      const result = await service.findUserById(user.id);
      expect(userRepository.findUserById).toHaveBeenCalledTimes(1);
      expect(userRepository.findUserById).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(user);
    });

    it('should throw a not found exception if a user is not found', async () => {
      const id = 'user_id';
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(null);
      try {
        await service.findUserById(id);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(`user with id ${id} not found`);
      }
    });
  });
  describe('createUser', () => {
    it('create and return a user', async () => {
      const userDto = { email: user.email, username: user.username };
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
      const result = await service.createUser(userDto);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const id = 'user_id';
      const username = 'new_username';
      jest.spyOn(service, 'findUserById').mockResolvedValue(user);
      jest.spyOn(service, 'userNameExists').mockResolvedValue(false);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
      const result = await service.updateUser(id, {
        username,
      });
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        username,
      });
      expect(result).toEqual(user);
    });
    it('should throw a conflict exception if username already exists', async () => {
      const id = 'user_id';
      const username = 'new_username';
      jest.spyOn(service, 'findUserById').mockResolvedValue(user);
      jest.spyOn(service, 'userNameExists').mockResolvedValue(true);

      try {
        await service.updateUser(id, {
          username,
        });
      } catch (err) {
        expect(service.userNameExists).toHaveBeenCalledTimes(1);
        expect(service.userNameExists).toHaveBeenCalledWith(username);
        expect(err).toBeInstanceOf(ConflictException);
        expect(err.message).toEqual(`username ${username} already exists`);
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const id = 'user_id';
      jest.spyOn(service, 'findUserById').mockResolvedValue(user);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(user);
      const result = await service.deleteUser(id);
      expect(userRepository.remove).toHaveBeenCalledTimes(1);
      expect(userRepository.remove).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });
  describe('userNameExists', () => {
    it('should return true if username exists', async () => {
      jest.spyOn(userRepository, 'findUserByUsername').mockResolvedValue(user);
      const result = await service.userNameExists(user.username);
      expect(userRepository.findUserByUsername).toHaveBeenCalledTimes(1);
      expect(userRepository.findUserByUsername).toHaveBeenCalledWith(
        user.username,
      );
      expect(result).toEqual(true);
    });
    it('should return false if username does not exist', async () => {
      const username = 'new_username';
      jest.spyOn(userRepository, 'findUserByUsername').mockResolvedValue(user);
      const result = await service.userNameExists(username);
      expect(userRepository.findUserByUsername).toHaveBeenCalledTimes(1);
      expect(userRepository.findUserByUsername).toHaveBeenCalledWith(username);
      expect(result).toEqual(false);
    });
  });
});
