import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { PermissionDeniedException } from "../exceptions/permission-denied.exception";

export const GetAgent = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const agent = req["agent"];

  if (!agent) {
    throw new PermissionDeniedException();
  }

  return agent ? agent : null;
});
