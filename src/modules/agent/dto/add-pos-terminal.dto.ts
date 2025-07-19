import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class AddPosTerminalDto {
  @ApiProperty({
    example: "EXIM KIM THU 04",
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
    example: 0.96,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  feePerDay: number;

  @ApiProperty({
    example: 1.17,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  feePerTerminal: number;

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
}
