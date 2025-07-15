import {
  GLOBAL_LANGUAGE,
  ReturnStatus,
} from '@/_core/constants/common.constants';
import { GetUser } from '@/_core/decorators/user.decorator';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { IUser } from './interface/users.interface';
import { CommonResponse } from '@/_core/helpers/common.helper';
import { Roles } from '@/_core/decorators/role.decorator';
import { USER_ROLE } from './users.enum';
import { ICommonResponse } from '@/_core/interfaces/common.interface';

@Controller('users')
@ApiHeader({
  name: 'X-LANG',
  description: 'X-LANG',
  enum: GLOBAL_LANGUAGE,
  schema: {
    default: GLOBAL_LANGUAGE.EN,
  },
})
export class UsersController {
  constructor() {}

  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get user',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Get('profile')
  async getUserProfile(
    // @Req() req: Request & { user: any },
    @GetUser() getUser: IUser,
  ): Promise<ICommonResponse> {
    delete getUser.iat;
    delete getUser.exp;

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: 'Get user profile success',
      data: {
        user: getUser,
      },
    });
  }

  @ApiOperation({
    summary: 'Check user role',
    description: 'Check user role',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Roles(USER_ROLE.ADMIN)
  @Get('check-user-role')
  async updateUserProfile(@GetUser() getUser: IUser): Promise<ICommonResponse> {
    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: 'Get update user profile success',
      data: {
        user: getUser,
      },
    });
  }
}
