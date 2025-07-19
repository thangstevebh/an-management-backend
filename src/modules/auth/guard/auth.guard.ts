import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "@src/_core/decorators/isPulic.decorator";
import { UserService } from "@src/modules/user/user.service";
import { IUserJWT } from "../auth.interface";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Unauthorized");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) {
        throw new UnauthorizedException("Unauthorized");
      }
      const user = await this.userService.getUser({
        _id: payload._id,
        username: payload.username,
        phoneNumber: payload.phoneNumber,
      });

      if (!user) {
        throw new UnauthorizedException("Unauthorized");
      }

      // Populate user with necessary relations if needed
      const { password, ...rest } = user;

      request["user"] = rest;
    } catch {
      throw new UnauthorizedException("Unauthorized");
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers as Request["headers"] & { authorization?: string };
    const [type, token] = authHeader?.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
