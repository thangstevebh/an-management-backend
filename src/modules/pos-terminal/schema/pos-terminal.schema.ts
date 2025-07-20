import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { USER_COLLECTION } from "@src/modules/user/schema/user.schema";
import { AGENT_COLLECTION } from "@src/modules/agent/schema/agent.schema";
import { PosTerminalStatus, PosTerminalType } from "../pos-terminal.constant";

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

  @Prop({
    type: Number,
    required: false,
    min: 0,
    max: 100,
    default: 0,
  })
  feePercentNormal?: number;

  @Prop({
    type: Number,
    required: false,
    min: 0,
    max: 100,
    default: 0,
  })
  feePercentMB: number;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(PosTerminalStatus),
    default: PosTerminalStatus.ACTIVE,
  })
  status: PosTerminalStatus;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(PosTerminalType),
    default: PosTerminalType.WIFI,
  })
  posType: PosTerminalType;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: AGENT_COLLECTION,
    default: null,
  })
  agentId?: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: USER_COLLECTION,
  })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  sendAt?: Date;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  receivedAt?: Date;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  sendBackAt?: Date;

  @Prop({
    type: String,
    required: false,
    default: null,
    trim: true,
  })
  note?: string;
}

export const PosTerminalSchema = SchemaFactory.createForClass(PosTerminal);

PosTerminalSchema.plugin(softDeletePlugin);
