import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { PosTerminalModule } from "../pos-terminal/pos-terminal.module";
import { CardModule } from "../card/card.module";

@Module({
  imports: [PosTerminalModule, CardModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
