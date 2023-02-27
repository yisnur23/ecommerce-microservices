import { EntityTarget } from 'typeorm';
import { RequiredRule } from './rule.interface';
import { Action } from './action.type';

export const generateAbilityForEntity = (
  entity: EntityTarget<any>,
): Record<keyof typeof Action, RequiredRule> => {
  return {
    Read: {
      action: Action.Read,
      subject: entity,
    },
    Create: {
      action: Action.Create,
      subject: entity,
    },
    Update: {
      action: Action.Update,
      subject: entity,
    },
    Delete: {
      action: Action.Delete,
      subject: entity,
    },
    Manage: {
      action: Action.Manage,
      subject: entity,
    },
  };
};
