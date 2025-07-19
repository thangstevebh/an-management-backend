import { ApiProperty } from "@nestjs/swagger";
import { PageOptionsDto } from "@src/_core/constants/common.constants";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";

export class ListCollaboratorFilterDto extends PageOptionsDto {
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
}
