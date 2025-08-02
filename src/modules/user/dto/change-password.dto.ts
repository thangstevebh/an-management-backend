import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({
    example: "currentPassword123",
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  oldPassword: string;

  @ApiProperty({
    example: "newPassword123",
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  newPassword: string;

  @ApiProperty({
    example: "newPassword123",
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  confirmNewPassword: string;
}
