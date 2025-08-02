import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { User } from "@src/modules/user/schema/user.schema";

export type CorrespondentSumaryDocument = HydratedDocument<CorrespondentSumary> &
  SoftDeleteDocument;
export const CORRESPONDENT_SUMARY_COLLECTION = "correspondent-summaries";

@Schema({ timestamps: true, versionKey: false, collection: CORRESPONDENT_SUMARY_COLLECTION })
export class CorrespondentSumary {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: Date,
    required: true,
    validate: {
      validator: function (v: Date) {
        return v instanceof Date && !isNaN(v.getTime());
      },
      message: "Invalid date format",
    },
  })
  fromDate: Date;

  @Prop({
    type: Date,
    required: true,
    validate: {
      validator: function (v: Date) {
        return v instanceof Date && !isNaN(v.getTime());
      },
      message: "Invalid date format",
    },
  })
  endDate: Date;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    default: 0,
  })
  totalDate: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  percent: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  total: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  createdBy: MongooseSchema.Types.ObjectId;
}

export const CorrespondentSumarySchema = SchemaFactory.createForClass(CorrespondentSumary);

CorrespondentSumarySchema.plugin(softDeletePlugin);
