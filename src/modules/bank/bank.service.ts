import { Injectable } from "@nestjs/common";
import bankSeed from "./seed/bank-seed.json";
import { InjectModel } from "@nestjs/mongoose";
import { Bank } from "./schema/bank.schema";
import { Model } from "mongoose";

@Injectable()
export class BankService {
  constructor(
    @InjectModel(Bank.name)
    private readonly bankModel: Model<Bank>,
  ) {}

  async initializeBank(): Promise<any> {
    await this.bankModel.deleteMany({});
    await this.bankModel.insertMany(bankSeed);

    return true;
  }
}
