import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CommonResponse } from "src/_core/helpers/common.helper";
import { ReturnStatus } from "src/_core/constants/common.constants";
import { ICommonResponse } from "@src/_core/interfaces/common.interface";
import { GetUser } from "@src/_core/decorators/user.decorator";
import { User } from "./schema/user.schema";
import { ChangePasswordDto } from "./dto/change-password.dto";
import * as bcrypt from "bcrypt";

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
    // const user = await this.userService.createUser();

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "User created successfully",
      data: {},
    });
  }
  @ApiOperation({
    summary: "Change Password",
    description: "This endpoint allows a user to change their password.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post("/change-password")
  async changePassword(
    @GetUser() user: User,
    @Body() payload: ChangePasswordDto,
  ): Promise<ICommonResponse> {
    const { oldPassword, newPassword, confirmNewPassword } = payload;
    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException("Mật khẩu mới không khớp");
    }
    const currentUser = await this.userService.getUser({
      _id: user._id.toString(),
      phoneNumber: user.phoneNumber,
    });
    if (!currentUser) {
      throw new BadRequestException("Người dùng không tồn tại");
    }

    const isValidPassword = await bcrypt.compare(oldPassword, currentUser.password);

    if (!isValidPassword) {
      throw new BadRequestException("Mật khẩu cũ không đúng");
    }

    const newPasswordHash = await bcrypt.hash(
      newPassword,
      parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
    );

    await this.userService.updateUserPassword(user._id.toString(), newPasswordHash);

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Password changed successfully",
      data: {},
    });
  }
}
