import { SetMetadata } from "@nestjs/common";
import { AgentRole } from "@src/modules/agent/agent.constant";

export const AGENT_ROLES_KEY = "agent_roles";

export const AgentRoles = (...roles: AgentRole[]) => SetMetadata(AGENT_ROLES_KEY, roles);
