import { ApiProperty } from "@nestjs/swagger";
import { WithdrawCommandStatus } from "@src/modules/card/card.constant";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ConfirmWithdrawCommandDto {
  @ApiProperty({
    example: "687d19fd244c963c9d019295",
    required: true,
  })
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  confirmCommandId: string;

  @ApiProperty({
    example: WithdrawCommandStatus.PENDING,
    enum: WithdrawCommandStatus,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(WithdrawCommandStatus)
  status: WithdrawCommandStatus;

  @ApiProperty({
    example: "WR-2025-7-20-3227",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim().toUpperCase() : value,
  )
  code: string;

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
