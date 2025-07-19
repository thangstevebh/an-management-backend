import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "@src/_core/decorators/role.decorator";
import { PermissionDeniedException } from "@src/_core/exceptions/permission-denied.exception";
import { UserService } from "@src/modules/user/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userRequest = request.user;

    if (!userRequest) {
      throw new PermissionDeniedException();
    }
    const user = await this.userService.getUser({
      _id: userRequest._id,
      username: userRequest.username,
      phoneNumber: userRequest.phoneNumber,
    });

    if (!user) {
      throw new PermissionDeniedException();
    }

    if (!roles.includes(user.role)) {
      throw new PermissionDeniedException("You do not have permission to access this resource");
    }

    return true;
  }
}
