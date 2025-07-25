import { ApiProperty } from "@nestjs/swagger";
import { PosTerminalType } from "@src/modules/pos-terminal/pos-terminal.constant";
import { Transform, TransformFnParams, Type } from "class-transformer";
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

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

  @ApiProperty({
    example: PosTerminalType.WIFI,
    required: true,
    enum: PosTerminalType,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(PosTerminalType)
  posType: PosTerminalType;

  @ApiProperty({
    example: "6879df3e28f31b389b36d81e",
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  agentId?: string | null = null;
}
