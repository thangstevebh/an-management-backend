import { ApiProperty } from "@nestjs/swagger";
import { PageOptionsDto } from "@src/_core/constants/common.constants";
import { Transform, TransformFnParams } from "class-transformer";
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class ListBillFilterDto extends PageOptionsDto {
  @ApiProperty({
    example: "bill123",
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  search?: string;

  @ApiProperty({
    example: "1234567890abcdef123456",
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  _id?: string;

  @ApiProperty({
    example: "1234567890abcdef123456",
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  posTerminalId?: string;

  @ApiProperty({
    example: "1234567890abcdef123456",
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  cardId?: string;

  @ApiProperty({
    example: "1234567890abcdef123456",
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  agentId?: string;

  @ApiProperty({
    example: "",
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): Date | undefined => {
    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }
    return value ? new Date(value) : undefined;
  })
  startDate?: Date;

  @ApiProperty({
    example: "",
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): Date | undefined => {
    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }
    return value ? new Date(value) : undefined;
  })
  endDate?: Date;
}
