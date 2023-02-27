import { EntityTarget } from 'typeorm';
import { Action } from './action.type';

export interface RequiredRule {
  action: Action;
  subject: EntityTarget<any>;
}
