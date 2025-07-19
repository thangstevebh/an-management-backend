import { ApiProperty } from "@nestjs/swagger";
import { PageOptionsDto } from "@src/_core/constants/common.constants";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { PosTerminalStatus } from "@src/modules/pos-terminal/pos-terminal.constant";

export class ListPOSFilterDto extends PageOptionsDto {
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
    example: PosTerminalStatus.ACTIVE,
    enum: PosTerminalStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PosTerminalStatus)
  status?: PosTerminalStatus | null = null;
}
