import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class AddBillByCardDto {
  @ApiProperty({
    example: "687b5e972e9fc3c2afb2a522",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  posTerminalId: string;

  @ApiProperty({
    example: 4000000,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    example: "006",
    required: true,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  lot?: string;

  @ApiProperty({
    example: "001-001-001-001",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  billNumber: string;

  @ApiProperty({
    example: 1.3,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  customerFee: number;

  @ApiProperty({
    example: 1.04,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  posFee: number;

  @ApiProperty({
    example: 0.08,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  backFee: number;

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
