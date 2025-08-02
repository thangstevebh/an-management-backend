import { ObjectId } from "mongoose";
import { AgentRole } from "../agent/agent.constant";

export interface IUserJWT {
  _id: string | ObjectId;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  agentId?: ObjectId | null;
  agentRole?: AgentRole | null;
  isChangedPassword: boolean;
}
