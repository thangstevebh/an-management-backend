import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_AGENT_REQUIRED } from "@src/_core/decorators/is-agent-required.decorator";
import { PermissionDeniedException } from "@src/_core/exceptions/permission-denied.exception";
import { AgentService } from "@src/modules/agent/agent.service";
import { UserRole } from "@src/modules/user/user.constant";
import { isMongoId } from "class-validator";

@Injectable()
export class AgentRequiredGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    // private usersService: UsersService,
    private agentService: AgentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAgentRequired = this.reflector.getAllAndOverride<boolean>(IS_AGENT_REQUIRED, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isAgentRequired) {
      return true; // If the agent is not required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request["user"];

    if (!user) {
      throw new PermissionDeniedException("User not found in request");
    }

    const agentHeader = request.headers["x-agent"] || null;

    const agent = await this.agentService.getAgent(
      {
        _id: agentHeader,
      },
      user.role === UserRole.ADMIN ? null : user._id,
    );

    if (!agent) {
      throw new PermissionDeniedException("Agent not found");
    }

    if (isAgentRequired && !agentHeader) {
      throw new PermissionDeniedException("Agent header is required for this request");
    }

    if (!isMongoId(agentHeader)) {
      throw new PermissionDeniedException("Invalid agent header format must be a MongoDB ObjectId");
    }

    request["agent"] = agent;

    return true;
  }
}
