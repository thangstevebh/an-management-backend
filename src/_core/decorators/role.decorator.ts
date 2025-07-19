import { SetMetadata } from "@nestjs/common";
import { UserRole } from "@src/modules/user/user.constant";

export const ROLES_KEY = "user_roles";

export const Roles = (...user_roles: UserRole[]) => SetMetadata(ROLES_KEY, user_roles);
