import { ExecutionContext, createParamDecorator } from "@nestjs/common";
// import { IUser } from "@/modules/users/interface/users.interface";

// export const GetUser = createParamDecorator(
//   (data: keyof IUser, ctx: ExecutionContext) => {
//     const req = ctx.switchToHttp().getRequest();
//     const user = req.user;
//     return data ? user?.[data] : user;
//   },
// );
