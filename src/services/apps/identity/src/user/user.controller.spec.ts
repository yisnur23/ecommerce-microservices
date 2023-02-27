import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatedRequest } from '@app/types/interfaces/authenticated-request.interface';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let req: AuthenticatedRequest;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    req = {
      user: {
        id: 'id',
        email: 'user@email.com',
      },
      body: {
        username: 'username',
      },
    } as AuthenticatedRequest;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should call userService.findUserById with req.user.id', async () => {
      controller.getMe(req);
      expect(userService.findUserById).toHaveBeenCalledWith(req.user.id);
    });
  });

  describe('updateMe', () => {
    it('should call userService.updateUser with req.user.id and req.body', async () => {
      controller.updateMe(req, { username: 'username' });
      expect(userService.updateUser).toHaveBeenCalledWith(req.user.id, {
        username: 'username',
      });
    });
  });

  describe('deleteMe', () => {
    it('should call userService.deleteUser with req.user.id', async () => {
      controller.deleteMe(req);
      expect(userService.deleteUser).toHaveBeenCalledWith(req.user.id);
    });
  });
});
