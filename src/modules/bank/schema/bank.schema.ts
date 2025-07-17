import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";

export type BankDocument = HydratedDocument<Bank> & SoftDeleteDocument;
export const USER_COLLECTION = "banks";

@Schema({ timestamps: true, versionKey: false, collection: USER_COLLECTION })
export class Bank {
  _id: ObjectId;

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
