import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { BaseAbilityFactory } from './base-ability-factory';
import { AbilityGuard } from './ability.guard';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { AnyMongoAbility } from '@casl/ability';
import { RequiredRule } from '../rule.interface';
import { Action } from '../action.type';
import { CHECK_ABILITY } from '../decorators/ability.decorator';

describe('AbilityGuard', () => {
  let reflector: Reflector;
  let abilityFactory: BaseAbilityFactory;
  let dataSource: DataSource;
  let guard: AbilityGuard;

  beforeEach(async () => {
    const mockReflector = createMock<Reflector>();
    const mockAbilityFactory = createMock<BaseAbilityFactory>();
    const mockDataSource = createMock<DataSource>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AbilityGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: BaseAbilityFactory,
          useValue: mockAbilityFactory,
        },
      ],
    }).compile();

    guard = moduleRef.get<AbilityGuard>(AbilityGuard);
    reflector = moduleRef.get<Reflector>(Reflector);
    abilityFactory = moduleRef.get<BaseAbilityFactory>(BaseAbilityFactory);
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  it('should return true if rule is not defined', async () => {
    jest.spyOn(reflector, 'get').mockReturnValueOnce(undefined);

    const mockExecutionContext = createMock<ExecutionContext>();
    const result = await guard.canActivate(mockExecutionContext);

    expect(reflector.get).toHaveBeenCalledWith(
      CHECK_ABILITY,
      mockExecutionContext.getHandler(),
    );
    expect(result).toBe(true);
  });

  it('should return true if the user has the required ability on the subject', async () => {
    const subject = 'resource';
    const rule: RequiredRule = {
      subject: 'resource',
      action: Action.Read,
    };
    jest.spyOn(reflector, 'get').mockReturnValueOnce(rule);

    const mockAbility = {
      can: jest.fn(() => true),
    } as unknown as AnyMongoAbility;

    jest
      .spyOn(abilityFactory, 'defineAbilityFor')
      .mockReturnValueOnce(mockAbility);
    const user = {};

    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          params: {},
          user,
        }),
      }),
    });

    const result = await guard.canActivate(mockExecutionContext);

    expect(reflector.get).toHaveBeenCalledWith(
      CHECK_ABILITY,
      mockExecutionContext.getHandler(),
    );
    expect(abilityFactory.defineAbilityFor).toHaveBeenCalledWith(user);
    expect(mockAbility.can).toHaveBeenCalledWith(rule.action, rule.subject);
    expect(result).toBe(true);
  });

  it('should return true if the user has the required ability on the specific resource', async () => {
    const subject = 'resource';
    const rule: RequiredRule = {
      subject: 'resource',
      action: Action.Read,
    };
    jest.spyOn(reflector, 'get').mockReturnValueOnce(rule);

    const mockAbility = {
      can: jest.fn(() => true),
    } as unknown as AnyMongoAbility;

    const user = {};
    const resourceId = 'id';
    const mockRequest = {
      params: {
        id: resourceId,
      },
      user,
      resource: {},
    };
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    });
    jest
      .spyOn(abilityFactory, 'defineAbilityFor')
      .mockReturnValueOnce(mockAbility);

    const mockRepository = {
      findOne: jest.fn(() => ({ id: resourceId })),
    } as unknown as Repository<ObjectLiteral>;
    jest.spyOn(dataSource, 'getRepository').mockReturnValueOnce(mockRepository);

    const result = await guard.canActivate(mockExecutionContext);

    expect(reflector.get).toHaveBeenCalledWith(
      CHECK_ABILITY,
      mockExecutionContext.getHandler(),
    );
    expect(abilityFactory.defineAbilityFor).toHaveBeenCalledWith(user);
    expect(dataSource.getRepository).toHaveBeenCalledWith(subject);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: resourceId },
      relations: {
        user: true,
      },
    });
    expect(mockRequest.resource).toEqual({
      id: resourceId,
    });
    expect(mockAbility.can).toHaveBeenCalledWith(rule.action, {
      id: resourceId,
    });
    expect(result).toBe(true);
  });
});
