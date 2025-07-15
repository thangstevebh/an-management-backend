import { Controller, Get } from "@nestjs/common";
// import {
//   HealthCheckService,
//   HttpHealthIndicator,
//   MemoryHealthIndicator,
//   MikroOrmHealthIndicator,
// } from "@nestjs/terminus";
import { AppService } from "./app.service";
// import { IsPublic } from "./_core/decorators/isPulic.decorator";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    // private health: HealthCheckService,
    // private http: HttpHealthIndicator,
    // private db: MikroOrmHealthIndicator,
    // private memory: MemoryHealthIndicator,
  ) {}

  @Get("")
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get("/health")
  // // @IsPublic()
  // checkHealth() {
  //   return this.health.check([
  //     () => this.db.pingCheck("database"),
  //
  //     () => this.memory.checkHeap("memory_heap", 150 * 1024 * 1024),
  //   ]);
  // }
}
