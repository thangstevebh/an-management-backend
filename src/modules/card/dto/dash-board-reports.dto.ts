import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsDate, IsMongoId, IsOptional } from "class-validator";

export class DashboardReportsDto {
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

  @ApiProperty({
    example: "1234567890abcdef123456",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }: TransformFnParams): string | undefined => {
    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }
    return value ? value.trim() : undefined;
  })
  cardId?: string;
}
