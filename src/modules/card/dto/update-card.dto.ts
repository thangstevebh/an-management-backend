import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCardDto {
  @ApiProperty({
    example: "cardId123",
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiProperty({
    example: "agentId123",
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => value?.trim())
  agentId?: string;

  @ApiProperty({
    example: "cardCollaboratorId123",
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsMongoId()
  cardCollaboratorId?: string;

  @ApiProperty({
    example: "1234567890123456",
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  cardNumber?: string;

  @ApiProperty({
    example: "TECH",
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  bankCode?: string;

  @ApiProperty({
    example: "7890",
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  lastNumber?: string;

  @ApiProperty({
    example: 1.2,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  defaultFeePercent?: number;

  @ApiProperty({
    example: 100,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  feeBack?: number;

  @ApiProperty({
    example: "2023-12-31T23:59:59.999Z",
    type: Date,
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  maturityDate?: Date;

  @ApiProperty({
    example: "New note",
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  note?: string;
}
