import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { CHECK_ABILITY } from '../decorators/ability.decorator';
import { RequiredRule } from '../rule.interface';
import { BaseAbilityFactory } from './base-ability-factory';

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: BaseAbilityFactory,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext) {
    const rule = this.reflector.get<RequiredRule>(
      CHECK_ABILITY,
      context.getHandler(),
    );

    if (!rule) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const ability = this.abilityFactory.defineAbilityFor(user);

    const resourceId = request.params.id;

    if (!resourceId) {
      return ability.can(rule.action, rule.subject);
    }

    const repository = this.dataSource.getRepository(rule.subject);

    const resource = await repository.findOne({
      where: { id: resourceId },
      relations: {
        user: true,
      },
    });

    request.resource = resource;

    return ability.can(rule.action, resource);
  }
}
