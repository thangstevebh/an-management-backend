import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams, Type } from "class-transformer";
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class AddCardDto {
  @ApiProperty({
    example: "KIM THU THU",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(2)
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim().toUpperCase() : value,
  )
  name: string;

  @ApiProperty({
    example: "EXIM",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(2)
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim().toUpperCase() : value,
  )
  bankCode: string;

  @ApiProperty({
    example: "0911",
    required: true,
  })
  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(4)
  @MinLength(4)
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  lastNumber: string;

  @ApiProperty({
    example: 0.96,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  defaultFeePercent: number;

  @ApiProperty({
    example: 0.11,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  feeBack: number;

  @ApiProperty({
    example: "2025-12-31T23:59:59.999Z",
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @Transform(
    ({ value }: TransformFnParams): Date => (typeof value == "string" ? new Date(value) : value),
  )
  maturityDate?: Date;

  @ApiProperty({
    example: "687a1a7b5787d1310f289571",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  collaboratorId?: string;
}
