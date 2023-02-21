import { AnyMongoAbility } from '@casl/ability';

export abstract class BaseAbilityFactory {
  abstract defineAbilityFor(user: any): AnyMongoAbility;
}
