import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";

export type BankDocument = HydratedDocument<Bank> & SoftDeleteDocument;
export const BANK_COLLECTION = "banks";

@Schema({ timestamps: true, versionKey: false, collection: BANK_COLLECTION })
export class Bank {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 1000,
    minlength: 3,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 50,
    minlength: 3,
  })
  code: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 50,
    minlength: 3,
  })
  bankType: string;
}

export const BankSchema = SchemaFactory.createForClass(Bank);

BankSchema.plugin(softDeletePlugin);
