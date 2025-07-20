import { Module } from "@nestjs/common";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Card, CardSchema } from "./schema/card.schema";
import { CardCollaborator, CardCollaboratorSchema } from "./schema/card-collaborator.schema";
import { CardDetail, CardDetailSchema } from "./schema/card-detail.schema";
import { CardBill, CardBillSchema } from "./schema/card-action.schema";
import {
  CardIncomingCommand,
  CardIncomingCommandSchema,
} from "./schema/card-incomming-command.schema";
import { CardSummary, CardSummarySchema } from "./schema/card-summary.schema";
import {
  CardWithdrawCommand,
  CardWithdrawCommandSchema,
} from "./schema/card-withdraw-request.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Card.name,
        schema: CardSchema,
      },
      {
        name: CardCollaborator.name,
        schema: CardCollaboratorSchema,
      },
      {
        name: CardBill.name,
        schema: CardBillSchema,
      },
      {
        name: CardDetail.name,
        schema: CardDetailSchema,
      },
      {
        name: CardIncomingCommand.name,
        schema: CardIncomingCommandSchema,
      },
      {
        name: CardWithdrawCommand.name,
        schema: CardWithdrawCommandSchema,
      },
      {
        name: CardSummary.name,
        schema: CardSummarySchema,
      },
    ]),
  ],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
