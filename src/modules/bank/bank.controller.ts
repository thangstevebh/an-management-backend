import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { ReturnStatus } from "@src/_core/constants/common.constants";
import { CommonResponse } from "@src/_core/helpers/common.helper";
import { ICommonResponse } from "@src/_core/interfaces/common.interface";
import { BankService } from "./bank.service";
import { FilterBanksDto } from "./dto/filter-banks.dto";
import { startCase as _startCase } from "lodash";
import { IsPublic } from "@src/_core/decorators/isPulic.decorator";

@Controller("bank")
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @ApiOperation({
    summary: "List Banks",
    description: "This endpoint retrieves a list of banks.",
  })
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Get("/list-banks")
  async getListBanks(@Query() payload: FilterBanksDto): Promise<ICommonResponse> {
    const banks = await this.bankService.getListBanks({
      code: payload.code ? payload.code.toLowerCase() : undefined,
    });

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "List of banks retrieved successfully",
      data: {
        total: banks.length,
        banks: banks.map((bank) => ({
          _id: bank._id,
          name: _startCase(bank.name),
          code: bank.code.toUpperCase(),
        })),
      },
    });
  }
}
