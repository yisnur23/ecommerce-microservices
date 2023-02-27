import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AbilityFactory } from './ability.factory';
import { IdentityAbilityGuard } from './ability.guard';

@Module({
  providers: [
    AbilityFactory,
    {
      provide: APP_GUARD,
      useClass: IdentityAbilityGuard,
    },
  ],
  exports: [AbilityFactory],
})
export class AbilityModule {}
