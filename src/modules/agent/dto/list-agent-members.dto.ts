import { ApiProperty } from "@nestjs/swagger";
import { PageOptionsDto } from "@src/_core/constants/common.constants";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { AgentRole } from "../agent.constant";

export class ListAgentMembersFilterDto extends PageOptionsDto {
  @ApiProperty({
    example: "agent123",
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
    example: AgentRole.MEMBER,
    enum: AgentRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(AgentRole)
  agentRole?: AgentRole | null = null;
}
