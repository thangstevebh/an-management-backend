import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CommonResponse } from "@src/_core/helpers/common.helper";
import { ADMIN_KEY, ReturnStatus } from "@src/_core/constants/common.constants";
import { RegisterDto } from "./dto/register.dto";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { IUserJWT } from "./auth.interface";
import { ICommonResponse } from "@src/_core/interfaces/common.interface";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({
    summary: "Register User",
    description: "This endpoint registers a new user.",
  })
  @HttpCode(HttpStatus.OK)
  @Post("/admin-register")
  async register(
    @Body() payload: RegisterDto,
    @Query("key") key: string,
  ): Promise<ICommonResponse> {
    if (key !== ADMIN_KEY) {
      throw new BadRequestException("Invalid admin key");
    }

    const { username, firstName, lastName, phoneNumber, password, confirmPassword } = payload;

    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const existingUser = await this.userService.findUserByUsername(username);

    if (existingUser) {
      throw new BadRequestException("Username already exists");
    }

    const newUser = await this.userService.createUser({
      username,
      firstName,
      lastName,
      phoneNumber,
      password,
    });
    const jwtPayload: IUserJWT = {
      _id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };

    // Generate JWT token for the new user
    const token = this.jwtService.sign(jwtPayload);

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "User registered successfully",
      data: {
        accessToken: token,
      },
    });
  }
  @ApiOperation({
    summary: "Login User",
    description: "This endpoint logs in a user and returns a JWT token.",
  })
  @HttpCode(HttpStatus.OK)
  @Post("/login")
  async login(@Body() payload: LoginDto): Promise<ICommonResponse> {
    const { phoneNumber, password } = payload;
    const user = await this.userService.findUserByPhonenumber(phoneNumber);

    if (!user) {
      throw new BadRequestException("User not found");
    }

    const isPasswordValid = await this.authService.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException("Invalid password");
    }

    const jwtPayload: IUserJWT = {
      _id: user._id,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // Generate JWT token for the new user
    const token = this.jwtService.sign(jwtPayload);

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "User registered successfully",
      data: {
        accessToken: token,
      },
    });
  }
}
