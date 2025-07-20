import { ApiProperty } from "@nestjs/swagger";
import { InCommingCommandStatus } from "@src/modules/card/card.constant";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ConfirmIncommingCommandDto {
  @ApiProperty({
    example: "687cf99561c650ce3c611f8c",
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
    example: InCommingCommandStatus.PENDING,
    enum: InCommingCommandStatus,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(InCommingCommandStatus)
  status: InCommingCommandStatus;

  @ApiProperty({
    example: "IC-2025-7-20-4449",
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
