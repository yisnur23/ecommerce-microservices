import { BaseAbilityFactory } from '@app/auth/ability/base-ability-factory';
import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { UserAddress } from '../address/address.entity';
import { User } from '../user/user.entity';

export enum Action {
  Manage = 'manage',
  Read = 'read',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | InferSubjects<typeof User>
  | InferSubjects<typeof UserAddress>;

export type AppAbility = PureAbility<[Action, Subjects]>;

type FlatUserAddress = UserAddress & {
  'user.id': UserAddress['user']['id'];
};

@Injectable()
export class AbilityFactory extends BaseAbilityFactory {
  defineAbilityFor(user: User) {
    const { can, build } = new AbilityBuilder(createMongoAbility);
    if (user) {
      can(Action.Manage, User, { id: { $eq: user.id } });
      can(Action.Create, UserAddress);
      can<FlatUserAddress>(Action.Manage, UserAddress, { 'user.id': user.id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
