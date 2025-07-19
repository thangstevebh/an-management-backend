import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { SoftDeleteDocument, softDeletePlugin } from "@src/_core/plugins/softDeleteMongoose.plugin";
import { AGENT_COLLECTION } from "./agent.schema";
import { USER_COLLECTION } from "@src/modules/user/schema/user.schema";
import { AgentRole } from "../agent.constant";

export type AgentUserDocument = HydratedDocument<AgentUser> & SoftDeleteDocument;
export const AGENT_USER_COLLECTION = "agent-users";

@Schema({ timestamps: true, versionKey: false, collection: AGENT_USER_COLLECTION })
export class AgentUser {
  _id: MongooseSchema.Types.ObjectId;

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
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(AgentRole),
    default: AgentRole.MEMBER,
  })
  agentRole: AgentRole;

  @Prop({
    type: Boolean,
    required: false,
    default: true,
  })
  isActive: boolean;
}

export const AgentUserSchema = SchemaFactory.createForClass(AgentUser);

AgentUserSchema.plugin(softDeletePlugin);
