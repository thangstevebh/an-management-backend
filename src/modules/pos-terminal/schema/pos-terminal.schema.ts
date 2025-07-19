import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { USER_COLLECTION } from "@src/modules/user/schema/user.schema";
import { AGENT_COLLECTION } from "@src/modules/agent/schema/agent.schema";
import { PosTerminalStatus } from "../pos-terminal.constant";

export type PosTerminalDocument = HydratedDocument<PosTerminal> & SoftDeleteDocument;
export const POS_TERMINAL_COLLECTION = "pos-terminals";

@Schema({ timestamps: true, versionKey: false, collection: POS_TERMINAL_COLLECTION })
export class PosTerminal {
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
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  feePerDay: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  feePerTerminal: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  feeBack: number;

  // @Prop({
  //   type: MongooseSchema.Types.Decimal128,
  //   required: true,
  //   min: 0,
  //   max: 100,
  //   default: 0,
  // })
  // defaultFeePercent: number;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(PosTerminalStatus),
    default: PosTerminalStatus.ACTIVE,
  })
  status: PosTerminalStatus;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: AGENT_COLLECTION,
  })
  agentId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: USER_COLLECTION,
  })
  createdBy: MongooseSchema.Types.ObjectId;
}

export const PosTerminalSchema = SchemaFactory.createForClass(PosTerminal);

PosTerminalSchema.plugin(softDeletePlugin);
