import { Controller, Get } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { IsPublic } from "./_core/decorators/isPulic.decorator";

@Controller()
export class AppController {
  constructor(private readonly _coreService: AppService) {}

  @ApiExcludeEndpoint()
  @Get()
  @IsPublic()
  getHello(): string {
    return this._coreService.getHello();
  }
}
