import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, Schema as MongooseSchema } from "mongoose";
import { UserRole } from "../user.constant";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";

export type UserDocument = HydratedDocument<User> & SoftDeleteDocument;
export const USER_COLLECTION = "users";

@Schema({ timestamps: true, versionKey: false, collection: USER_COLLECTION })
export class User {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 50,
    minlength: 6,
  })
  username: string;

  @Prop({ type: String, required: false, default: null, trim: true, maxlength: 50, minlength: 3 })
  firstName: string;

  @Prop({ type: String, required: false, default: null, trim: true, maxlength: 50, minlength: 3 })
  lastName: string;

  @Prop({
    type: String,
    required: false,
    default: null,
    trim: true,
    /*
     * validate phone number
     * */
    validate: {
      validator: function (v: string) {
        return !v || /^\d{10}|\d{11}$/.test(v);
      },
      message: "Phone number must be 10 or 11 digits",
    },
  })
  phoneNumber?: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop({ type: String, required: true, trim: true })
  password: string;

  @Prop({ type: String, required: false, default: false })
  isChangedPassword: boolean;

  // @Prop({ type: Date, default: null })
  // deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(softDeletePlugin);
