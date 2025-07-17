import { Module } from "@nestjs/common";
import { CorrespondentController } from "./correspondent.controller";
import { CorrespondentService } from "./correspondent.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Correspondent, CorrespondentSchema } from "./schema/corrspondent.schema";
import {
  CorrespondentSumary,
  CorrespondentSumarySchema,
} from "./schema/correspondent-summary.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Correspondent.name,
        schema: CorrespondentSchema,
      },
      {
        name: CorrespondentSumary.name,
        schema: CorrespondentSumarySchema,
      },
    ]),
  ],
  controllers: [CorrespondentController],
  providers: [CorrespondentService],
  exports: [CorrespondentService],
})
export class CorrespondentModule {}
