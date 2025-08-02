import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateCardDetailDto {
  @ApiProperty({
    example: 1.2,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  feePercent?: number;

  @ApiProperty({
    example: 10000000,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  amount?: number;

  @ApiProperty({
    example: 10000000,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  notWithdrawAmount?: number;

  @ApiProperty({
    example: 10000000,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  withdrawedAmount?: number;

  @ApiProperty({
    example: 10000000,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  negativeRemainingAmount?: number;

  @ApiProperty({
    example: "New note",
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  detail?: string;
}
