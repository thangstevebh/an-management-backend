import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { WithdrawCommandStatus } from "../card.constant";
import { Card } from "./card.schema";
import { Agent } from "@src/modules/agent/schema/agent.schema";
import { User } from "@src/modules/user/schema/user.schema";
import { CardDetail } from "./card-detail.schema";

export type CardWithdrawCommandDocument = HydratedDocument<CardWithdrawCommand> &
  SoftDeleteDocument;
export const CARD_WITHDRAW_COMMAND_COLLECTION = "card-withdraw-commmands";

@Schema({ timestamps: true, versionKey: false, collection: CARD_WITHDRAW_COMMAND_COLLECTION })
export class CardWithdrawCommand {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: Card.name,
  })
  cardId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: Agent.name,
  })
  agentId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(WithdrawCommandStatus),
    default: WithdrawCommandStatus.PENDING,
  })
  status: WithdrawCommandStatus;

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
  withdrawRequestedAmount: number;

  @Prop({
    type: Date,
    required: false,
    default: Date.now,
  })
  atDate: Date;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isConfirmed: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: User.name,
    default: null,
  })
  confirmedBy?: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  createdBy: MongooseSchema.Types.ObjectId;

  // When comfirmed, this will be set to the card detail id with CardDetail have isCurrent = true
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: CardDetail.name,
    default: null,
  })
  cardDetailId?: MongooseSchema.Types.ObjectId;
}

export const CardWithdrawCommandSchema = SchemaFactory.createForClass(CardWithdrawCommand);

CardWithdrawCommandSchema.plugin(softDeletePlugin);
