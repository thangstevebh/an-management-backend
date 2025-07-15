import {
  GLOBAL_LANGUAGE,
  ReturnStatus,
} from "@/_core/constants/common.constants";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ApiHeader, ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UsersService } from "../users/users.service";
import { compareString } from "@/_core/helpers/crypto.helper";
import { JwtPayload } from "./interface/auth.interface";
import { JwtTokenService } from "./jwt.service";
import { CommonResponse } from "@/_core/helpers/common.helper";
import { JwtService } from "@nestjs/jwt";
import { IsPublic } from "@/_core/decorators/isPulic.decorator";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EMITTER_COMMAND } from "@/_core/emitter.command";
import { ICommonResponse } from "@/_core/interceptors/common.interface";

@ApiTags("Authentication")
@Controller("v1/auth")
@ApiHeader({
  name: "X-LANG",
  description: "X-LANG",
  enum: GLOBAL_LANGUAGE,
  schema: {
    default: GLOBAL_LANGUAGE.EN,
  },
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly emitter: EventEmitter2,
  ) {}

  @ApiOperation({
    summary: "Login",
    description: "Login",
  })
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post("/login")
  async login(@Body() payload: LoginDto): Promise<ICommonResponse> {
    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Login success",
      data: {},
    });
  }

  @ApiOperation({
    summary: "Test emitter",
    description: "Test emitter",
  })
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post("/test-emitter")
  async testEmitter(): Promise<ICommonResponse> {
    const options = {
      user: "user1",
    };
    this.emitter.emit(EMITTER_COMMAND.TEST, options);

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Test emitter success",
      data: {
        message: "Test emitter success",
      },
    });
  }
}
