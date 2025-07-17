import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { USER_COLLECTION } from "@src/modules/user/schema/user.schema";
import { AGENT_COLLECTION } from "@src/modules/agent/schema/agent.schema";

export type DebtDocument = HydratedDocument<Debt> & SoftDeleteDocument;
export const DEBT_COLLECTION = "debts";

@Schema({ timestamps: true, versionKey: false, collection: DEBT_COLLECTION })
export class Debt {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  totalRevenue: number;

  @Prop({
    type: String,
    required: false,
    default: null,
    trim: true,
    maxlength: 500,
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
    required: true,
    ref: USER_COLLECTION,
  })
  createdBy: MongooseSchema.Types.ObjectId;
}

export const DebtSchema = SchemaFactory.createForClass(Debt);

DebtSchema.plugin(softDeletePlugin);
