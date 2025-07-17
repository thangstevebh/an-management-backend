import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { USER_COLLECTION } from "@src/modules/user/schema/user.schema";
import { CORRESPONDENT_SUMARY_COLLECTION } from "./correspondent-summary.schema";

export type CorrespondentDocument = HydratedDocument<Correspondent> & SoftDeleteDocument;
export const CORRESPONDENT_COLLECTION = "correspondents";

@Schema({ timestamps: true, versionKey: false, collection: CORRESPONDENT_COLLECTION })
export class Correspondent {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: CORRESPONDENT_SUMARY_COLLECTION,
    default: null,
  })
  correspondentSumaryId?: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  advancePayment: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  refundPayment: number;

  @Prop({
    type: String,
    required: false,
    default: null,
    trim: true,
    maxlength: 500,
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

export const CorrespondentSchema = SchemaFactory.createForClass(Correspondent);

CorrespondentSchema.plugin(softDeletePlugin);
