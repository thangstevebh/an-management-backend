import { ApiProperty } from "@nestjs/swagger";
import { PageOptionsDto } from "@src/_core/constants/common.constants";
import { Transform, TransformFnParams, Type } from "class-transformer";
import {
  IsBoolean,
  IsBooleanString,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class ListAgentsFilterDto extends PageOptionsDto {
  @ApiProperty({
    example: "6879d3dad22a72e14e6e9526",
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim().toUpperCase() : value,
  )
  _id?: string;

  @ApiProperty({
    example: "agent123",
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim().toUpperCase() : value,
  )
  agentName?: string;

  @ApiProperty({
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value === "true";
    }
    return Boolean(value);
  })
  isMain?: boolean = true;

  @ApiProperty({
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value === "true";
    }
    return Boolean(value);
  })
  isOwnerPopulate?: boolean = false;
}
