import { Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiOperation } from "@nestjs/swagger";
import { ICommonResponse } from "src/_core/interceptors/common.interface";
import { CommonResponse } from "src/_core/helpers/common.helper";
import { ReturnStatus } from "src/_core/constants/common.constants";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: "Create User",
    description: "This endpoint creates a new user.",
  })
  @HttpCode(HttpStatus.OK)
  @Post("/create-user")
  async createUser(): Promise<ICommonResponse> {
    const user = await this.userService.createUser();

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "User created successfully",
      data: {},
    });
  }
}
