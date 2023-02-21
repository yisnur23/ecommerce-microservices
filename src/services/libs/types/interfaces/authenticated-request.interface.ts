import { Request } from 'express';
import { AuthenticatedUser } from '../user.type';

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
