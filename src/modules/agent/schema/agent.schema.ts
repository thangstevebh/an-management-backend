import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";

export type AgentDocument = HydratedDocument<Agent> & SoftDeleteDocument;
export const AGENT_COLLECTION = "agents";

@Schema({ timestamps: true, versionKey: false, collection: AGENT_COLLECTION })
export class Agent {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: 50,
    minlength: 3,
  })
  name: string;

  @Prop({
    type: Boolean,
    required: true,
    default: true,
  })
  isMain: boolean;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);

AgentSchema.plugin(softDeletePlugin);
