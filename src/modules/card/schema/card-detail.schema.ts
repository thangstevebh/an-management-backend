import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { Card } from "./card.schema";

export type CardDetailDocument = HydratedDocument<CardDetail> & SoftDeleteDocument;
export const CARD_DETAIL_COLLECTION = "card-details";

@Schema({ timestamps: true, versionKey: false, collection: CARD_DETAIL_COLLECTION })
export class CardDetail {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: Card.name,
  })
  cardId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: false,
    trim: true,
    minlength: 1,
    default: null,
  })
  detail: string;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  })
  feePercent: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  amount: number;

  // @Prop({
  //   type: MongooseSchema.Types.Decimal128,
  //   required: true,
  //   min: 0,
  //   default: 0,
  // })
  // notWithdrawAmount: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  withdrawedAmount: number;

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true,
    min: 0,
    default: 0,
  })
  negativeRemainingAmount: number;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  withdrawedDate?: Date;

  @Prop({
    type: Date,
    required: false,
    default: Date.now,
  })
  fromDate?: Date;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  endDate?: Date;

  @Prop({
    type: Boolean,
    required: false,
    default: true,
  })
  isCurrent: boolean;
}

export const CardDetailSchema = SchemaFactory.createForClass(CardDetail);

CardDetailSchema.plugin(softDeletePlugin);
