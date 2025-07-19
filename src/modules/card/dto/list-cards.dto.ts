import { ApiProperty } from "@nestjs/swagger";
import { PageOptionsDto } from "@src/_core/constants/common.constants";
import { Transform, TransformFnParams, Type } from "class-transformer";
import {
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class ListCardsFilterDto extends PageOptionsDto {
  @ApiProperty({
    example: "pos123",
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
  isActive?: boolean = true;
}
