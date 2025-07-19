import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { IsEnum, IsInt, IsNumberString, IsOptional, Max, MaxLength, Min } from "class-validator";
import { config } from "dotenv";
config();

export enum GLOBAL_MESSAGES {
  ORIGIN_NOT_IN_WHITELIST = "Origin not in whitelist",
  UNAUTHORIZED = "Unauthorized",
  SOCKET_ORIGIN_NOT_IN_WHITELIST = "Socket origin not in whitelist",
  PERMISSION_FAILED = "Permission failed",
}

export enum GLOBAL_LANGUAGE {
  VI = "vi",
  EN = "en",
}

export enum ReturnStatus {
  SUCCESS = "success",
  ERROR = "error",
}

export const ADMIN_KEY = process.env.ADMIN_KEY || "adminkey123@";
export enum QueryOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: QueryOrder, default: QueryOrder.ASC })
  @IsEnum(QueryOrder)
  @IsOptional()
  readonly order?: QueryOrder = QueryOrder.ASC;

  @ApiPropertyOptional({
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page?: number = 0;

  @ApiPropertyOptional({
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Max(100)
  @IsOptional()
  limit?: number = 0;

  get skip(): number {
    if (this.page === undefined || this.limit === undefined || this.page < 1 || this.limit < 1) {
      return 0;
    }
    return (this.page - 1) * this.limit;
  }
}
