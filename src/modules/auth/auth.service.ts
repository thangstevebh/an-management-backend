import { ReturnStatus } from "@/_core/constants/common.constants";
import { CommonResponse } from "@/_core/helpers/common.helper";
import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { hashString } from "@/_core/helpers/crypto.helper";
import * as crypto from "crypto";
import { UsersService } from "../users/users.service";
import { JwtPayload } from "./interface/auth.interface";
import { JwtTokenService } from "./jwt.service";
import { EMITTER_COMMAND } from "@/_core/emitter.command";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async register({ payload }: { payload: RegisterDto }) {
    return CommonResponse({
      code: 200,
      status: ReturnStatus.SUCCESS,
      message: "Register success",
      data: {},
    });
  }

  @OnEvent(EMITTER_COMMAND.TEST, { async: true })
  async testEmit(payload: any): Promise<any> {
    console.log("TEST EMITTER", payload);
    return null;
  }
}
