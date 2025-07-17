import { Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiExcludeEndpoint, ApiOperation } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { IsPublic } from "./_core/decorators/isPulic.decorator";
import { CommonResponse } from "./_core/helpers/common.helper";
import { ICommonResponse } from "./_core/interfaces/common.interface";
import { ReturnStatus } from "./_core/constants/common.constants";
import { BankService } from "./modules/bank/bank.service";

@Controller()
export class AppController {
  constructor(
    private readonly _coreService: AppService,
    private readonly bankService: BankService,
  ) {}

  @ApiExcludeEndpoint()
  @Get()
  @IsPublic()
  getHello(): string {
    return this._coreService.getHello();
  }

  @ApiOperation({
    summary: "Initialize",
    description: "This endpoint initializes the bank system.",
  })
  @HttpCode(HttpStatus.OK)
  @Post("/initialize")
  async initialize(): Promise<ICommonResponse> {
    await this.bankService.initializeBank();

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Initialized successfully",
      data: {},
    });
  }
}
