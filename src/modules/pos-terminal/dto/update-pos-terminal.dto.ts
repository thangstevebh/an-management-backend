import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { PosTerminalStatus, PosTerminalType } from "../pos-terminal.constant";

export class UpdatePosTerminalDto {
  @ApiProperty({
    example: "6879df3e28f31b389b36d81e",
    required: true,
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  agentId: string;

  @ApiProperty({
    example: "EXIM KIM THU Updated",
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  name?: string;

  @ApiProperty({
    example: 1.1,
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  feePerDay?: number;

  @ApiProperty({
    example: 1.2,
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  feePerTerminal?: number;

  @ApiProperty({
    example: 1.2,
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  feeBack?: number;

  @ApiProperty({
    example: 1.2,
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  feePercentNormal?: number;

  @ApiProperty({
    example: 1.2,
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  feePercentMB?: number;

  @ApiProperty({
    example: PosTerminalStatus.INACTIVE,
    required: false,
    enum: PosTerminalStatus,
  })
  @IsEnum(PosTerminalStatus)
  @IsString()
  @IsOptional()
  status?: PosTerminalStatus;

  @ApiProperty({
    example: "update note",
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  note?: string;

  @ApiProperty({
    example: PosTerminalType.SIM,
    required: false,
    enum: PosTerminalType,
  })
  @IsEnum(PosTerminalType)
  @IsString()
  @IsOptional()
  posType: PosTerminalType;
}
