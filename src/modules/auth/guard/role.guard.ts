import { ROLES_KEY } from '@/_core/decorators/role.decorator';
import { PermissionDeniedException } from '@/_core/exceptions/permission-denied.exception';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    // private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If there's no roles required to access the route, then allow access
    if (!roles) {
      return true;
    }

    // Check role
    const request = context.switchToHttp().getRequest();

    const userRequest = request.user;

    if (!roles.includes(userRequest.role)) {
      throw new PermissionDeniedException();
    }

    return true;
  }
}
