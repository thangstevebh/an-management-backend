import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams, Type } from "class-transformer";
import {
  IsBoolean,
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

export class AddCardDetailDto {
  @ApiProperty({
    example: "detail for card123",
    required: true,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  detail?: string;

  @ApiProperty({
    example: 10000000,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    example: 0,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  notWithdrawAmount: number;

  @ApiProperty({
    example: 0,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  withdrawedAmount: number;

  @ApiProperty({
    example: 0,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  negativeAmount: number;

  @ApiProperty({
    example: 0.96,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  feePercent: number;
}
