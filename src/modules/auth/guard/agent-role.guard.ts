import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AGENT_ROLES_KEY } from "@src/_core/decorators/agent-role.decorator";
import { ROLES_KEY } from "@src/_core/decorators/role.decorator";
import { PermissionDeniedException } from "@src/_core/exceptions/permission-denied.exception";
import { UserRole } from "@src/modules/user/user.constant";
import { UserService } from "@src/modules/user/user.service";

@Injectable()
export class AgentRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(AGENT_ROLES_KEY, [
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

    const agent = request.headers["x-agent"];

    if (!agent) {
      throw new BadRequestException("Agent header is required");
    }

    const user = await this.userService.getUserAgent({
      _id: userRequest._id,
      username: userRequest.username,
      phoneNumber: userRequest.phoneNumber,
      agentId: agent,
    });

    if (!user) {
      throw new PermissionDeniedException("You do not have permission to access");
    }

    if (user.role === UserRole.ADMIN) {
      return true; // Admins have access to all agent roles
    }

    if (!user.agentUser || user.agentUser.length === 0) {
      throw new PermissionDeniedException("You do not have permission to access this resource");
    }

    const agentUserRoles = user.agentUser.map((item) => item.agentRole);

    const checkRoles = agentUserRoles.filter((item) => roles.includes(item));

    if (checkRoles.length === 0) {
      throw new PermissionDeniedException("You do not have permission to access this resource");
    }

    return true;
  }
}
