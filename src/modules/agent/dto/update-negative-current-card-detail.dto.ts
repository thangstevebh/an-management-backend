import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateNegativeCurrentCardDetailDto {
  @ApiProperty({
    example: 100000,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  negativeAmount: number;

  @ApiProperty({
    example: "006",
    required: true,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams): string =>
    typeof value == "string" ? value.trim() : value,
  )
  note?: string;
}
