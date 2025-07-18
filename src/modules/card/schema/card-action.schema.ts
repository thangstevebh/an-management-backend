import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { CARD_COLLECTION } from "./card.schema";
import { POS_TERMINAL_SUMMARY_COLLECTION } from "@src/modules/pos-terminal/schema/pos-terminal-summary.schema";
import { POS_TERMINAL_COLLECTION } from "@src/modules/pos-terminal/schema/pos-terminal.schema";

export type CardBillDocument = HydratedDocument<CardBill> & SoftDeleteDocument;
export const CARD_BILL_COLLECTION = "card-bills";

@Schema({ timestamps: true, versionKey: false, collection: CARD_BILL_COLLECTION })
export class CardBill {
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
    ref: POS_TERMINAL_SUMMARY_COLLECTION,
  })
  posTerminalSummaryId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: POS_TERMINAL_COLLECTION,
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
}

export const CardBillSchema = SchemaFactory.createForClass(CardBill);

CardBillSchema.plugin(softDeletePlugin);
