import { BaseAbilityFactory } from '@app/auth/ability/base-ability-factory';
import { Action } from '@app/auth/action.type';
import { AuthenticatedUser } from '@app/types/user.type';
import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Product } from '../entities/products.entity';

export type Subjects = InferSubjects<typeof Product>;

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory extends BaseAbilityFactory {
  defineAbilityFor(user: AuthenticatedUser) {
    const { can, build } = new AbilityBuilder(createMongoAbility);
    if (user) {
      can(Action.Create, Product);
      can(Action.Manage, Product, { user_id: user.id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
