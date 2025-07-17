import { Module } from "@nestjs/common";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Card, CardSchema } from "./schema/card.schema";
import { CardCollaborator, CardCollaboratorSchema } from "./schema/card-collaborator.schema";
import { CardAction, CardActionSchema } from "./schema/card-action.schema";
import { CardDetail, CardDetailSchema } from "./schema/card-detail.schema";

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
        name: CardAction.name,
        schema: CardActionSchema,
      },
      {
        name: CardDetail.name,
        schema: CardDetailSchema,
      },
    ]),
  ],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
