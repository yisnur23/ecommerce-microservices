import { AbilityGuard } from '@app/auth/ability/ability.guard';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource, Repository } from 'typeorm';
import { AbilityFactory } from './ability.factory';

@Injectable()
export class ProductAbilityGuard extends AbilityGuard {
  constructor(
    reflector: Reflector,
    abilityFactory: AbilityFactory,
    dataSource: DataSource,
  ) {
    super(reflector, abilityFactory, dataSource);
  }

  protected getResource(
    resourceId: string,
    repository: Repository<any>,
  ): Promise<any> {
    return repository.findOneBy({
      id: resourceId,
    });
  }
}
