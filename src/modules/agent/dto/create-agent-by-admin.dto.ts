import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateAgentByAdminDto {
  @ApiProperty({
    example: "agent123",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  agentName: string;

  @ApiProperty({
    example: "john_doe",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(22)
  @MinLength(6)
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  username: string;

  @ApiProperty({
    example: "John",
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @MinLength(1)
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  firstName?: string;

  @ApiProperty({
    example: "Doe",
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @MinLength(1)
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  lastName?: string;

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
    example: false,
    required: true,
  })
  @IsBoolean()
  isMain: boolean = false;
}
