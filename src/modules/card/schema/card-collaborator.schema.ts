import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { AGENT_COLLECTION } from "@src/modules/agent/schema/agent.schema";

export type CardCollaboratorDocument = HydratedDocument<CardCollaborator> & SoftDeleteDocument;
export const CARD_COLLABORATOR_COLLECTION = "card-collaborators";

@Schema({ timestamps: true, versionKey: false, collection: CARD_COLLABORATOR_COLLECTION })
export class CardCollaborator {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 1000,
    minlength: 3,
  })
  name: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: AGENT_COLLECTION,
  })
  agentId: MongooseSchema.Types.ObjectId;
}

export const CardCollaboratorSchema = SchemaFactory.createForClass(CardCollaborator);

CardCollaboratorSchema.plugin(softDeletePlugin);
