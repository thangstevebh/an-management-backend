import { ApiProperty } from "@nestjs/swagger";
import { PageOptionsDto } from "@src/_core/constants/common.constants";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from "class-validator";
import { CommandType, InCommingCommandStatus } from "@src/modules/card/card.constant";

export class ListCommandsFilterDto extends PageOptionsDto {
  @ApiProperty({
    example: CommandType.INCOMMING,
    enum: CommandType,
    required: true,
  })
  @IsOptional()
  @IsEnum(CommandType)
  commandType: CommandType;

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
    example: "1234567890abcdef123456",
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  _id?: string;

  @ApiProperty({
    example: InCommingCommandStatus.PENDING,
    enum: InCommingCommandStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(InCommingCommandStatus)
  status?: InCommingCommandStatus | null = null;

  @ApiProperty({
    example: "1234567890abcdef123456",
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  agentId?: string;
}
