import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { CARD_COLLECTION } from "./card.schema";
import { USER_COLLECTION } from "@src/modules/user/schema/user.schema";
import { CARD_DETAIL_COLLECTION } from "./card-detail.schema";
import { InCommingCommandStatus } from "../card.constant";
import { AGENT_COLLECTION } from "@src/modules/agent/schema/agent.schema";

export type CardIncomingCommandDocument = HydratedDocument<CardIncomingCommand> &
  SoftDeleteDocument;
export const CARD_INCOMMING_COMMAND_COLLECTION = "card-incomming-commmands";

@Schema({ timestamps: true, versionKey: false, collection: CARD_INCOMMING_COMMAND_COLLECTION })
export class CardIncomingCommand {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: CARD_COLLECTION,
  })
  cardId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: AGENT_COLLECTION,
  })
  agentId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(InCommingCommandStatus),
    default: InCommingCommandStatus.PENDING,
  })
  status: InCommingCommandStatus;

  @Prop({
    type: String,
    required: false,
    trim: true,
    minlength: 1,
    default: null,
  })
  note: string;

  @Prop({
    type: String,
    required: false,
    uppercase: true,
    unique: true,
    trim: true,
  })
  code: string;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  incommingAmount: number;

  @Prop({
    type: Date,
    required: false,
    default: Date.now,
  })
  atDate: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: USER_COLLECTION,
  })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isConfirmed: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: USER_COLLECTION,
    default: null,
  })
  confirmedBy?: MongooseSchema.Types.ObjectId;

  // When comfirmed, this will be set to the card detail id with CardDetail have isCurrent = true
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: CARD_DETAIL_COLLECTION,
    default: null,
  })
  cardDetailId?: MongooseSchema.Types.ObjectId;
}

export const CardIncomingCommandSchema = SchemaFactory.createForClass(CardIncomingCommand);

CardIncomingCommandSchema.plugin(softDeletePlugin);
