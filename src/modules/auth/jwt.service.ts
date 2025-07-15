import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtPayload } from './interface/auth.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  // async validateUser(payload: JwtPayload): Promise<any> {
  //   return await this.usersService.findOne(payload.username);
  // }

  sign(jwtPayload: JwtPayload) {
    return this.jwtService.signAsync(jwtPayload);
  }

  decodeToken(token: string) {
    try {
      return this.jwtService.decode(token);
    } catch (err) {
      throw new BadRequestException('Invalid token');
    }
  }
}
