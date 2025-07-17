import { Module } from "@nestjs/common";
import { DebtController } from "./debt.controller";
import { DebtService } from "./debt.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Debt, DebtSchema } from "./schema/debt-summary.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Debt.name,
        schema: DebtSchema,
      },
    ]),
  ],
  controllers: [DebtController],
  providers: [DebtService],
  exports: [DebtService],
})
export class DebtModule {}
