import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { AgentRole } from "../agent.constant";

export class AddAgentMemberDto {
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
    example: AgentRole.MEMBER,
    enum: AgentRole,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(AgentRole)
  agentRole: AgentRole;
}
