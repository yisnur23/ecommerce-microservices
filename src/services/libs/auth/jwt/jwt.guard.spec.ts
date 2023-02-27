import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt.guard';
import { createMock } from '@golevelup/ts-jest';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const mockReflector = createMock<Reflector>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = moduleRef.get<Reflector>(Reflector);
  });

  it('should return true if the route is marked as public', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(true);

    const context = createMock<ExecutionContext>();
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should call the parent super canActivate method if the route is not public', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(false);

    const mockSuperCanActivate = jest
      .spyOn(JwtAuthGuard.prototype, 'canActivate')
      .mockResolvedValue(true);

    const context = createMock<ExecutionContext>();
    const result = await guard.canActivate(context);

    expect(mockSuperCanActivate).toHaveBeenCalledWith(context);
    expect(result).toBe(true);
  });
});
