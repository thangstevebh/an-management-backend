import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { PermissionDeniedException } from "../exceptions/permission-denied.exception";
import { isMongoId } from "class-validator";
import { UserRole } from "@src/modules/user/user.constant";

export const GetAgent = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const agent = req["agent"];

  const user = req["user"];

  if (!agent && !user) {
    throw new PermissionDeniedException();
  }

  if (user.role !== UserRole.ADMIN && !agent) {
    throw new PermissionDeniedException("Agent not found or does not belong to this user");
  }

  return agent ? agent : null;
});

export const GetAgentOptional = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const agentId = req.headers["x-agent"];

  if (!agentId) {
    return null; // Return null if no agent ID is provided
  }

  if (typeof agentId !== "string") {
    throw new PermissionDeniedException("Invalid agent ID format, must be a string");
  }

  if (isMongoId(agentId) === false) {
    throw new PermissionDeniedException("Invalid agent ID format, must be a MongoDB ObjectId");
  }

  return agentId;
});
