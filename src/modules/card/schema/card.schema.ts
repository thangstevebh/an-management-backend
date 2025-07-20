import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { AGENT_COLLECTION } from "@src/modules/agent/schema/agent.schema";
import { CARD_COLLABORATOR_COLLECTION } from "./card-collaborator.schema";

export type CardDocument = HydratedDocument<Card> & SoftDeleteDocument;
export const CARD_COLLECTION = "cards";

@Schema({ timestamps: true, versionKey: false, collection: CARD_COLLECTION })
export class Card {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 100,
    minlength: 2,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 50,
    minlength: 3,
  })
  bankCode: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 4,
    minlength: 4,
  })
  lastNumber: string;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  defaultFeePercent: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  feeBack: number;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  maturityDate?: Date;

  @Prop({
    type: String,
    required: false,
    default: null,
    trim: true,
    maxlength: 1000,
    minlength: 0,
  })
  note?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: AGENT_COLLECTION,
  })
  agentId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: CARD_COLLABORATOR_COLLECTION,
    default: null,
  })
  cardCollaboratorId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: Boolean,
    required: false,
    default: true,
  })
  isActive: boolean;
}

export const CardSchema = SchemaFactory.createForClass(Card);

CardSchema.plugin(softDeletePlugin);
