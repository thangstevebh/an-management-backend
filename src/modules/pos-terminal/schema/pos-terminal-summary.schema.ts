import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { USER_COLLECTION } from "@src/modules/user/schema/user.schema";
import { AGENT_COLLECTION } from "@src/modules/agent/schema/agent.schema";
import { POS_TERMINAL_COLLECTION } from "./pos-terminal.schema";
import { PosTerminalSummaryStatus } from "../pos-terminal.constant";

export type PosTerminalSummaryDocument = HydratedDocument<PosTerminalSummary> & SoftDeleteDocument;
export const POS_TERMINAL_SUMMARY_COLLECTION = "pos-terminal-summaries";

@Schema({ timestamps: true, versionKey: false, collection: POS_TERMINAL_SUMMARY_COLLECTION })
export class PosTerminalSummary {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: POS_TERMINAL_COLLECTION,
  })
  posTerminalId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: AGENT_COLLECTION,
  })
  agentId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  totalAmount: number;

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
  posFeePerDay: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  posFeePerDayAmount: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  posFeePerTerminal: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  posFeePerTerminalAmount: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  feeBack: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  posFeeBackAmount: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  withdrawAmount: number;

  @Prop({
    type: String,
    required: true,
    trim: true,
    maxlength: 10,
    minlength: 1,
  })
  lot: string;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  transferAmount: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  refundAmount: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  remainingAmount: number;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(PosTerminalSummaryStatus),
    default: PosTerminalSummaryStatus.PENDING,
  })
  status: PosTerminalSummaryStatus;

  @Prop({
    type: String,
    required: false,
    trim: true,
    maxlength: 1000,
    minlength: 0,
    default: null,
  })
  note?: string;

  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  atDate: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: USER_COLLECTION,
  })
  createdBy: MongooseSchema.Types.ObjectId;
}

export const PosTerminalSummarySchema = SchemaFactory.createForClass(PosTerminalSummary);

PosTerminalSummarySchema.plugin(softDeletePlugin);
