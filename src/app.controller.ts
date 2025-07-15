import { Controller, Get } from "@nestjs/common";
import { AppService } from "@/app.service";
import { HealthCheckService, MemoryHealthIndicator } from "@nestjs/terminus";
import { IsPublic } from "./_core/decorators/isPulic.decorator";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get("/hello")
  @IsPublic()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/health")
  @IsPublic()
  checkHealth() {
    console.log("Health check initiated");
    return this.health.check([
      () => this.memory.checkHeap("memory_heap", 150 * 1024 * 1024),
    ]);
  }
}
