import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { Card } from "./card.schema";
import { Agent } from "@src/modules/agent/schema/agent.schema";
import { CardSummary } from "./card-summary.schema";
import { PosTerminalSummary } from "@src/modules/pos-terminal/schema/pos-terminal-summary.schema";
import { PosTerminal } from "@src/modules/pos-terminal/schema/pos-terminal.schema";
import { User } from "@src/modules/user/schema/user.schema";

export type CardBillDocument = HydratedDocument<CardBill> & SoftDeleteDocument;
export const CARD_BILL_COLLECTION = "card-bills";

@Schema({ timestamps: true, versionKey: false, collection: CARD_BILL_COLLECTION })
export class CardBill {
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
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: CardSummary.name,
    default: null,
  })
  cardSummaryId?: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: PosTerminalSummary.name,
    default: null,
  })
  posTerminalSummaryId?: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: PosTerminal.name,
  })
  posTerminalId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    maxlength: 100,
    minlength: 2,
  })
  posTerminalName: string;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  amount: number;

  @Prop({
    type: String,
    required: true,
    trim: true,
    maxlength: 10,
    minlength: 1,
  })
  lot: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 100,
    minlength: 1,
  })
  billNumber: string;

  @Prop({
    type: String,
    required: false,
    trim: true,
    default: null,
  })
  note?: string;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  customerFee: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  customerFeeAmount: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  posFee: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  posFeeAmount: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  backFee: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  backFeeAmount: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  differenceFee: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  differenceFeeAmount: number;

  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  atDate: Date;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  paidDate?: Date;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isMarkedDebt: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isConfirmed: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: User.name,
    default: null,
  })
  confirmedBy?: MongooseSchema.Types.ObjectId;
}

export const CardBillSchema = SchemaFactory.createForClass(CardBill);

CardBillSchema.plugin(softDeletePlugin);
