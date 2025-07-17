import { Module } from "@nestjs/common";
import { PosTerminalController } from "./pos-terminal.controller";
import { PosTerminalService } from "./pos-terminal.service";
import { PosTerminal, PosTerminalSchema } from "./schema/pos-terminal.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { PosTerminalSummary, PosTerminalSummarySchema } from "./schema/pos-terminal-summary.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PosTerminal.name,
        schema: PosTerminalSchema,
      },
      {
        name: PosTerminalSummary.name,
        schema: PosTerminalSummarySchema,
      },
    ]),
  ],
  controllers: [PosTerminalController],
  providers: [PosTerminalService],
  exports: [PosTerminalService],
})
export class PosTerminalModule {}
