import { AbilityGuard } from '@app/auth/ability/ability.guard';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AbilityFactory } from './ability.factory';

@Injectable()
export class IdentityAbilityGuard extends AbilityGuard {
  constructor(
    reflector: Reflector,
    abilityFactory: AbilityFactory,
    dataSource: DataSource,
  ) {
    super(reflector, abilityFactory, dataSource);
  }
}
