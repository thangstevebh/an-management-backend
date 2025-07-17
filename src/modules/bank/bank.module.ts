import { Module } from "@nestjs/common";
import { BankService } from "./bank.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Bank, BankSchema } from "./schema/bank.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Bank.name,
        schema: BankSchema,
      },
    ]),
  ],
  providers: [BankService],
  exports: [BankService],
})
export class BankModule {}
