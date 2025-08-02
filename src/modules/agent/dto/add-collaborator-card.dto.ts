import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AddCollaboratorCardDto {
  @ApiProperty({
    example: "JOHN DOE",
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
}
