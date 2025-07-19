import { SetMetadata } from "@nestjs/common";

export const IS_AGENT_REQUIRED = "isAgentRequired";
export const IsAgentRequired = () => SetMetadata(IS_AGENT_REQUIRED, true);
