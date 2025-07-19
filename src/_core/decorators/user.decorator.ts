import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { IUser } from "@src/modules/user/user.interface";

export const GetUser = createParamDecorator((data: keyof IUser, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user as IUser;
  return data ? user?.[data] : user;
});
