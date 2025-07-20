import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { CARD_COLLECTION } from "./card.schema";
import { USER_COLLECTION } from "@src/modules/user/schema/user.schema";
import { CardSummaryStatus } from "../card.constant";

export type CardSummaryDocument = HydratedDocument<CardSummary> & SoftDeleteDocument;
export const CARD_SUMMARY_COLLECTION = "card-summaries";

@Schema({ timestamps: true, versionKey: false, collection: CARD_SUMMARY_COLLECTION })
export class CardSummary {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: CARD_COLLECTION,
  })
  cardId: MongooseSchema.Types.ObjectId;

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
  amount: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  withdrawAmount: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  remainingAmount: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  negativeAmount: number;

  @Prop({
    type: Date,
    required: false,
    default: Date.now,
  })
  atDate: Date;

  @Prop({
    type: String,
    required: false,
    enum: Object.values(CardSummaryStatus),
    default: CardSummaryStatus.PENDING,
  })
  status?: CardSummaryStatus;

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

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: USER_COLLECTION,
  })
  createdBy: MongooseSchema.Types.ObjectId;
}

export const CardSummarySchema = SchemaFactory.createForClass(CardSummary);

CardSummarySchema.plugin(softDeletePlugin);
