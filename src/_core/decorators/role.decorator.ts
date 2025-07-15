import { SetMetadata } from '@nestjs/common';
import { USER_ROLE } from '@/modules/users/users.enum';

export const ROLES_KEY = 'user_roles';

export const Roles = (...user_roles: USER_ROLE[]) =>
  SetMetadata(ROLES_KEY, user_roles);
