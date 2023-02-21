import { SetMetadata } from '@nestjs/common';
import { RequiredRule } from '../rule.interface';

export const CHECK_ABILITY = 'check_ability';

export const CheckAbility = (requirement: RequiredRule) =>
  SetMetadata(CHECK_ABILITY, requirement);
