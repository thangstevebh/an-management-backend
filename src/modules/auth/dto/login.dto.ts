import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsNumberString, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "1234567890",
    required: true,
  })
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(10)
  @IsNumberString()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  phoneNumber: string;

  @ApiProperty({
    example: "password123",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(6)
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  password: string;
}
