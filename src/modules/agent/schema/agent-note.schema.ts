import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { Agent } from "./agent.schema";
import { User } from "@src/modules/user/schema/user.schema";

export type AgentNoteDocument = HydratedDocument<AgentNote> & SoftDeleteDocument;
export const AGENT_NOTE_COLLECTION = "agent-notes";

@Schema({ timestamps: true, versionKey: false, collection: AGENT_NOTE_COLLECTION })
export class AgentNote {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: Agent.name,
  })
  agentId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  })
  content: string;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isMarked: boolean;
}

export const AgentNoteSchema = SchemaFactory.createForClass(AgentNote);

AgentNoteSchema.plugin(softDeletePlugin);
