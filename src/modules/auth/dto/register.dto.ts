import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
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

  @ApiProperty({
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty({})
  @Transform(({ value }: TransformFnParams): string => value.trim())
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty({})
  @Transform(({ value }: TransformFnParams): string => value.trim())
  lastName: string;

  @ApiProperty({
    example: '0123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): string => value.trim())
  phone?: string;
}
