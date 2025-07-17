import { Module } from "@nestjs/common";
import { BankService } from "./bank.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Bank, BankSchema } from "./schema/bank.schema";
import { BankController } from './bank.controller';

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
  controllers: [BankController],
})
export class BankModule {}
