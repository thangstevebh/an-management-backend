import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'email@email.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty({})
  @Transform(({ value }: TransformFnParams): string => value.trim())
  email: string;

  @ApiProperty({
    example: 'Password@123',
    required: true,
  })
  @IsString()
  @IsNotEmpty({})
  @Transform(({ value }: TransformFnParams): string => value.trim())
  password: string;
}
