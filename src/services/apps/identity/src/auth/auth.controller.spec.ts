import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: createMock<AuthService>(),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('return a jwt to user', () => {
    const user = {
      id: 'id',
      email: 'email',
    };
    const mockRequest = { user };
    controller.googleRedirect(mockRequest);

    expect(authService.login).toBeCalledTimes(1);
    expect(authService.login).toBeCalledWith(user);
  });
});
