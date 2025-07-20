import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class AddWithdrawAmountRequestDto {
  @ApiProperty({
    example: 10000000,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  withdrawRequestedAmount: number;

  @ApiProperty({
    example: "default note",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  note?: string;
}
