import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Profile } from 'passport-google-oauth20';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOrCreateUser Service', () => {
    it('returns a user if it exisits', async () => {
      const profile = {
        emails: [
          {
            value: 'user@gmail.com',
            verified: 'true',
          },
        ],
        displayName: 'username',
      } as Profile;

      const user = {
        email: profile.emails[0].value,
        username: profile.username,
        id: 'user_id',
        addresses: [],
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(user);

      const newUser = await service.findOrCreateUser(profile);

      expect(userService.findUserByEmail).toBeCalledTimes(1);
      expect(userService.findUserByEmail).toBeCalledWith(
        profile.emails[0].value,
      );
      expect(newUser).toEqual(user);
    });

    it('creates and returns a new user if it does not exist', async () => {
      const profile = {
        emails: [
          {
            value: 'user@gmail.com',
            verified: 'true',
          },
        ],
        displayName: 'username',
      } as Profile;

      const user = {
        email: profile.emails[0].value,
        username: profile.username,
        id: 'user_id',
        addresses: [],
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'createUser').mockResolvedValue(user);

      const newUser = await service.findOrCreateUser(profile);

      expect(userService.findUserByEmail).toBeCalledTimes(1);
      expect(userService.findUserByEmail).toBeCalledWith(
        profile.emails[0].value,
      );
      expect(userService.createUser).toBeCalledTimes(1);
      expect(userService.createUser).toBeCalledWith({
        email: profile.emails[0].value,
        username: profile.displayName,
      });
      expect(newUser).toEqual(user);
    });
  });
  describe('login', () => {
    it('returns a jwt of user', () => {
      const user = {
        id: 'id',
        email: 'user@email.com',
      };
      service.login(user);

      expect(jwtService.sign).toBeCalledWith(user);
      expect(jwtService.sign).toBeCalledTimes(1);
    });
  });
});
